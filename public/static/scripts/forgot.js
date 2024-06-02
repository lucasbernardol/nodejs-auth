import Toast from '/scripts/classes/Toast.js';
import Spinner from '/scripts/classes/Spinner.js';

const form = document.querySelector('[data-id="form"]');

class Forgot {
  constructor({ form }) {
    this.form = form;
  }

  listener() {
    this.#dispathEvents();

    return this;
  }

  #dispathEvents() {
    this.form.addEventListener('submit', (event) => this.#handle(event));
  }

  #clearFields() {
    this.form.reset();
  }

  async #fetch({ email }) {
    return await fetch('/api/sessions/recovery-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    });
  }

  async #handle(event) {
    event.preventDefault();

    const target = event.target.email; // input

    Spinner.show(); // Loading effect

    try {
      const response = await this.#fetch({ email: target.value });

      this.#clearFields();

      Spinner.close();

      if (response.status === 202) {
        Toast.open()
          .message('Verifique sua caixa de entrada!')
          .closingDispatch(5, () => location.assign('/sign-in'))
          .progress();

        return;
      }

      if (response.status === 400) {
        // Check inbox
        Toast.open()
          .theme('danger')
          .message('Verifique seu e-email e/ou tente novamente após 5 minutos.')
          .closingDispatch()
          .progress();

        return;
      }

      Toast.open()
        .theme('danger')
        .message('Endereço de e-mail não encontrado!')
        .closingDispatch();
    } catch (error) {
      console.log(error);
    }
  }
}

window.addEventListener('load', () => {
  new Forgot({
    form,
  }).listener();
});
