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


  chartOption: EChartsOption = {
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
        data: [320, 302, 301, 334, 390, 330, 320]
      },
      {
        name: 'Desacuerdo',
        type: 'bar',
        stack: 'total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Indiferente',
        type: 'bar',
        stack: 'total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'De acuerdo',
        type: 'bar',
        stack: 'total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Totalmente de acuerdo',
        type: 'bar',
        stack: 'total',
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  };

  ngOnInit(): void {
    this.generateData()
  }

  async generateData(){
    const surveyData = await this.surveyService.getSurveys();
    console.log(calculateDistribution(surveyData));
  }

}
