window.addEventListener('DOMContentLoaded', (event) => {
  const accordionHeaderEls = document.querySelectorAll('.section-accordion__item-header');

  accordionHeaderEls.forEach(header => {
    header.addEventListener('click', (e) => {
        header.classList.toggle('active');
        const content = header.nextElementSibling;
        content.classList.toggle('active');
    });
  });

});
