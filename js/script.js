import format from './formatCurrency.js';
import tooltip from './tooltip.js';
import { ValidateNumber, ValidateDate } from './validate.js';

// swiper
const swiper = new Swiper('.swiper', {
  loop: true,
  slidesPerView: 6,
  spaceBetween: 80,
  centeredSlides: true,
  
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    0: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    768: {
      slidesPerView: 3.2,
      spaceBetween: 40,
    },
    1090: {
      slidesPerView: 3.4,
      spaceBetween: 80,
    },
    1370: {
      slidesPerView: 5.5,
      spaceBetween: 80,
    },
    1660: {
      slidesPerView: 5.5,
      spaceBetween: 80,
    },
  },
});

// Abre e fecha bloco de qrcode
const shareBlock = document.querySelector('.simular-table');
const shareButton = document.querySelector('.share-btn');

if(shareButton && shareBlock) {
  shareButton.addEventListener('click', (event) => {
    event.preventDefault();
    shareBlock.classList.toggle('share-open');
    shareButton.classList.toggle('clicked');
  });
}

//Smooth scroll
const menuItems = document.querySelectorAll('.header a[href^="#"]');
menuItems.forEach(item => {
  item.addEventListener('click', scrollToIdOnClick);
});

function scrollToIdOnClick(event) {
  event.preventDefault();
  const to = getScrollTopByHref(event.target) - 70;
  scrollToPosition(to);
}

function getScrollTopByHref(element) {
  const id = element.getAttribute('href');
  return document.querySelector(id).offsetTop;
}

function scrollToPosition(to) {
  window.scroll({
    top: to,
    behavior: "smooth",
  });
}

//Botão de copiar link 
const copyButton = document.querySelector('.copy-btn');
if(copyButton) {
  copyButton.addEventListener('click', () => {
    const link = document.querySelector('.share-text a.link').href;
    navigator.clipboard.writeText(link).then(() => {
      copyButton.classList.add('copied');
      setTimeout(() => {
        copyButton.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Erro ao copiar o link: ', err);
    });
  });
}