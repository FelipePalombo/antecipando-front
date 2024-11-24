import format from './formatCurrency.js';

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
