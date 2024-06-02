import Toast from '/scripts/classes/Toast.js';
import Spinner from '/scripts/classes/Spinner.js'; //  modules

const formElement = document.querySelector('[data-id="form"]');

class SignIn {
  constructor({ formElement }) {
    this.formElement = formElement;

    this.#listeners();
  }

  #listeners() {
    this.formElement.addEventListener('submit', (event) => this.#handle(event));
  }

  #log(props) {
    console.log(props);
  }

  #formFields(target) {
    return {
      email: target.email.value,
      password: target.password.value,
    };
  }

  async #fetch({ email, password }) {
    const response = await fetch('/api/sessions/sign-in', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const content = await response.json();

    this.#log(content);

    return {
      response,
      content,
    };
  }

  async #handle(event) {
    event.preventDefault();

    const target = event.target;

    Spinner.show();

    try {
      const { response } = await this.#fetch(this.#formFields(target));

      Spinner.close();

      if (response.status === 200) {
        // Redirect only
        return location.assign('/dashboard');
      }

      Toast.open()
        .theme('danger')
        .message('Credenciais de acesso incorretas!')
        .closingDispatch()
        .progress();
    } catch (error) {
      this.#log(error);
    }
  }
}

window.addEventListener('load', () => new SignIn({ formElement }));
