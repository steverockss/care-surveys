import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { SurveyService } from '../services/surveys.service';

@Component({
  selector: 'app-linear-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
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

  constructor(private surveyService: SurveyService) { }



  ngOnInit(): void {
    this.obtenerPromediosPorCategoria()
  }
  // Configuración inicial del gráfico
  chartOption: any = {
    title: {
      text: 'Promedio global'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Promedio Personal', 'Promedio Global']
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
        name: 'Promedio Global',
        type: 'line',
        smooth: true,
        data: [28, 48, 40, 19, 86]
      }
    ]
  };

  // Guarda la instancia del gráfico ECharts para poder redimensionarlo.
  chartInstance: any;

  // Se invoca cuando se inicializa el gráfico.
  onChartInit(ec: any): void {
    this.chartInstance = ec;
  }

  getCategoryByQuestionNumber(questionNumber: number): number {
    const ranges = [
      { min: 1, max: 50, category: 1 },
      { min: 51, max: 69, category: 2 },
      { min: 70, max: 82, category: 3 },
      { min: 82, max: 96, category: 4 }
      // Agrega más rangos según sea necesario.
    ];

    const foundRange = ranges.find(range => questionNumber >= range.min && questionNumber <= range.max);
    return foundRange ? foundRange.category : 0; // Retorna 0 si no se encontró ningún rango.
  }

  // Método asíncrono para obtener los promedios por categoría de preguntas
  async obtenerPromediosPorCategoria(): Promise<{ [category: string]: number }> {
    try {
      // Supongo que tienes un método que obtiene todas las encuestas
      const encuestas = await this.surveyService.getSurveys(); // Retorna un arreglo de encuestas

      // Objeto para agrupar los totales y conteos
      const agrupacion: { [category: string]: { total: number; count: number } } = {};
      let count = 0;
      let prom = 0;
      // Recorremos cada encuesta
      encuestas.forEach(encuesta => {
        // Aseguramos que encuesta.questions es un arreglo
        if (encuesta.questions && typeof encuesta.questions === 'object') {
          Object.keys(encuesta.questions).forEach(questionKey => {
            // Extrae y convierte el valor de la respuesta a número
            const valorRespuesta = Number(encuesta.questions[questionKey]);

            // Extrae el número de pregunta removiendo la letra inicial "q"
            const questionNumber = Number(questionKey.replace(/^q/, ''));
            // Asumimos que tienes una función para determinar la categoría a partir del número de pregunta
            const categoriaNum = this.getCategoryByQuestionNumber(questionNumber);
            const catKey = `${categoriaNum}`;
            if (categoriaNum == 2) {
              prom += valorRespuesta;
              count++;
            }

            // Solo computamos el valor si es un número válido
            if (categoriaNum && !isNaN(valorRespuesta)) {
              if (!agrupacion[catKey]) {
                agrupacion[catKey] = { total: 0, count: 0 };
              }
              agrupacion[catKey].total += valorRespuesta;
              agrupacion[catKey].count++;
            }
          });

        }
      });


      // Calcular el promedio por cada categoría
      const promedios: { [category: string]: number } = {};
      Object.keys(agrupacion).forEach(categoria => {
        promedios[categoria] = parseFloat((agrupacion[categoria].total / agrupacion[categoria].count).toFixed(2));
      });
      const categoriasOrdenadas = Object.keys(promedios).sort((a, b) => Number(a) - Number(b));
      const promediosArray = categoriasOrdenadas.map(cat => promedios[cat]);

      console.log(promediosArray)
      this.chartOption.series[0].data = promediosArray;
      this.chartOption = { ...this.chartOption };

      console.log('Promedios por categoría:', promedios);
      return promedios;
    } catch (error) {
      console.error('Error al obtener promedios por categoría:', error);
      throw error;
    }
  }


  // HostListener para detectar el redimensionamiento de la ventana.
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }
}
