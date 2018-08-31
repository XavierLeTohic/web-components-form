import AsyncValidator from 'async-validator';

class Input extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        :host button.clear {
          display: none;
        }

        :host([invalid="true"]) input {
          background-color: #fbeae5;
          border-color: red;
          box-shadow: none;
        }

        :host([invalid="true"]):focus {
          outline: none;
        }

        :host([invalid="true"])::after {
          content: attr(error);
          display: block;
          color: red;
          line-height: 17px;
          margin-top: 3px;
        }

        :host([invalid="true"])::after::first-letter {
          text-transform: capitalize;
        }
      </style>
      <input type="text" id="input"/>
      <slot name="secondaryAction"></slot>
      <button class="clear" id="clear"></button>
    `;
  }

  static get observedAttributes() {
    return ['placeholder', 'type', 'disabled', 'required', 'value'];
  }

  get value() {
    return this.input.value
  }

  set value(value) {
    this.defaultValue = value;

    if(typeof this.input !== 'undefined') {
      this.input.value = this.defaultValue
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === 'value' && typeof this.input !== 'undefined') {
      this.input.value = newValue
    }
  }

  disconnectedCallback() {
    this.input.removeEventListener('input', this.onChange)
  }

  connectedCallback() {

    this.setAttribute('rendered', true)

    this.input = this.root.getElementById('input');

    // Placeholder of input
    if(this.hasAttribute('placeholder')) {
      this.input.placeholder = this.getAttribute('placeholder');
    }

    // Placeholder of input
    if(this.hasAttribute('value')) {
      this.input.value = this.getAttribute('value');
    }

    // Type of input (default = text)
    if(this.hasAttribute('type')) {
      this.input.type = this.getAttribute('type');
    }

    // TODO mixed type and aria type
    if(this.hasAttribute('aria-type')) {
      this.input.type = this.getAttribute('aria-type');
    }

    // Input disabled
    if(this.hasAttribute('disabled')) {
      this.input.disabled = this.getAttribute('disabled');
    }

    // Input with clear action
    if(this.hasAttribute('clear')) {
      this.input.disabled = this.getAttribute('disabled');
    }

    // Name of the input
    if(this.hasAttribute('name')) {
      this.input.name = this.getAttribute('name');
    }

    if(!this.hasAttribute('required-label') && this.hasAttribute('required')) {
      throw new Error(`m-input component should have a "required-label" attribute.`)
    } else {
      this.requiredLabel = this.getAttribute('required-label')
    }

    // Autocomplete
    if(this.hasAttribute('autocomplete')) {
      this.input.setAttribute('autocomplete', this.getAttribute('autocomplete'));
    }

    // Default value
    if(typeof this.defaultValue !== 'undefined') {
      this.input.value = this.defaultValue;
    }

    this.input.addEventListener('input', this.onChange)

    // Clear button was clicked
    this.root.getElementById('clear').addEventListener('click', () => {
      this.clear();
      this.focus();
    });

    // Register all the validation rules
    this.registerValidationRules();
  }

  onChange = () => {
    this.dispatchEvent(new CustomEvent('change', { detail: this.input.value }));
  }

  registerValidationRules = () => {

    this.validationRules = [];
    const { type, name } = this.input;
    const fieldName = this.getAttribute('field') || name || type;

    // Input is required
    if(this.hasAttribute('required')) {
      this.validationRules.push({
        required: true,
        message: `${fieldName} ${this.requiredLabel}`
      });
    }

    // Input type is email
    if(this.input.type && this.input.type === 'email') {
      this.validationRules.push({
        type: 'string',
        required: true,
        pattern: /[^\\.\\s@:][^\\s@:]*(?!\\.)@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*/g,
        message: 'This email is invalid'
      });
    }

    // Input type is password
    if(this.input.type && this.input.type === 'password') {
      this.validationRules.push({
        type: 'string',
        required: true,
        pattern: /^[\s\S]{5,20}$/,
        message: 'Must be greater than 5 characters and lower than 20 characters'
      });
    }

    if(this.hasAttribute('match') === true) {
      const matchName = this.getAttribute('match')
      const inputs = this.root.host.parentElement.root.host.getElementsByTagName('complex-input');
      const matchInput = Array.from(inputs).find((i) => {
        return typeof i.input.name !== 'undefined' && i.input.name === matchName
      })

      if(!matchInput) {
        throw new Error(`complex-input with name "${matchName}" was not found`)
      }

      this.matchInput = matchInput
    }

    // Create the validator for later
    this.validator = new AsyncValidator({ [fieldName]: this.validationRules });
  }

  /**
   * Check the validity of the input
   * @param {*} resolve
   * @param {*} reject
   */
  async isValid(resolve, reject) {

    const { value, type, name } = this.input;
    const fieldName = this.getAttribute('field') || name || type;
    const attrName = name || type;

    return this.validator.validate({ [fieldName]: value }, (errors) => {

      if(errors && errors.length) {
        this.setAttribute('invalid', true);
        this.setAttribute('error', errors[0].message);
        return reject();
      }

      if(typeof this.matchInput !== 'undefined' && value !== this.matchInput.input.value) {

        const matchInputField = this.matchInput.getAttribute('field') || this.matchInput.input.name || this.matchInput.input.type

        this.setAttribute('invalid', true);
        this.setAttribute('error', `${fieldName} do not match ${matchInputField}`);
        return reject();
      }

      this.removeAttribute('invalid');
      this.removeAttribute('error');
      return resolve({
        [attrName]: value
      });
    });
  }

  clear = () => {
    this.root.getElementById('input').value = '';
  }

  focus = () => {
    this.root.getElementById('input').focus();
  }
}

customElements.define('complex-input', Input);
