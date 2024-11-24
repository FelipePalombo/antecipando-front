export default class Tooltip { 
    constructor(tooltip) {
        //Seleciona os elementos, all pra caso tenha mais de um tooltip
        this.tooltip = document.querySelectorAll(tooltip);
        
        //Bind para o this da classe
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
    }
    //Percorre os elementos e adiciona o evento
    tooltipEvent() {
      this.tooltip.forEach(item => {
        item.addEventListener('mouseenter', this.onMouseEnter);
      });
    }
    //Função que identifica quando o user passar o mouse em cima do elemento
    onMouseEnter(event) {
      //Chama a função que cria a tooltip
      this.createTooltipBox(event.currentTarget);
        
      //Adiciona os eventos
      event.currentTarget.addEventListener('mouseleave', this.onMouseLeave);
      event.currentTarget.addEventListener('mousemove', this.onMouseMove);
        
      //Posiciona a tooltip proxima a posicão do mouse
    //   this.tooltipBox.style.top = event.pageY + 5 + 'px';
    //   this.tooltipBox.style.left = event.pageX + 5 + 'px';
    }
    //Função que identifica quando o user sai do elemento
    onMouseLeave(event) {
        this.tooltipBox.remove();
        event.currentTarget.removeEventListener('mouseleave', this.onMouseLeave);
        event.currentTarget.removeEventListener('mousemove', this.onMouseMove);
    };
    //Função que identifica quando o user move o mouse
    onMouseMove(event) {
        //Posiciona a tooltip proxima a posicão do mouse verticalmente
        this.tooltipBox.style.top = `${event.pageY - (this.tooltipBox.offsetHeight) - 40}px`;
        //Verifica se o tooltip vai ficar fora da tela, mais precisamente, verifica se o cursor está perto do fim da janela
        if(event.pageX >= window.innerWidth - 200) {
          //Posiciona a tooltip proxima a posicão do mouse horizontalmente do lado esquerdo
          this.tooltipBox.style.left = `${event.pageX - (this.tooltipBox.offsetWidth + 50)}px`;
        } else {
          //Posiciona a tooltip proxima a posicão do mouse horizontalmente do lado direito
          this.tooltipBox.style.left = `${event.pageX - (this.tooltipBox.offsetWidth)}px`;
        }
    };
    //Função que cria a tooltip e adiciona no body
    createTooltipBox(element) {
      const tooltipBox = document.createElement('div');
      const tooltipText = element.getAttribute('aria-label');
      tooltipBox.classList.add('tooltip-box');
      tooltipBox.innerText = tooltipText;
      document.body.appendChild(tooltipBox);
      this.tooltipBox = tooltipBox;
    }
    
    //Função que inicia a funcionalidade
    init() {
      //Verifica se os elementos existem
      if(this.tooltip.length) {
        this.tooltipEvent();
      }
      return this;
    }    
  }
  
  //Inicia a funcionalidade
  const tooltip = new Tooltip('.tooltip');
  tooltip.init();