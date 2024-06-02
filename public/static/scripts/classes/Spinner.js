const spinnerElement = document.querySelector('[data-id="spinner"]');

export class Spinner {
  #className = 'open';

  constructor(spinnerElement) {
    this.spinnerElement = spinnerElement;
  }

  show() {
    const className = this.#className;

    this.spinnerElement.classList.add(className);
  }

  close() {
    this.spinnerElement.classList.remove(this.#className);
  }
}

export default new Spinner(spinnerElement);
