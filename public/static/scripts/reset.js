import Toast from '/scripts/classes/Toast.js';
import Spinner from '/scripts/classes/Spinner.js';

const formElement = document.querySelector('[data-id="form"]');

class Reset {
  constructor({ formElement }) {
    this.formElement = formElement;

    this.#listeners();
  }

  #listeners() {
    this.formElement.addEventListener('submit', (event) => this.#handle(event));
  }

  #log = (props) => console.log(props);

  #formFields(target) {
    return {
      password: target.password.value,
      repeatPassword: target.repeatPassword.value,
      token: target.token.value,
      userId: target.userId.value,
    };
  }

  async #fetch({ password, repeatPassword, token, userId }) {
    const response = await fetch(
      `/api/sessions/reset-password/${userId}/?token=${token}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          password,
          repeatPassword,
        }),
      },
    );

    this.#log(response);

    return { response };
  }

  async #handle(event) {
    event.preventDefault();

    const target = event.target;

    const fields = this.#formFields(target);

    // Compare passwords
    if (fields.password?.trim() !== fields.repeatPassword?.trim()) {
      Toast.open()
        .theme('danger')
        .message('Senhas não conferem!')
        .closingDispatch()
        .progress();

      return;
    }

    Spinner.show();
    try {
      const { response } = await this.#fetch(fields);

      Spinner.close();

      console.log(response);

      if (response.status === 202) {
        Toast.open()
          .message('Senha alterada com sucesso!')
          .closingDispatch(5, () => location.assign('/sign-in'))
          .progress();

        return;
      }

      Toast.open()
        .theme('danger')
        .message('Credenciais inválidas. Tente novamente!')
        .closingDispatch(5, () => location.assign('/forgot-password'))
        .progress();
    } catch (error) {
      this.#log(error);
    }
  }
}

window.addEventListener('load', () => new Reset({ formElement }));
