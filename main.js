// Função de teste de cálculos intensivos
function runCalculationTest() {
  const start = performance.now();
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i);
  }
  const end = performance.now();
  return end - start;
}

// Função de teste de manipulação do DOM
function runDOMTest() {
  const container = document.createElement('div');
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    const p = document.createElement('p');
    p.textContent = `Parágrafo ${i}`;
    container.appendChild(p);
  }
  // Adiciona o container ao documento para forçar a renderização
  document.body.appendChild(container);
  // Força o reflow
  container.offsetHeight;
  document.body.removeChild(container);
  const end = performance.now();
  return end - start;
}

// Função para executar um teste múltiplas vezes e retornar a média
function runMultipleTest(testFunc, iterations) {
  let totalTime = 0;
  for (let i = 0; i < iterations; i++) {
    totalTime += testFunc();
  }
  return totalTime / iterations;
}

// Função para construir o gráfico de tempo de resposta com Chart.js
function buildChart(calcTime, domTime) {
  const ctx = document.getElementById('resultChart').getContext('2d');

  // Se já existir um gráfico, destrua-o para evitar sobreposição
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Cálculos Intensivos', 'Manipulação do DOM'],
      datasets: [{
        label: 'Tempo de Resposta (ms)',
        data: [calcTime, domTime],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10
          },
          title: {
            display: true,
            text: 'Tempo (ms)'
          }
        }
      }
    }
  });
}

// Função para executar os testes e exibir os resultados
function runTests() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Executando testes de desempenho...</p>";

  // Obtém o número de iterações definido pelo usuário
  const iterationsInput = document.getElementById("iterationsInput");
  const iterations = parseInt(iterationsInput.value, 10) || 1;

  // Utiliza setTimeout para permitir que a mensagem inicial seja renderizada
  setTimeout(() => {
    const calcTimeAvg = runMultipleTest(runCalculationTest, iterations);
    const domTimeAvg = runMultipleTest(runDOMTest, iterations);

    resultsDiv.innerHTML = `
      <p><strong>Cálculos Intensivos:</strong> ${calcTimeAvg.toFixed(2)} ms (média de ${iterations} iterações)</p>
      <p><strong>Manipulação do DOM:</strong> ${domTimeAvg.toFixed(2)} ms (média de ${iterations} iterações)</p>
    `;

    // Gera o gráfico com os resultados
    buildChart(calcTimeAvg, domTimeAvg);
  }, 100);
}

// Associa o clique do botão à execução dos testes
document.getElementById("startTest").addEventListener("click", runTests);
