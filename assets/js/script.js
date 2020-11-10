//hamburger menu

const hamburgerIcon = document.getElementById('hamburger');
const navigationMenu = document.querySelector('#navigation-menu');
const navigationLinks = document.querySelectorAll('.navigation__link');
const navigationList = document.querySelector('#nav-list');

hamburgerIcon.addEventListener('click', () => {
  hamburgerIcon.classList.toggle('hamburger--active');
  navigationMenu.classList.toggle('navigation__menu--active');
  navigationList.classList.toggle('navigation__list--active');
}) ;

const closeMenu = () => {
    hamburgerIcon.classList.remove('hamburger--active');
    navigationMenu.classList.remove('navigation__menu--active');
    navigationList.classList.remove('navigation__list--active');
};

for (let navigationLink of navigationLinks) {
    navigationLink.addEventListener('click', closeMenu);
}

//accordion

const faqItems = document.querySelectorAll('.faq__list-item');

faqItems.forEach(item => {
  item.addEventListener('click', addAndRemoveClass);
});

function addAndRemoveClass(e) {
  const clickedItem = e.target;
  
  if (!clickedItem.classList.contains('faq__list-item--active')) {
    faqItems.forEach(item => {
      item.classList.remove('faq__list-item--active');
    });
  }
  
  clickedItem.classList.toggle('faq__list-item--active');
}

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
  targetID = targetID.substring(1);
  const targetPosition = document.querySelector(targetID).offsetTop - 30;
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

  const navLogoLink = document.querySelector('#nav-logo-link')
  const arrowLink = document.querySelector('#arrow');

  arrowLink.addEventListener('click', smoothScroll);
  navLogoLink.addEventListener('click', smoothScroll);

  navigationLinks.forEach(navigationLink => {

    if(navigationLink.getAttribute('href').startsWith('/#')) {
      navigationLink.addEventListener('click', smoothScroll);
    }

  });

}





