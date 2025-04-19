import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { SurveyService } from '../../../services/surveys.service';
import { EChartsOption } from 'echarts';
import { SurveyFilters } from '../../../models/survery-filters'
import { CARE_CATEGORIES } from '../../../models/constants';
import { calculateAverage, getCities, getSchools } from '../../../utils/survery-utils';

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
  schools: string[] = []
  chartOption!: EChartsOption;


  ngOnInit() {
    this.getSurveys().then(
      surveys => {
        this.generateCityMap(surveys)
        this.generateSchoolMap(surveys)
      }
    )

  }
  async getSurveys() {
    return await this.surveyService.getSurveys();
  }
  async generateSchoolMap(surveys: any) {
    this.schools = getSchools(surveys)

    const heatmapData: [number, number, number][] = [];

    for (let schoolIdx = 0; schoolIdx < this.schools.length; schoolIdx++) {
      const school = this.schools[schoolIdx]
      const surveysPerSchool = await this.surveyService.getSurveys({ school })
      const averagesPerSchool = calculateAverage(surveysPerSchool)
      averagesPerSchool.forEach((avg, catIdx) => {
        heatmapData.push([catIdx, schoolIdx, avg])
      })
      this.loading = false;

      console.log(surveysPerSchool, school)
    }
  }
  async generateCityMap(surveys: any) {

    this.cities = getCities(surveys)

    const heatmapData: [number, number, number][] = [];

    for (let cityIdx = 0; cityIdx < this.cities.length; cityIdx++) {
      const city = this.cities[cityIdx]
      const surveysByCity = await this.surveyService.getSurveys({ city });
      const averagesPerCity = calculateAverage(surveysByCity)
      averagesPerCity.forEach((avg, catIdx) => {
        heatmapData.push([catIdx, cityIdx, avg])
      })
    }
    this.loading = false;


    this.chartOption = {
      title: {
        text: 'Mapa de Calor: Ciudad',
        left: 'center',
        textStyle: { fontSize: 16 }
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
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
        data: this.cities,
        splitArea: { show: true }
      },
      visualMap: {
        min: 1,
        max: 5,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        align: 'auto',
        bottom: '5%',
        inRange: {
          color: ['#ffffe0','#fff1b3','#e57373 ','#b30000']
        }
      },
      series: [
        {
          name: 'Promedio',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: (params: any) => params.value[2],
            color: '#000'
          },
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
