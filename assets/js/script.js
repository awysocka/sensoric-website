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

  const navLogoLink = document.querySelector('#nav-logo-link');
  const arrowLink = document.querySelector('#arrow');

  arrowLink.addEventListener('click', smoothScroll);
  navLogoLink.addEventListener('click', smoothScroll);

  navigationLinks.forEach(navigationLink => {

    if(navigationLink.getAttribute('href').startsWith('/#')) {
      navigationLink.addEventListener('click', smoothScroll);
    }

  });

}

// FORM VALIDATION

const form = document.querySelector('#contact-form');
const nameInput = form.querySelector("#name");
const nameValidationMessage = form.querySelector('#name-validation-message');
const emailInput = form.querySelector("#mail");
const emailValidationMessage = form.querySelector('#email-validation-message');
const messageInput = form.querySelector("#message");
const messageValidationMessage = form.querySelector('#message-validation-message');
const agreementCheckbox = form.querySelector("#agreement");
const agreementValidationMessage = form.querySelector('#agreement-validation-message');
const phoneNumberInput = form.querySelector('#phone');
const submitResponse = form.querySelector('#submit-response');
const successfulSubmitMessage = document.querySelector('.successful-submit-message');
const contactFormTitle = document.querySelector('.heading-secondary');

function nameInputValidation() {
  if (nameInput.value == null || nameInput.value === '') {
    nameValidationMessage.innerText = 'Pole nie może być puste.';
    nameInput.classList.add('invalid-value');
    return false;
  } else {
    nameValidationMessage.innerText = '';
    nameInput.classList.remove('invalid-value');
    return true;
  }
}

function mailInputValidation() {
  if (emailInput.value == null || emailInput.value === '') {
    emailValidationMessage.innerText = 'Pole nie może być puste.';
    emailInput.classList.add('invalid-value');
    return false;
  } else if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(emailInput.value)) {
    emailValidationMessage.innerText = 'Niepoprawny adres email';
    emailInput.classList.add('invalid-value');
    return false;
  } else {
    emailValidationMessage.innerText = '';
    emailInput.classList.remove('invalid-value');
    return true;
  }
}

function messageInputValidation() {
  if (messageInput.value == null || messageInput.value === '') {
    messageValidationMessage.innerText = 'Pole nie może być puste.';
    messageInput.classList.add('invalid-value');
    return false;
  } else {
    messageValidationMessage.innerText = '';
    messageInput.classList.remove('invalid-value');
    return true;
  }
}

function agreementInputValidation() {
  if (!agreementCheckbox.checked) {
    agreementValidationMessage.innerText = 'Pole jest wymagane.';
    agreementCheckbox.classList.add('invalid-value');
    return false;
  } else {
    agreementValidationMessage.innerText = '';
    agreementCheckbox.classList.remove('invalid-value');
    return true;
  }
}

nameInput.addEventListener('input', nameInputValidation );
emailInput.addEventListener('input', mailInputValidation );
messageInput.addEventListener('input', messageInputValidation );
agreementCheckbox.addEventListener('input', agreementInputValidation );

form.addEventListener('submit', (e) => {
  e.preventDefault(e);

  if (nameInputValidation() 
      && mailInputValidation() 
      && messageInputValidation() 
      && agreementInputValidation()
  ) {
    const data = {
      name: nameInput.value,
      email: emailInput.value,
      phoneNumber: phoneNumberInput.value,
      message: messageInput.value,
      agreement: agreementCheckbox.checked
    }
  
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  
    fetch('mail.php', options)
      .then(response => {
        if (response.status == 200) {
          form.classList.add('hidden');
          successfulSubmitMessage.classList.remove('hidden');
          contactFormTitle.textContent = 'Potwierdzenie wysłania formularza';
        } else {
          submitResponse.innerText = 'Nie udało się wysłać wiadomości. Spróbuj jeszcze raz.';
          console.error('error response: ', response);
        }
      })
      .catch(error => {
        submitResponse.innerText = 'Nie udało się wysłać wiadomości. Spróbuj jeszcze raz.';
        console.error('error: ', error);
      });
  }
});
