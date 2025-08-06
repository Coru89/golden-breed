class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-items').updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    // this.updateFreeShippingProgress = this.updateFreeShippingProgress.bind(this); // Bind `this` to the class instance
    // this.updateQuantity = this.updateQuantity.bind(this); // Bind `this` to the class instance

    // price that factors in discount ninja discounts
    this.total_price = null;


    // wait for discount ninja data to be loaded
    document.addEventListener("limoniapps:discountninja:cart:updated", (event) => {
      const cart = event.detail.data;
      const discountedTotal = cart[0].total_discounted_price;

      if (discountedTotal) {
        this.total_price = discountedTotal;
      }
    });

    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'cart-errors',
        section: 'cart-errors',
        selector: '.shopify-section'
     }
    ];
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);

    // Filter out the 'main-cart-footer' section
    const sectionsToRender = this.getSectionsToRender()
      .filter((section) => section.id !== 'main-cart-footer')
      .map((section) => section.section);

    const body = JSON.stringify({
      line,
      quantity,
      sections: sectionsToRender,
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);

        try {
          this.getSectionsToRender().forEach((section) => {
            const container = document.getElementById(section.id);
            if (!container) {
              console.error('Container not found for section:', section.id);
              return;
            }
            const elementToReplace = container.querySelector(section.selector) || container;

            if (!parsedState.sections) {
              console.error('No sections found in cart response:', parsedState);
              return;
            }

            const sectionHtml = parsedState.sections[section.section];
            if (!sectionHtml) {
              console.error('Section HTML not found for:', section.section);
              return;
            }
            elementToReplace.innerHTML = this.getSectionInnerHTML(sectionHtml, section.selector);
          });
        } catch (e) {
          console.error('Error updating sections:', e);
        }

        // pass in this.total_price (from discount ninja event listener)
        this.updateFreeShippingProgress(this.total_price || parsedState.total_price);

        this.updateLiveRegions(line, parsedState.item_count);
        const lineItem = document.getElementById(`CartItem-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
        this.disableLoading();
      })
      .catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        document.getElementById('cart-errors').textContent = window.cartStrings.error;
        this.disableLoading();
      });
  }


updateFreeShippingProgress(discountedTotal) {
  const freeShippingNotice = document.getElementById('free-shipping-notice');
  if (!freeShippingNotice) return;
  const freeShippingMinimum = Number(freeShippingNotice.dataset.minimum);
  if (!freeShippingMinimum || freeShippingMinimum <= 0) return;

  let progress = Math.min((discountedTotal / freeShippingMinimum) * 100, 100);

  // Update the progress bar
  const progressBar = document.querySelector('.free-shipping-notice__bar');
  const noticeText = document.querySelector('.notice_text');

  if (!progressBar || !noticeText) return;

  progressBar.style.setProperty('--progress', `${progress}%`);

  const freeShippingHtml = "<strong>You've got free shipping!</strong><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"none\"><path fill=\"#265979\" d=\"m22.32 13.45-.622-2.486a.376.376 0 0 0 .298-.367v-.401a1.58 1.58 0 0 0-1.578-1.578h-2.831V7.79a.778.778 0 0 0-.777-.777h-5.264l3.199-1.28a.376.376 0 0 0-.28-.697l-2.618 1.048c.798-.513 1.588-1.076 1.888-1.47a1.752 1.752 0 0 0-.33-2.453 1.752 1.752 0 0 0-2.453.33c-.428.56-.992 2.136-1.357 3.247-.365-1.11-.93-2.686-1.357-3.247a1.752 1.752 0 0 0-2.453-.33 1.752 1.752 0 0 0-.33 2.453c.3.394 1.09.957 1.888 1.47L4.724 5.037a.376.376 0 1 0-.279.698l3.199 1.28H2.38a.777.777 0 0 0-.777.776v6.814a.376.376 0 0 0 .752 0V7.791c0-.014.011-.025.025-.025h14.43c.014 0 .025.011.025.025v6.814a.376.376 0 0 0 .752 0v-.426h4.434a1.23 1.23 0 0 1 1.168.852h-1.168a.376.376 0 0 0-.376.376v.802c0 .649.528 1.177 1.178 1.177h.425v1.653h-.982a2.384 2.384 0 0 0-2.25-1.603c-1.04 0-1.926.671-2.248 1.603h-.181v-2.83a.376.376 0 0 0-.752 0v2.83H9.038a2.384 2.384 0 0 0-2.249-1.603c-1.04 0-1.926.671-2.249 1.603H2.38a.025.025 0 0 1-.025-.025v-.826h1.628a.376.376 0 1 0 0-.752H.376a.376.376 0 1 0 0 .752h1.227v.826c0 .428.349.777.777.777h2.03v.025a2.383 2.383 0 0 0 2.38 2.38 2.383 2.383 0 0 0 2.38-2.38l-.002-.025h8.47l-.001.025a2.383 2.383 0 0 0 2.38 2.38 2.383 2.383 0 0 0 2.38-2.38l-.001-.025h1.228a.376.376 0 0 0 .376-.376v-4.008c0-.99-.73-1.812-1.68-1.957ZM8.105 5.675C6.622 4.754 6.183 4.33 6.052 4.159A1 1 0 0 1 7.64 2.948c.364.477.933 2.08 1.31 3.237-.255-.15-.546-.324-.845-.51Zm2.136.51c.376-1.156.945-2.76 1.309-3.237a1 1 0 0 1 1.587 1.211c-.13.17-.57.595-2.052 1.516-.299.186-.59.36-.844.51Zm7.346 3.184h2.83c.456 0 .827.371.827.827v.025h-3.657v-.852Zm0 4.059v-2.456h3.339l.614 2.456h-3.953ZM6.789 21.444a1.63 1.63 0 0 1-1.628-1.628c0-.898.73-1.628 1.628-1.628.898 0 1.629.73 1.629 1.628a1.63 1.63 0 0 1-1.629 1.628Zm13.228 0a1.63 1.63 0 0 1-1.629-1.628c0-.898.73-1.628 1.629-1.628.898 0 1.628.73 1.628 1.628a1.63 1.63 0 0 1-1.628 1.628Zm3.232-4.81h-.426a.426.426 0 0 1-.426-.426v-.425h.851v.851Z\"/><path fill=\"#265979\" d=\"M6.788 19.04a.777.777 0 1 0 .002 1.554.777.777 0 0 0-.002-1.555ZM20.015 19.04a.778.778 0 1 0 .002 1.554.778.778 0 0 0-.002-1.555ZM15.609 17.436H9.997a.376.376 0 0 0 0 .752h5.612a.376.376 0 1 0 0-.752ZM5.987 15.833h-4.81a.376.376 0 0 0 0 .751h4.81a.376.376 0 1 0 0-.751ZM5.987 10.22H4.384a.376.376 0 0 0-.376.377v3.206a.376.376 0 0 0 .751 0v-1.227h.827a.376.376 0 1 0 0-.752H4.76v-.851h1.228a.376.376 0 1 0 0-.752ZM8.943 12.752a1.378 1.378 0 0 0-.753-2.531H7.188a.376.376 0 0 0-.375.376v3.206a.376.376 0 0 0 .751 0v-.826h.626l.69 1.035a.375.375 0 1 0 .625-.417l-.562-.843Zm-.753-.527h-.626v-1.252h.626a.627.627 0 0 1 0 1.252ZM11.999 13.428H10.77v-.853H11.598a.376.376 0 0 0 0-.75H10.77v-.852H12a.376.376 0 1 0 0-.752h-1.604a.376.376 0 0 0-.375.376v3.206c0 .208.168.376.375.376H12a.376.376 0 0 0 0-.751ZM14.807 13.428H13.58v-.852h.426a.376.376 0 0 0 0-.752h-.426v-.851h1.227a.376.376 0 1 0 0-.752h-1.603a.376.376 0 0 0-.376.376v3.206c0 .208.168.376.376.376h1.603a.376.376 0 0 0 0-.751Z\"/></svg>";

  if (discountedTotal && discountedTotal >= freeShippingMinimum) {
    noticeText.innerHTML = freeShippingHtml;
  } else {
    const deficit = freeShippingMinimum - discountedTotal;
    noticeText.innerHTML = `<span>Spend ${(deficit / 100).toFixed(2)} ${window.cartStrings.currentCurrency} more to receive free shipping</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#265979" d="m22.32 13.45-.622-2.486a.376.376 0 0 0 .298-.367v-.401a1.58 1.58 0 0 0-1.578-1.578h-2.831V7.79a.778.778 0 0 0-.777-.777h-5.264l3.199-1.28a.376.376 0 0 0-.28-.697l-2.618 1.048c.798-.513 1.588-1.076 1.888-1.47a1.752 1.752 0 0 0-.33-2.453 1.752 1.752 0 0 0-2.453.33c-.428.56-.992 2.136-1.357 3.247-.365-1.11-.93-2.686-1.357-3.247a1.752 1.752 0 0 0-2.453-.33 1.752 1.752 0 0 0-.33 2.453c.3.394 1.09.957 1.888 1.47L4.724 5.037a.376.376 0 1 0-.279.698l3.199 1.28H2.38a.777.777 0 0 0-.777.776v6.814a.376.376 0 0 0 .752 0V7.791c0-.014.011-.025.025-.025h14.43c.014 0 .025.011.025.025v6.814a.376.376 0 0 0 .752 0v-.426h4.434a1.23 1.23 0 0 1 1.168.852h-1.168a.376.376 0 0 0-.376.376v.802c0 .649.528 1.177 1.178 1.177h.425v1.653h-.982a2.384 2.384 0 0 0-2.25-1.603c-1.04 0-1.926.671-2.248 1.603h-.181v-2.83a.376.376 0 0 0-.752 0v2.83H9.038a2.384 2.384 0 0 0-2.249-1.603c-1.04 0-1.926.671-2.249 1.603H2.38a.025.025 0 0 1-.025-.025v-.826h1.628a.376.376 0 1 0 0-.752H.376a.376.376 0 1 0 0 .752h1.227v.826c0 .428.349.777.777.777h2.03v.025a2.383 2.383 0 0 0 2.38 2.38 2.383 2.383 0 0 0 2.38-2.38l-.002-.025h8.47l-.001.025a2.383 2.383 0 0 0 2.38 2.38 2.383 2.383 0 0 0 2.38-2.38l-.001-.025h1.228a.376.376 0 0 0 .376-.376v-4.008c0-.99-.73-1.812-1.68-1.957ZM8.105 5.675C6.622 4.754 6.183 4.33 6.052 4.159A1 1 0 0 1 7.64 2.948c.364.477.933 2.08 1.31 3.237-.255-.15-.546-.324-.845-.51Zm2.136.51c.376-1.156.945-2.76 1.309-3.237a1 1 0 0 1 1.587 1.211c-.13.17-.57.595-2.052 1.516-.299.186-.59.36-.844.51Zm7.346 3.184h2.83c.456 0 .827.371.827.827v.025h-3.657v-.852Zm0 4.059v-2.456h3.339l.614 2.456h-3.953ZM6.789 21.444a1.63 1.63 0 0 1-1.628-1.628c0-.898.73-1.628 1.628-1.628.898 0 1.629.73 1.629 1.628a1.63 1.63 0 0 1-1.629 1.628Zm13.228 0a1.63 1.63 0 0 1-1.629-1.628c0-.898.73-1.628 1.629-1.628.898 0 1.628.73 1.628 1.628a1.63 1.63 0 0 1-1.628 1.628Zm3.232-4.81h-.426a.426.426 0 0 1-.426-.426v-.425h.851v.851Z"/><path fill="#265979" d="M6.788 19.04a.777.777 0 1 0 .002 1.554.777.777 0 0 0-.002-1.555ZM20.015 19.04a.778.778 0 1 0 .002 1.554.778.778 0 0 0-.002-1.555ZM15.609 17.436H9.997a.376.376 0 0 0 0 .752h5.612a.376.376 0 1 0 0-.752ZM5.987 15.833h-4.81a.376.376 0 0 0 0 .751h4.81a.376.376 0 1 0 0-.751ZM5.987 10.22H4.384a.376.376 0 0 0-.376.377v3.206a.376.376 0 0 0 .751 0v-1.227h.827a.376.376 0 1 0 0-.752H4.76v-.851h1.228a.376.376 0 1 0 0-.752ZM8.943 12.752a1.378 1.378 0 0 0-.753-2.531H7.188a.376.376 0 0 0-.375.376v3.206a.376.376 0 0 0 .751 0v-.826h.626l.69 1.035a.375.375 0 1 0 .625-.417l-.562-.843Zm-.753-.527h-.626v-1.252h.626a.627.627 0 0 1 0 1.252ZM11.999 13.428H10.77v-.853H11.598a.376.376 0 0 0 0-.75H10.77v-.852H12a.376.376 0 1 0 0-.752h-1.604a.376.376 0 0 0-.375.376v3.206c0 .208.168.376.375.376H12a.376.376 0 0 0 0-.751ZM14.807 13.428H13.58v-.852h.426a.376.376 0 0 0 0-.752h-.426v-.851h1.227a.376.376 0 1 0 0-.752h-1.603a.376.376 0 0 0-.376.376v3.206c0 .208.168.376.376.376h1.603a.376.376 0 0 0 0-.751Z"/></svg>`;
  }
    
}
  // Custom money formatting function
  formatMoney(cents) {
     return `${(cents / 10000).toFixed(2)}`; // Converts cents to dollars and formats to 2 decimal places
   }

  updateLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      document.getElementById(`Line-item-error-${line}`)
        .querySelector('.cart-item__error-text')
        .innerHTML = window.cartStrings.quantityError.replace(
          '[quantity]',
          document.getElementById(`Quantity-${line}`).value
        );
    }

    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    document.getElementById('main-cart-items').classList.add('cart__items--disabled');
    this.querySelectorAll(`#CartItem-${line} .loading-overlay`).forEach((overlay) => overlay.classList.remove('hidden'));
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading() {
    document.getElementById('main-cart-items').classList.remove('cart__items--disabled');
  }
}

customElements.define('cart-items', CartItems);