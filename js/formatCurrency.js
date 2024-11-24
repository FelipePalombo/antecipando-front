export default class FormatCurrency {
    constructor(input) {
        this.input = document.querySelector(input);
        this.input.addEventListener('input', this.formatNumber.bind(this));
        // this.currency = 'BRL';
    }

    formatNumber(event) {
        let value = this.input.value;
        // Remove todos os caracteres que não são dígitos.
        value = value.replace(/\D/g, '');

        // Se o valor estiver vazio, atualize para vazio e retorne  
        if (value === '') {  
            this.input.value = '';  
            return;  
        }

        // Converte o valor para reais e insere o símbolo 'R$'  
        const formattedValue = this.toCurrency(value);  

        // Atualiza o valor do input  
        this.input.value = formattedValue; 

    }

    toCurrency(value) {
        // Adiciona pontos a cada 3 dígitos e formata a vírgula  
        const integerPart = value.slice(0, -2); // Pegando todos os dígitos menos os dois últimos  
        const decimalPart = value.slice(-2); // Pegando os dois últimos dígitos  

        // Formata a parte inteira com pontos (cada 3 dígitos)  
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');  

        // Retorna o valor formatado, garantindo que a parte decimal esteja com duas casas  
        return `R$ ${formattedInteger}${decimalPart.length > 0 ? `,${decimalPart}` : ',00'}`;
    }
}

new FormatCurrency('[data-type="currency"]');