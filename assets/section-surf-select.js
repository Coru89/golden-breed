window.addEventListener('DOMContentLoaded', (event) => {
  var glide = new Glide('.glide__surf-select', {
    type: 'carousel',
    gap: 8,
    rewind: false,
    perView: 4,
    bound: true,
    peek: {
      before: 0,
      after: 44
    },
    breakpoints: {
      400: {
        perView: 1,
        peek: {
          before: 0,
          after: 30
        },
      },
      550: {
        perView: 1,
        peek: {
          before: 0,
          after: 88
        },
      },
      630: {
        perView: 1,
        peek: {
          before: 0,
          after: 88
        },
      },
      990: {
        perView: 2,
        peek: {
          before: 0,
          after: 44
        },
      },
      1320: {
        perView: 3,
        peek: {
          before: 0,
          after: 44
        },
      }
    }
  }).mount();
});
