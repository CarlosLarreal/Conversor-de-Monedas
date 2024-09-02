document.getElementById('convertir').addEventListener('click', async () => {
    const monto = document.getElementById('monto').value;
    const moneda = document.getElementById('moneda').value;
    const resultadoDiv = document.getElementById('resultado');
    const graficoCanvas = document.getElementById('grafico');
    
    if (!monto || monto <= 0) {
        resultadoDiv.innerHTML = '<p class="text-danger">Por favor ingresa un monto válido.</p>';
        return;
    }

    try {
        const response = await fetch(`https://mindicador.cl/api/${moneda}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la API');

        const data = await response.json();
        const valorActual = data.serie[0].valor;
        const conversion = (monto / valorActual).toFixed(2);

       
        resultadoDiv.innerHTML = `<p>${monto} CLP = ${conversion} ${moneda.toUpperCase()}</p>`;

        //Gráfico con los últimos 10 días
        const fechas = data.serie.slice(0, 10).map(item => item.fecha.split('T')[0]).reverse();
        const valores = data.serie.slice(0, 10).map(item => item.valor).reverse();

        new Chart(graficoCanvas, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: `Valor de ${moneda.toUpperCase()} en los últimos 10 días`,
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: `Valor en CLP`
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
        resultadoDiv.innerHTML = '<p class="text-danger">Hubo un problema al obtener los datos. Por favor, intenta nuevamente más tarde.</p>';
    }
});
