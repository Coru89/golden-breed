// checking if variables are defined previously so we dont run this code again if this section is used twice
if (
    typeof modalButtons === "undefined" &&
    typeof modalCloseButtons === "undefined" &&
    typeof body === "undefined" &&
    typeof stickyHeader === "undefined"
    ) {
    const modalButtons = document.querySelectorAll('.shop-image-with-text__overlay-button');
    const body = document.querySelector('body');
    const modalCloseButtons = document.querySelectorAll('.shop-image-with-text__modal-close');
    const stickyHeader = document.querySelector('#shopify-section-header');
      
    modalButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const modalEl = e.currentTarget.nextElementSibling;
  
        const frame = document.querySelector(".shop-image-with-text__iframe");
        frame.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
  
        if (!modalEl) return;
        const overlayEl = e.currentTarget.previousElementSibling;
        modalEl.classList.add('shop-image-with-text__modal--active');
    
        if (!overlayEl) return;
        overlayEl.classList.add('shop-image-with-text__modal-overlay--active');
  
        if (!body) return;
        body.classList.add('shop-image-with-text__modal--body-active');
  
        if (!stickyHeader) return;
        stickyHeader.classList.add('shopify-section-header-hidden');
      });
    });
    
    modalCloseButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const modalEl = e.currentTarget.closest('.shop-image-with-text__modal');
        const frame = document.querySelector(".shop-image-with-text__iframe");
        frame.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  
        if (!modalEl) return;
        const overlayEl = e.currentTarget.closest('.shop-image-with-text__video-wrapper').querySelector('.shop-image-with-text__modal-overlay');
        modalEl.classList.remove('shop-image-with-text__modal--active');
    
        if (!overlayEl) return;
        overlayEl.classList.remove('shop-image-with-text__modal-overlay--active');
  
        if (!body) return;
        body.classList.remove('shop-image-with-text__modal--body-active');
  
        if (!stickyHeader) return;
        stickyHeader.classList.remove('shopify-section-header-hidden');
      });
    });
  
    // close mobile nav if user clicks outside of nav
    window.onclick = (e) => {
      const target = e.target;
  
      if (target.classList.contains("shop-image-with-text__modal--active")) {
        const frame = document.querySelector(".shop-image-with-text__iframe");
        frame.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        
        target.classList.remove('shop-image-with-text__modal--active');
  
        const overlayEl = document.querySelector('.shop-image-with-text__modal-overlay--active');
        overlayEl.classList.remove("shop-image-with-text__modal-overlay--active");
  
        if (!body) return;
        body.classList.remove("shop-image-with-text__modal--body-active");
  
        if (!stickyHeader) return;
        stickyHeader.classList.remove('shopify-section-header-hidden');
      }
    };
  }
  