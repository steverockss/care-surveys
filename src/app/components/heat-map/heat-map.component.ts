import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { SurveyService } from '../../services/surveys.service';
import { EChartsOption } from 'echarts';
import { SurveyFilters } from '../../models/survery-filters'
import { CARE_CATEGORIES } from '../../models/constants';
import { calculateAverage, getCities } from '../../utils/survery-utils';

@Component({
  selector: 'app-heat-map',
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './heat-map.component.html',
  styleUrl: './heat-map.component.css'
})
export class HeatMapComponent implements OnInit {
  loading = true;
  constructor(private surveyService: SurveyService) { }

  cities: string[] = [];
  chartOption!: EChartsOption;  


  ngOnInit() {
    this.processSurveys()

  }
  async processSurveys(){
    const surveys = await this.surveyService.getSurveys();
    this.cities = getCities(surveys)

    const heatmapData: [number, number, number][] = [];

    for(let cityIdx = 0; cityIdx < this.cities.length; cityIdx ++){
      const city = this.cities[cityIdx]
      const surveysByCity =  await this.surveyService.getSurveys({city});
      const averagesPerCity = calculateAverage(surveysByCity)
      averagesPerCity.forEach((avg, catIdx) => {
        heatmapData.push([catIdx, cityIdx, avg])
      })
    }
    this.loading = false;


    this.chartOption = {
      title: {
        text: 'Mapa de Calor: Ciudad vs Categoría',
        left: 'center',
        textStyle: { fontSize: 16 }
      },
      tooltip: {
        position: 'top',
        formatter: (params:any) =>{
          const [catIdx, cityIdx, value] = params.value as [number, number, number];
          return `Categoría: ${CARE_CATEGORIES[catIdx]}<br/>Ciudad: ${this.cities[cityIdx]}<br/>Valor: ${value}`;
        }
      },
      grid: {
        height: '60%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: CARE_CATEGORIES,
        splitArea: { show: true }
      },
      yAxis: {
        type: 'category',
        data:this.cities,
        splitArea: { show: true }
      },
      visualMap: {
        min: 1,
        max: 5,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%'
      },
      series: [
        {
          name: 'Promedio',
          type: 'heatmap',
          data: heatmapData,
          emphasis: {
            itemStyle: {
              borderColor: '#333',
              borderWidth: 1
            }
          }
        }
      ]
    };
  }


}
