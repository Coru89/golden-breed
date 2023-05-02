
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
      stickyHeader.classList.add('shopify-section-header-hidden');
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
      stickyHeader.classList.remove('shopify-section-header-hidden');
    });
  });
}

  // close mobile nav if user clicks outside of nav
  document.onclick = (e) => {
    const target = e.target;
    if (target.classList.contains("shop-contact__modal-overlay--active")) {
      target.classList.remove('shop-contact__modal-overlay--active');

      const modalEl = document.querySelector('.shop-contact__modal--active');
      modalEl.classList.remove("shop-contact__modal--active");

      if (!body) return;
      body.classList.remove("shop-contact__modal--body-active");

      if (!stickyHeader) return;
      stickyHeader.classList.remove('shopify-section-header-hidden');
    }
  };