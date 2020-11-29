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
  e.preventDefault();

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
        if (response.status === 200) {
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
