const hamburgerIcon = document.getElementById('hamburger');
const navigationMenu = document.querySelector('#navigation-menu');
const navigattionLinks = document.querySelectorAll('.navigation__item');
const navigationList = document.querySelector('#nav-list');

hamburgerIcon.onclick = () => {
    hamburgerIcon.classList.toggle('hamburger--active');
    navigationMenu.classList.toggle('navigation__menu--active');
    navigationList.classList.toggle('navigation__list--active');
};

const closeMenu = () => {
    hamburgerIcon.classList.remove('hamburger--active');
    navigationMenu.classList.remove('navigation__menu--active');
    navigationList.classList.remove('navigation__list--active');
};

for (let navigationLink of navigattionLinks) {
    navigationLink.onclick = closeMenu;
}
