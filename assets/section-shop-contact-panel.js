
// checking if variables are defined previously so we dont run this code again if this section is used twice
if (
  typeof contactModalButtons === "undefined" &&
  typeof contactModalCloseButtons === "undefined" &&
  typeof body === "undefined" &&
  typeof stickyHeader === "undefined"
  ) {
  const contactModalButtons = document.querySelectorAll('.shop-contact__button');
  const body = document.querySelector('body');
  const contactModalCloseButtons = document.querySelectorAll('.shop-contact__modal-close');
  const stickyHeader = document.querySelector('#shopify-section-header');
    
  contactModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const modalEl = e.currentTarget.nextElementSibling;

      if (!modalEl) return;
      const overlayEl = e.currentTarget.closest('.shop-contact__button-row').querySelector('.shop-contact__modal-overlay');
      modalEl.classList.add('shop-contact__modal--active');
  
      if (!overlayEl) return;
      overlayEl.classList.add('shop-contact__modal-overlay--active');

      if (!body) return;
      body.classList.add('shop-contact__modal--body-active');

      if (!stickyHeader) return;
      stickyHeader.style.display = 'none';
  
    });
  });
  
  contactModalCloseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const modalEl = e.currentTarget.closest('.shop-contact__modal');

      if (!modalEl) return;
      const overlayEl = e.currentTarget.closest('.shop-contact__button-row').querySelector('.shop-contact__modal-overlay');
      modalEl.classList.remove('shop-contact__modal--active');
  
      if (!overlayEl) return;
      overlayEl.classList.remove('shop-contact__modal-overlay--active');

      if (!body) return;
      body.classList.remove('shop-contact__modal--body-active');

      if (!stickyHeader) return;
      stickyHeader.classList.add('shopify-section-header-hidden');
      stickyHeader.removeAttribute("style");
  
    });
  });
}

