document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const idSolicitacao = urlParams.get('idSolicitacao');

    if (idSolicitacao) {
        fetch(`https://antecipando-api.azurewebsites.net/Simulacoes/${idSolicitacao}`)
            .then(response => response.json())
            .then(data => {
                preencherCampos(data.solicitacao.usuario, data.solicitacao.dataSolicitacao);
                preencherTabela(data.bancos, data.melhorOferta);
                atualizarCodigoGerado(data);
            })
            .catch(error => console.error('Erro ao carregar os dados da solicitação:', error));
    }
});

document.getElementById('inicio-link').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Limpa a URL
    window.history.pushState({}, document.title, window.location.pathname);
    
    setTimeout(() => {
        location.reload();
    }, 1000);

    // // Limpa a tabela de simulações
    // const tableBody = document.getElementById('simular-table').querySelector('tbody');
    // tableBody.innerHTML = '';

    // // Oculta o botão "Compartilhar Simulação"
    // const shareButton = document.querySelector('.btn-block');
    // shareButton.classList.remove('visible');
});

document.getElementById('simulacao-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const simularBtn = document.querySelector('.simule-btn');
    simularBtn.classList.add('loading');

    // Obtém o valor do saldo FGTS e remove caracteres não numéricos
    const saldoFGTSInput = document.getElementById('saldo').value;
    const saldoFGTS = parseFloat(saldoFGTSInput.replace(/[^\d,]/g, '').replace(',', '.'));

    const dataNascimento = document.getElementById('data').value;

    // Verifica se o saldoFGTS é um número válido
    if (isNaN(saldoFGTS)) {
        alert('Por favor, insira um valor válido para o saldo FGTS.');
        simularBtn.classList.remove('loading');
        return;
    }

    fetch(`https://antecipando-api.azurewebsites.net/Simulacoes?SaldoFGTS=${saldoFGTS}&DataNascimento=${dataNascimento}`)
        .then(response => response.json())
        .then(data => {
            preencherTabela(data.bancos, data.melhorOferta);
            atualizarCodigoGerado(data);
        })
        .catch(error => console.error('Erro:', error))
        .finally(() => {
            simularBtn.classList.remove('loading');
        });
});

function preencherCampos(usuario, dataSolicitacao) {
    document.getElementById('saldo').value = usuario.saldoFGTS.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('data').value = usuario.dataNascimento.split('T')[0];

    if (dataSolicitacao) {
        const dataHoraSimulacao = document.getElementById('dataHoraSimulacao');
        const dataFormatada = new Date(dataSolicitacao).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        dataHoraSimulacao.textContent = `Data Simulação ${dataFormatada}`;
    }
}

function preencherTabela(bancos, melhorOferta) {
    const tableBody = document.getElementById('simular-table').querySelector('tbody');
    tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

    bancos.forEach(banco => {
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
        if (banco.idBanco === melhorOferta.idBanco) {
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
}

function atualizarCodigoGerado(data){
    // Atualiza o código gerado e o link na seção de compartilhamento
    const shareText = document.querySelector('.share-text h4');
    const shareLink = document.querySelector('.share-text a.link');
    const qrCodeContainer = document.querySelector('.qr-code');

    const idSolicitacao = data.idSolicitacao || data.solicitacao.idSolicitacao;
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
}
