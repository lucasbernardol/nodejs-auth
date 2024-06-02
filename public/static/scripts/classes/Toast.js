const container = document.querySelector('[data-id="toast-container"]');
const textView = document.querySelector('[data-id="toast-text"]');
const closeButton = document.querySelector('[data-id="toast-button"]');

const processBarContainer = document.querySelector(
  '[data-id="toast-percentage"]',
);

function secondsToMilliseconds(seconds) {
  return Math.floor(seconds * 1000);
}

export class Toast {
  static progressBarCSSVariable = '--_process-bar-percentage';
  static progressBarTillCSSVariable = '--_process-bar-till';

  #progressClassName = 'toast-content--progress';

  #className = 'active';
  #handleTimeOutValue = null;

  #intervalState = null;
  #handleIntervalValue = null;
  #intervalTill = 0.2; // (seconds)

  #closingSeconds = 5;

  #themes = ['danger'];
  #currentTheme = null;

  #registeredCallback = null;

  /**
   *
   * @param {{
   *  container: HTMLDivElement,
   *  processBarContainer: HTMLDivElement,
   *  textView: HTMLParagraphElement,
   *  closeButton: HTMLParagraphElement,
   * }} options
   */
  constructor({ container, processBarContainer, textView, closeButton }) {
    this.container = container;
    this.processBarContainer = processBarContainer;
    this.textView = textView;

    this.closeButton = closeButton;

    // listeners
    this.#onCloseButton();
  }

  #onCloseButton() {
    this.closeButton.addEventListener('click', () => this.close());
  }

  _default() {
    this.#processBar(0);

    if (this.#handleTimeOutValue) {
      this.#clearTimeOutValue();
    }

    if (this.#handleIntervalValue) {
      this.#clearIntervalValues();
    }

    if (this.#currentTheme) {
      this.processBarContainer.classList.remove(this.#currentTheme);
    }
  }

  theme(theme) {
    const isValidTheme = this.#themes.includes(theme);

    if (isValidTheme) {
      this.processBarContainer.classList.add(theme);
      this.#currentTheme = theme;
    }

    return this;
  }

  open() {
    this._default();

    if (!this.#contains()) {
      this.container.classList.add(this.#className);
    }

    return this;
  }

  close() {
    this._default();

    if (this.#contains()) {
      this.container.classList.remove(this.#className);
    }
  }

  closingDispatch(seconds = this.#closingSeconds, callback = () => {}) {
    this.#registeredCallback = callback;

    const milliseconds = secondsToMilliseconds(seconds);

    const hasClassName = this.#contains();

    if (hasClassName) {
      const timeoutValue = setTimeout(() => {
        // callback
        callback.apply(null, []);
        this.#registeredCallback = null; // fix

        this.close();

        this.#clearIntervalValues();
      }, milliseconds);

      this.#setTimeOutValue(timeoutValue);
    }

    return this;
  }

  progress(timeoutInterval = this.#closingSeconds) {
    if (!this.#handleTimeOutValue) {
      return;
    }

    // Add class name
    this.#toggleProcessBarElement(this.#progressClassName);

    const processUpdateIntervalSeconds = this.#intervalTill;

    this.#processBarTill(processUpdateIntervalSeconds);

    const handleIntervalValue = setInterval(() => {
      let currentTime = this.#intervalState;

      currentTime = currentTime - processUpdateIntervalSeconds;

      this.#intervalState = currentTime;

      const processPercentage = Math.floor(
        (currentTime * 100) / timeoutInterval,
      );

      this.#processBar(processPercentage);
    }, secondsToMilliseconds(processUpdateIntervalSeconds));

    this.#setIntervalValues(handleIntervalValue, timeoutInterval);
  }

  message(message) {
    if (message) {
      this.textView.textContent = message;
    }

    return this;
  }

  #processBar(percentage) {
    this.processBarContainer.style.setProperty(
      Toast.progressBarCSSVariable,
      `${percentage}%`,
    );
  }

  #processBarTill(till) {
    this.processBarContainer.style.setProperty(
      Toast.progressBarTillCSSVariable,
      `${till}s`, // seconds
    );
  }

  #toggleProcessBarElement(className) {
    const { classList } = this.processBarContainer;

    if (className) {
      classList.add(className);
      return;
    }

    classList.remove(this.#progressClassName);
  }

  // private
  #contains(className) {
    const { classList } = this.container;

    return classList.contains(className || this.#className);
  }

  #clearTimeOutValue() {
    clearTimeout(this.#handleTimeOutValue);
    this.#handleTimeOutValue = null; // this.#setTimeOutValue()

    // Fix
    if (this.#registeredCallback) {
      this.#registeredCallback.apply(null, []);
    }

    this.#registeredCallback = null;
  }

  #setTimeOutValue(value = null) {
    this.#handleTimeOutValue = value;
  }

  #setIntervalValues(handleIntervalValue, intervalState) {
    this.#handleIntervalValue = handleIntervalValue;
    this.#intervalState = intervalState;
  }

  #clearIntervalValues() {
    clearInterval(this.#handleIntervalValue);

    this.#handleIntervalValue = null;
    this.#intervalState = null;
  }
}

export default new Toast({
  container,
  processBarContainer,
  textView,
  closeButton,
});
