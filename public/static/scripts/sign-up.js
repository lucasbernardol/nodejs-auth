import Toast from '/scripts/classes/Toast.js';
import Spinner from '/scripts/classes/Spinner.js';

const formElement = document.querySelector('[data-id="form"]');

class SignUp {
  constructor({ formElement }) {
    this.formElement = formElement;

    this.#listeners(); // Add events
  }

  #listeners() {
    this.formElement.addEventListener('submit', (event) => this.#handle(event));
  }

  #log(data) {
    console.log(data);
  }

  async #fetch({ name, email, password }) {
    const response = await fetch('/api/sessions/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const content = await response.json();

    return {
      response,
      content,
    };
  }

  #formFields(target) {
    return {
      name: target.name.value,
      email: target.email.value,
      password: target.password.value,
    };
  }

  #clearFormFields() {
    this.formElement.reset();
  }

  async #handle(event) {
    event.preventDefault();

    const target = event.target;

    const formFields = this.#formFields(target);

    Spinner.show(); // loading

    try {
      const { response, content } = await this.#fetch(formFields);

      Spinner.close();
      //this.#clearFormFields();

      // log
      this.#log(content);

      console.log(response);

      if (response.status === 400) {
        Toast.open()
          .theme('danger')
          .message('Endereço de e-mail inválido!')
          .closingDispatch(5)
          .progress();

        return;
      }

      Toast.open()
        .message('Cadastro realizado com sucesso!')
        .closingDispatch(5, () => location.assign('/sign-in'))
        .progress();
    } catch (error) {
      this.#log(error);
    }
  }
}

window.addEventListener('load', () => new SignUp({ formElement }));
