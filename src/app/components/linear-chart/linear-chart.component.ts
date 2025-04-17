import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { SurveyService } from '../../services/surveys.service';
import { FormsModule } from '@angular/forms';
import { SurveyFilters } from '../../models/survery-filters'
import Swal from 'sweetalert2';
import { calculateAverage, getCategoryByQuestionNumber } from '../../utils/survery-utils';

@Component({
  selector: 'app-linear-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, FormsModule],
  templateUrl: './linear-chart.component.html',
  styleUrls: ['./linear-chart.component.css'],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts: () => import('echarts') }
    }
  ]
})
export class LinearChartComponent implements OnInit {
  filterType: string = '';
  filterValue: string = '';
  constructor(private surveyService: SurveyService) { }
  chartOption: any = {
    title: {
      text: 'Gráfica lineal de promedios'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Promedio ciudad', 'Promedio global', 'Promedio institución', 'Promedio grupo']
    },
    toolbox: {
      feature: {
        saveAsImage: {}  // Permite guardar el gráfico como imagen
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Cuidado de sí mismo', 'Cuidado del otro', 'Cuidado del entorno', 'Cuidado del cuidador']
    },
    yAxis: {
      type: 'value',
      max: 5,
      min: 1,
      interval: 0.5
    },
    series: [
      {
        name: 'Promedio global',
        type: 'line',
        smooth: true,
      },
      {
        name: 'Promedio ciudad',
        type: 'line',
        smooth: true,
      },
      {
        name: 'Promedio institución',
        type: 'line',
        smooth: true,
      },
      {
        name: 'Promedio grupo',
        type: 'line',
        smooth: true,
      },
    ]
  };


  ngOnInit(): void {
    this.getAverageByCategory()
  }


  // Guarda la instancia del gráfico ECharts para poder redimensionarlo.
  chartInstance: any;

  // Se invoca cuando se inicializa el gráfico.
  onChartInit(ec: any): void {
    this.chartInstance = ec;
  }


  private async loadSurveys(filters?: SurveyFilters) {
    // Llama a tu método adaptado getSurveys(filters)
    this.getAverageByCategory(filters)
  }

  clearFilter() {
    this.filterType = '';
    this.filterValue = '';
    this.loadSurveys(); // sin filtros
  }

  applyFilter() {
    const filters: SurveyFilters = {};
    const valueUpperCase = this.filterValue.toUpperCase();
    if (this.filterType && valueUpperCase) {
      // Mapea el select a la propiedad adecuada
      switch (this.filterType) {
        case 'city':
          filters.city = valueUpperCase;
          break;
        case 'school':
          filters.school = valueUpperCase;
          break;
        case 'group':
          filters.group = valueUpperCase;
          break;
      }
    }
    this.loadSurveys(filters);
  }

  async getSurveys(filters?: SurveyFilters) {
    try {
      return await this.surveyService.getSurveys(filters);
    } catch (err: any) {
      if (err.status === 404) {
        Swal.fire({
          icon: 'warning',
          title: 'No se encontró',
          text: 'No hay encuestas con el filtro ingresado. Por favor, revisa e inténtalo nuevamente.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al obtener las encuestas'
        });
      }
      // opcional: limpiar datos previos y gráfica vacía
      return []
    }
  }
  // Método asíncrono para obtener los promedios por categoría de preguntas
  async getAverageByCategory(filter?: SurveyFilters) {
    try {
      const surveys = await this.getSurveys(filter); // Retorna un arreglo de encuestas
      const promediosArray = calculateAverage(surveys)

      let idx = 0;
      if (filter?.city) {
        idx = 1;

      }
      else if (filter?.school) {
        idx = 2;
      } else if (filter?.group) {
        idx = 3
      }
      this.updateSeries(promediosArray, idx);

    } catch (error) {
      console.error('Error al obtener promedios por categoría:', error);
      throw error;
    }
  }


  private updateSeries(data: any[], index: number) {
    this.chartOption = {
      ...this.chartOption,
      series: this.chartOption.series.map((s: any, i: number) =>
        i === index ? { ...s, data } : s
      )
    };
  }

  // HostListener para detectar el redimensionamiento de la ventana.
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }
}
