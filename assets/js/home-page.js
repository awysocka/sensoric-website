// Add logo to nav on scroll
const navLogo = document.querySelector("#nav-logo");
const heroLogo = document.querySelector('#hero-img');
const nav = document.querySelector('.navigation');


function updateNavOnScroll() {
  const navHeight = nav.offsetHeight;
  const heroLogoPosition = heroLogo.getBoundingClientRect();
 
  if (navHeight >= heroLogoPosition.bottom) {
    navLogo.classList.add("navigation__logo--visible");
  } else {
    navLogo.classList.remove("navigation__logo--visible");
  }
}

window.addEventListener('scroll', updateNavOnScroll);
window.addEventListener('deviceorientation', updateNavOnScroll);

//smooth scroll

const smoothScroll = event => {
    event.preventDefault();

    let targetID = event.target.getAttribute('href') || event.currentTarget.getAttribute('href');

    let targetPosition;
    if (targetID == "/") {
      targetPosition = 0;
    } else {
      targetID = targetID.substring(1);
      targetPosition = document.querySelector(targetID).offsetTop - 30;
    }
    
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let start = null;
  
    const step = timestamp => {
      if (!start) start = timestamp;
      const runtime = timestamp - start;
      const progress = Math.min(runtime / duration, 1);
      const ease = easeOutQuad(progress);
      window.scrollTo(0, startPosition + (distance * ease));
      if (runtime < duration) window.requestAnimationFrame(step);
    };
  
    window.requestAnimationFrame(step);
};
  
const easeOutQuad = progress => {
  return -progress * (progress - 2);
};

if (window.location.pathname === "/") {

  const navLogoLink = document.querySelector('#nav-logo-link');
  const nextSectionLink = document.querySelector('#next-section');
  const moreButton = document.querySelector('#more-button');

  nextSectionLink.addEventListener('click', smoothScroll);
  navLogoLink.addEventListener('click', smoothScroll);
  moreButton.addEventListener('click', smoothScroll);

  navigationLinks.forEach(navigationLink => {

    if(navigationLink.getAttribute('href').startsWith('/#')) {
      navigationLink.addEventListener('click', smoothScroll);
    }

  });

}

//carousel

const slides = document.querySelectorAll('.slider__element');
const sliderDots = document.querySelectorAll('.slider__controles span');
let index = 0;

function nextSlide() {
    index = ++index % slides.length;
    changeSlide();
}

// function prevSlide() {

//     if (index == 0) {
//       index = slides.length-1;
//     } else {
//       index--;
//     }

//     changeSlide();
// }

function changeSlide() {

    slides.forEach(slide => {
        slide.classList.remove('slider__element--active');
    });

    sliderDots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    slides[index].classList.add('slider__element--active');
    sliderDots[index].classList.add('active');  
}

function autoPlay() {
    nextSlide();
}

let timer = setInterval(autoPlay, 3000);

function changeDot(e) {
    const target = e.target;

    clearInterval(timer);

    index = target.getAttribute('data-slide-id');

    changeSlide();

    timer = setInterval(autoPlay, 3000);
}

sliderDots.forEach( dot => {
    dot.addEventListener('click', changeDot);
});


// document.querySelector('.slider').addEventListener('click', () => {
//     nextSlide();
// });

var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  autoHeight: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    bulletClass: 'circul-nav',
    bulletActiveClass: 'circul-nav--active',
    clickable: true
  },

  // Navigation arrows
  navigation: {
    nextEl: '.button-next',
    prevEl: '.button-prev',
  },
});
