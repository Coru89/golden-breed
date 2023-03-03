// Get all the accordion headers
  let accordionHeaders = document.querySelectorAll('.tab-accordion__item-header');
  const desktopContentEl = document.querySelector('.tab-accordion__content-desktop');

  if (window.innerWidth > 750) {
    if (accordionHeaders[0] && accordionHeaders[0].nextElementSibling.innerHTML && desktopContentEl) {
      desktopContentEl.innerHTML = accordionHeaders[0].nextElementSibling.innerHTML;
      accordionHeaders[0].classList.add('active');
      accordionHeaders[0].nextElementSibling.classList.add('active');
    }
  }
  
  // Loop through the headers and add an event listener to each one
  accordionHeaders.forEach(header => {
    header.addEventListener('click', (e) => {
      // If the screen width is less than 750 pixels (mobile size), toggle the 'active' class on the clicked header and its content element
      if (window.innerWidth < 750) {
        header.classList.toggle('active');
        const content = header.nextElementSibling;
        content.classList.toggle('active');
      } else {
          if (desktopContentEl && e.currentTarget) {
            accordionHeaders.forEach(header => {
              header.classList.remove('active');
              const contentEl = header.nextElementSibling;
              contentEl.classList.remove('active');
            });
            const content = header.nextElementSibling;
            content.classList.toggle('active');
            header.classList.toggle('active');
            desktopContentEl.innerHTML = e.currentTarget.nextElementSibling.innerHTML;
  
          }
      }
    });
  });
  
  // Detect if the screen width changes and update the layout accordingly
   window.addEventListener('resize', () => {
    accordionHeaders = document.querySelectorAll('.tab-accordion__item-header');
  
    let containsActive = false;
    let activeCount = 0; // create a variable to store the count of elements with the "active" class
    
    for (let i = 0; i < accordionHeaders.length; i++) {
      if (accordionHeaders[i].classList.contains("active")) {
        containsActive = true;
        activeCount++; // increment the active count if the current element has the "active" class
      }
    }
  
    if (window.innerWidth >= 750) {
      if ((accordionHeaders[0] && desktopContentEl) && (containsActive == false || activeCount > 1)) {
        accordionHeaders.forEach(header => {
          header.classList.remove('active');
          const contentEl = header.nextElementSibling;
          contentEl.classList.remove('active');
        });
        desktopContentEl.innerHTML = accordionHeaders[0].nextElementSibling.innerHTML;
        accordionHeaders[0].classList.add('active');
        accordionHeaders[0].nextElementSibling.classList.add('active');
      } 
    }
  });
  