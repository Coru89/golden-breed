const accordionHeaderEls = document.querySelectorAll('.accordion__item-header');

  accordionHeaderEls.forEach(header => {
    header.addEventListener('click', (e) => {
        header.classList.toggle('active');
        const content = header.nextElementSibling;
        content.classList.toggle('active');
    });
  });
  