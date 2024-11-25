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

    executarSimulacao(saldoFGTS, dataNascimento);
});

// Adiciona eventos de clique aos botões da seção de ideias
document.querySelectorAll('.card-btn').forEach(button => {
    button.addEventListener('click', function() {
        const saldo = this.previousElementSibling.textContent.replace('R$', '').replace('.', '').trim();
        document.getElementById('saldo').value = parseFloat(saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Rola para a seção de simulação
        document.getElementById('simule').scrollIntoView({ behavior: 'smooth' });

        // Se o campo de data de nascimento já estiver preenchido, executa a simulação automaticamente
        const dataNascimento = document.getElementById('data').value;
        if (dataNascimento) {
            executarSimulacao(parseFloat(saldo), dataNascimento);
        }
    });
});

function executarSimulacao(saldoFGTS, dataNascimento) {
    const simularBtn = document.querySelector('.simule-btn');
    simularBtn.classList.add('loading');

    fetch(`https://antecipando-api.azurewebsites.net/Simulacoes?SaldoFGTS=${saldoFGTS}&DataNascimento=${dataNascimento}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('simular-table').querySelector('tbody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

            data.bancos.forEach(banco => {
                const row = document.createElement('tr');

                const imgCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = `./images/banco-icons/${banco.nome.toLowerCase().replace(/\s+/g, '')}.png`;
                img.className = "bank-img";
                
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
                
                // Verifica se é a melhor oferta
                if (banco.idBanco === data.melhorOferta.idBanco) {
                    const melhorOfertaSpan = document.createElement('span');
                    melhorOfertaSpan.className = 'melhor-oferta';
                    melhorOfertaSpan.textContent = 'Melhor Oferta';
                    valorCell.appendChild(document.createElement('br'));
                    valorCell.appendChild(melhorOfertaSpan);
                }

                row.appendChild(valorCell);

                const disponibilidadeCell = document.createElement('td');
                const disponibilidadeSpan = document.createElement('span');
                disponibilidadeSpan.className = banco.disponibilidade ? 'tag available' : 'tag unavailable';
                disponibilidadeSpan.textContent = banco.disponibilidade ? 'Disponível' : 'Indisponível';
                disponibilidadeCell.appendChild(disponibilidadeSpan);
                row.appendChild(disponibilidadeCell);

                const urlCell = document.createElement('td');
                const urlLink = document.createElement('a');
                urlLink.classList.add('link');
                urlLink.href = banco.urlBanco;
                urlLink.textContent = 'Ir Para Site do Banco >';
                urlCell.appendChild(urlLink);
                row.appendChild(urlCell);

                tableBody.appendChild(row);
            });

            // Exibe o botão "Compartilhar Simulação"
            const shareButton = document.querySelector('.btn-block');
            shareButton.classList.add('visible');

            atualizarCodigoGerado(data);
        })
        .catch(error => console.error('Erro:', error))
        .finally(() => {
            simularBtn.classList.remove('loading');
        });
}

function atualizarCodigoGerado(data){
    // Atualiza o código gerado e o link na seção de compartilhamento
    const shareText = document.querySelector('.share-text h4');
    const shareLink = document.querySelector('.share-text a.link');
    const qrCodeContainer = document.querySelector('.qr-code');

    const idSolicitacao = data.idSolicitacao;
    const link = `https://antecipando-front.vercel.app/?idSolicitacao=${idSolicitacao}`;

    shareText.textContent = `CÓDIGO ${idSolicitacao} GERADO`;
    shareLink.href = link;
    shareLink.textContent = link;

    // Limpa o QR code anterior, se existir
    qrCodeContainer.innerHTML = '';

    // Gera o QR code
    new QRCode(qrCodeContainer, {
        text: link,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    /* Não funciona :()
    // Adiciona o evento de clique ao botão de copiar
    const copyButton = document.querySelector('.copy-btn');
    copyButton.addEventListener('click', copiarLink);
    */
}

/*
function copiarLink() {
    const link = document.querySelector('.share-text a.link').href;
    navigator.clipboard.writeText(link).then(() => {
        const copyButton = document.querySelector('.copy-btn');
        copyButton.classList.add('copied');
        setTimeout(() => {
            copyButton.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar o link: ', err);
    });
}
*/