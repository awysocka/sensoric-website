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

const faqLinks = document.querySelectorAll('.faq__link');
const faqItems = document.querySelectorAll('.faq__list-item');

faqLinks.forEach(link => {
  link.addEventListener('click', addAndRemoveClass);
});

function addAndRemoveClass(e) {
  e.preventDefault();
  const clickedLink = e.target;

  if (!clickedLink.parentElement.classList.contains('faq__list-item--active')) {
    faqItems.forEach(item => {
      item.classList.remove('faq__list-item--active');
    });
  }
  
  clickedLink.parentElement.classList.toggle('faq__list-item--active');
}

//cookies banner

const cookiesBanner = document.getElementById('cookies-banner');
const acceptCookiesButton = document.getElementById('accept-cookies-button');

acceptCookiesButton.addEventListener('click', () => {
  cookiesBanner.classList.remove('cookies-banner--active');

  document.cookie = "cookies_accepted = true";
});

if (document.cookie.replace(/(?:(?:^|.*;\s*)cookies_accepted\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
  cookiesBanner.classList.add('cookies-banner--active');
}


if (document.querySelector('.mediabox')) {
  MediaBox('.mediabox');
}
