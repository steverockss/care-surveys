
type CountsByLikert = Record<number, number>;
type CountsByCategory = Record<string, CountsByLikert>;
type PivotedCounts = Record<number, number[]>;

const QUESTION_RANGES: any[] = [
    { min: 1, max: 50, category: 1 },
    { min: 51, max: 69, category: 2 },
    { min: 70, max: 82, category: 3 },
    { min: 83, max: 96, category: 4 },
];

const likertLevels = [1, 2, 3, 4, 5];

export function getCategoryByQuestionNumber(questionNumber: number): number {
    const found = QUESTION_RANGES.find(r => questionNumber >= r.min && questionNumber <= r.max);
    return found ? found.category : 0;
}

export function calculateAverage(surveys: any) {
    const agrupacion: { [category: string]: { total: number; count: number } } = {};
    surveys.forEach((survey: { questions: { [x: string]: any; }; }) => {
        // Aseguramos que encuesta.questions es un arreglo
        if (survey.questions && typeof survey.questions === 'object') {
            Object.keys(survey.questions).forEach(questionKey => {
                // Extrae y convierte el valor de la respuesta a número
                const valorRespuesta = Number(survey.questions[questionKey]);

                // Extrae el número de pregunta removiendo la letra inicial "q"
                const questionNumber = Number(questionKey.replace(/^q/, ''));
                const categoriaNum = getCategoryByQuestionNumber(questionNumber);
                const catKey = `${categoriaNum}`;


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
    const averages: { [category: string]: number } = {};
    Object.keys(agrupacion).forEach(category => {
        averages[category] = parseFloat((agrupacion[category].total / agrupacion[category].count).toFixed(2));
    });
    const categoriesInOrder = Object.keys(averages).sort((a, b) => Number(a) - Number(b));
    return categoriesInOrder.map(cat => averages[cat]);
}
function pivotCounts(
    data: CountsByCategory
  ) : PivotedCounts{
    const arr: CountsByLikert[] = Object.values(data);
    return arr.reduce((acumulador, elementoActual) => {
      Object.entries(elementoActual).forEach(([clave, valor]) => {
        const nivel = Number(clave);
  
        if (!acumulador[nivel]) {
          acumulador[nivel] = [];
        }
  
        acumulador[nivel].push(valor);
      });
  
      return acumulador;
    }, {} as PivotedCounts);
  }
export function calculateDistribution(surveys: any) {
    const result: CountsByCategory = {};
    surveys.forEach((survey: { questions: { [x: string]: any; }; }) => {
        if (survey.questions && typeof survey.questions === 'object') {

            Object.keys(survey.questions).forEach(questionKey => {
                const valorRespuesta: number = Number(survey.questions[questionKey]);

                // Extrae el número de pregunta removiendo la letra inicial "q"
                const questionNumber = Number(questionKey.replace(/^q/, ''));
                const categoriaNum = getCategoryByQuestionNumber(questionNumber);
                const catKey = `${categoriaNum}`;

                if (categoriaNum  >= 1 && !isNaN(valorRespuesta)) {
                    if (!result[catKey]) {

                        result[catKey] = {};
                        for (const lvl of likertLevels) {
                    
                             result[catKey][lvl] = 0
                            
                        }
                    }
                    if(valorRespuesta != 0){
                        result[catKey][valorRespuesta] +=1;

                    }
                }

            });
        }
         
    });
    return pivotCounts(result);
}

export function getCities(surveys: any): string[]{
    const citiesSet = new Set<string>(
        surveys.map((s: { city: string; }) => s.city)
      );
     
   return Array.from(citiesSet).sort()

}


export function getSchools(surveys: any): string[]{
    const schoolsSet = new Set<string>(
        surveys.map((s: { school: string; }) => s.school)
      );
     
   return Array.from(schoolsSet).sort()

}