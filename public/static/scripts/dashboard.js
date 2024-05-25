const buttonElement = document.querySelector('[data-id="logout"]');

const routes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
};

class Dashboard {
  #path = '/api/sessions/logout';

  constructor({ buttonElement }) {
    this.buttonElement = buttonElement;
  }

  listener() {
    this.#events(); // Add listeners

    return this;
  }

  #events() {
    this.buttonElement.addEventListener('click', (e) => this.handleLogout(e));
  }

  #redirectTo(route) {
    return location.assign(route);
  }

  #isValidCode(code) {
    return code === 204; // No content
  }

  async handleLogout(event) {
    try {
      const logoutRoutePath = this.#path;

      const request = await axios.delete(logoutRoutePath);

      if (this.#isValidCode(request.status)) {
        this.#redirectTo(routes.home); // Home page
      }
    } catch (error) {
      console.error(error);

      this.#redirectTo(routes.signIn);
    }
  }
}

async function main() {
  const dashboard = new Dashboard({
    buttonElement,
  }).listener(); // load events

  console.log(dashboard);
}

window.addEventListener('load', () => main());
