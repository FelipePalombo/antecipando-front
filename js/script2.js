document.getElementById('simulacao-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtém o valor do saldo FGTS e remove caracteres não numéricos
    const saldoFGTSInput = document.getElementById('saldo').value;
    const saldoFGTS = parseFloat(saldoFGTSInput.replace(/[^\d,]/g, '').replace(',', '.'));

    const dataNascimento = document.getElementById('data').value;

    // Verifica se o saldoFGTS é um número válido
    if (isNaN(saldoFGTS)) {
        alert('Por favor, insira um valor válido para o saldo FGTS.');
        return;
    }

    fetch(`https://antecipando-api.azurewebsites.net/Simulacoes?SaldoFGTS=${saldoFGTS}&DataNascimento=${dataNascimento}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('simular-table').querySelector('tbody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

            data.bancos.forEach(banco => {
                const row = document.createElement('tr');

                const imgCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = `./images/bank-icons/${banco.nome.toLowerCase().replace(/\s+/g, '')}.png`;
                
                img.alt = banco.nome;
                imgCell.appendChild(img);
                row.appendChild(imgCell);

                const nomeCell = document.createElement('td');
                nomeCell.textContent = banco.nome;
                row.appendChild(nomeCell);

                const valorCell = document.createElement('td');
                valorCell.textContent = `R$ ${banco.valorLiberado.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`;    
                row.appendChild(valorCell);

                const disponibilidadeCell = document.createElement('td');
                const disponibilidadeSpan = document.createElement('span');
                disponibilidadeSpan.className = banco.disponibilidade ? 'tag available' : 'tag unavailable';
                disponibilidadeSpan.textContent = banco.disponibilidade ? 'Disponível' : 'Indisponível';
                disponibilidadeCell.appendChild(disponibilidadeSpan);
                row.appendChild(disponibilidadeCell);

                const urlCell = document.createElement('td');
                const urlLink = document.createElement('a');
                urlLink.href = banco.urlBanco;
                urlLink.textContent = 'Ir Para Site do Banco >';
                urlCell.appendChild(urlLink);
                row.appendChild(urlCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro:', error));
});