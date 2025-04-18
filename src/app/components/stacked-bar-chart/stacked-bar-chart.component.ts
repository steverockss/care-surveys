import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { CARE_CATEGORIES } from '../../models/constants';
import { SurveyService } from '../../services/surveys.service';
import { calculateDistribution } from '../../utils/survery-utils';
@Component({
  selector: 'app-stacked-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './stacked-bar-chart.component.html',
  styleUrl: './stacked-bar-chart.component.css'
})
export class StackedBarChartComponent implements OnInit {
    constructor(private surveyService: SurveyService) { }


  chartOption: any = {
    title: {
      text: 'Gráfico de Barras Apiladas',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['Totalmente en desacuerdo', 'Desacuerdo', 'Indiferente', 'De acuerdo', 'Totalmente de acuerdo'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: CARE_CATEGORIES
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Totalmente en desacuerdo',
        type: 'bar',
        stack: 'total',
      },
      {
        name: 'Desacuerdo',
        type: 'bar',
        stack: 'total',
      },
      {
        name: 'Indiferente',
        type: 'bar',
        stack: 'total',
      },
      {
        name: 'De acuerdo',
        type: 'bar',
        stack: 'total',
      },
      {
        name: 'Totalmente de acuerdo',
        type: 'bar',
        stack: 'total',
      }
    ]
  };

  ngOnInit(): void {
    this.generateData()
  }

  async generateData(){
    const surveyData = await this.surveyService.getSurveys();
    const distributatedSurveyData = calculateDistribution(surveyData);
    Object.values(distributatedSurveyData).forEach( (data, index) =>{
      this.chartOption.series[index].data = data;
    });

    this.chartOption = { ...this.chartOption };
  }

}
