import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CARE_CATEGORIES } from '../../models/constants';
@Component({
  selector: 'app-grouped-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './grouped-bar-chart.component.html',
})
export class GroupedBarChartComponent {
  chartOption: EChartsOption = {
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
      type: 'value'
    },
    series: [
      {
        name: 'Encuesta inicial',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110]
      },
      {
        name: 'Encuesta final',
        type: 'bar',
        data: [90, 150, 200, 130, 100, 160]
      }
    ]
  };
}
