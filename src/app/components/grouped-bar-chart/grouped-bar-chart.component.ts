import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CARE_CATEGORIES } from '../../models/constants';
import { SurveyService } from '../../services/surveys.service';
import { FormsModule } from '@angular/forms';
import { calculateAverage } from '../../utils/survery-utils';
@Component({
  selector: 'app-grouped-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, FormsModule],
  templateUrl: './grouped-bar-chart.component.html',
})
export class GroupedBarChartComponent implements OnInit {
  documentNumber: string = '';
  constructor(private surveyService: SurveyService) { }
  chartOption: any = {
    title: {
      text: 'Gráfico de Barras Agrupadas',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Encuesta inicial', 'Encuesta final'],
      icon: 'rect',
      top: 30
    },
    xAxis: {
      type: 'category',
      data: CARE_CATEGORIES
    },
    yAxis: {
      type: 'value',
      max: 5,
      min: 1,
      interval: 0.5
    },
    series: [
      {
        name: 'Encuesta inicial',
        type: 'bar',
      },
      {
        name: 'Encuesta final',
        type: 'bar',
      }
    ]
  };

  ngOnInit(): void {

  }

  async applyFilter() {
    const surveyData = await this.surveyService.getSurveyByDocumentNumber(this.documentNumber);

    const inicialSurveys = surveyData.filter(
      (s: any) => s.surveyType?.toLowerCase() === 'inicial'
    );
    const finalSurveys = surveyData.filter(
      (s: any) => s.surveyType?.toLowerCase() === 'final'
    );
    const initialAverage = calculateAverage(inicialSurveys);
    const finalAverage = calculateAverage(finalSurveys);

    this.chartOption = {
      ...this.chartOption,
      series: this.chartOption.series.map((serie: any, idx: number) => {
        if (idx === 0) {
          return { ...serie, data: initialAverage };
        }
        if (idx === 1) {
          return { ...serie, data: finalAverage };
        }
        return serie;
      })
    };

  }
}
