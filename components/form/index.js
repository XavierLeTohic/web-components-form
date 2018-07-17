class ComplexForm extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = `
      <div id="form" class="form">
        <slot></slot>
      </div>
    `;
  }

  /** When the component is unmount */
  disconnectedCallback() {
    if(typeof this.button !== 'undefined' && this.button !== null) {
      // Remove submit event listener
      this.button.removeEventListener('click', this.onSubmit);
    }
  }

  /** When the component is mount */
  connectedCallback() {
    this.registerFields();

    if(typeof this.button !== 'undefined' && this.button !== null) {
      // Add submit event listener
      this.button.addEventListener('click', this.onSubmit)
    }
  }

  /**
   * Register all fields
  */
  registerFields() {
    this.fields = this.root.host.getElementsByTagName('complex-input');
  }

  /**
   * Will validate all fields
  */
  onSubmit = () => {

    const validations = [];
    const fields = Array.from(this.fields);

    for(let i = 0; i < fields.length; i += 1) {
      validations.push(new Promise(fields[i].isValid.bind(fields[i])));
    }

    Promise.all(validations)
      .then((data) => {
        const values = data.reduce((p, c) => ({...p, ...c}), {});
        this.dispatchEvent(new CustomEvent('success', { detail: values }));
      })
      .catch(() => {
        this.dispatchEvent(new Event('error'));
      });
  }

  reset = () => {
    for(const field of Array.from(this.fields)) {
      field.clear()
    }
  }

  get button() {

    const button = Array.from(this.root.host.getElementsByTagName('button')).filter((button) => {
      return button.type === 'submit'
    })

    if(!button.length) {
      throw new Error('Complex Form should contain a submit button')
    }

    return button[0]
  }

}

customElements.define('complex-form', ComplexForm);

