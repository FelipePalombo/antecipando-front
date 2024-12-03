export class ValidateDate {
    constructor(submitButton, dateInput) {
        this.submitButton = document.querySelector(submitButton);
        this.dateInput = document.querySelector(dateInput);
        this.init();
    }

    init() {
        this.submitButton.addEventListener('click', (event) => {
            if (!this.isValidDate(this.dateInput.value)) {
                event.preventDefault();
                alert('Data inválida. Por favor, insira uma data válida.');
            }
        });
    }

    isValidDate(dateString) {
        // Verifica se a string contém apenas números e hífens
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return false; // Contém caracteres inválidos
        }

        const date = new Date(dateString);
        const today = new Date();
        const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const year2007 = new Date('2007-12-31');

        if (isNaN(date.getTime())) {
            return false; // Data inexistente
        }

        if (date < hundredYearsAgo || date > year2007) {
            return false; // Data de mais de 100 anos atrás ou maior que 2007
        }

        return true;
    }
}

export class ValidateNumber {
    constructor(submitButton, numberInput) {
        this.submitButton = document.querySelector(submitButton);
        this.numberInput = document.querySelector(numberInput);
        this.init();
    }

    init() {
        if (this.submitButton && this.numberInput) {
            this.submitButton.addEventListener('click', (event) => {
                const cleanedValue = this.cleanNumber(this.numberInput.value);
                if (!this.isValidNumber(cleanedValue) || cleanedValue === '') {
                    event.preventDefault();
                    alert('Valor inválido. Por favor, insira um valor entre R$500 e R$150.000,00.');
                }
            });
        }
    }

    cleanNumber(value) {
        return value.replace(/\D/g, '');
    }

    isValidNumber(value) {
        const number = parseInt(value, 10);
        return number >= 500 && number <= 15000000;
    }
}

new ValidateNumber('.simule-btn', '#saldo');
new ValidateDate('.simule-btn', '#data');

