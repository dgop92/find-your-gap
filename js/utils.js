export default class HTML5FormValidator {
  constructor(html5form, onValidInput, onInvalidInput, onSuccesForm) {
    this.html5form = html5form;
    this.onValidInput = onValidInput;
    this.onInvalidInput = onInvalidInput;
    this.onSuccesForm = onSuccesForm;
  }

  init(inputQuery) {
    this.inputs = this.html5form.querySelectorAll(inputQuery);

    this.html5form.onsubmit = (e) => {
      e.preventDefault();

      const formData = {};

      this.inputs.forEach(function (input) {
        formData[input.name] = input.value;
        input.value = ""
      });

      this.onSuccesForm(formData);
    };

    this.inputs.forEach((input) => {
      const checkValidity = () => {
        if (!input.validity.valid) {
          this.onInvalidInput(input);
        } else {
          this.onValidInput(input);
        }
      }

      input.addEventListener("input", function (e) {
        checkValidity();
      });

      input.addEventListener("invalid", function (e) {
        e.preventDefault();
        checkValidity();
      });
    });
  }

  getInputByName(name){
    let currInput = null
    this.inputs.forEach((input) => {
      if (input.getAttribute("name") === name){
        currInput = input
      }
    })
    return currInput // this is bad, but it cannot happen
  }
}