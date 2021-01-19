export const DANGER_COLOR = "#d32f2f";
export const SUCCESS_COLOR = "#4caf50";

export const FIND_GAP_API = "http://127.0.0.1:8000";

export class HTML5FormValidator {
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
      };

      input.addEventListener("input", function (e) {
        checkValidity();
      });

      input.addEventListener("invalid", function (e) {
        e.preventDefault();
        checkValidity();
      });
    });
  }

  getInputByName(name) {
    let currInput = null;
    this.inputs.forEach((input) => {
      if (input.getAttribute("name") === name) {
        currInput = input;
      }
    });
    return currInput; // this is bad, but it cannot happen
  }

  clearInputs() {
    this.inputs.forEach((input) => {
      input.value = "";
    });
  }
}

export class RequestBuilder {
  constructor(baseAPI) {
    this.baseAPI = baseAPI;
    this.headers = {};
    this.options = {};
  }

  setBody(body) {
    this.options["body"] = JSON.stringify(body);
    this.headers["Content-Type"] = "application/json";
  }

  setHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
  }

  setExtraOptions(extraOptions) {
    this.headers = { ...this.options, ...extraOptions };
  }

  //allow to put extra options but create method for common ones
  async makeRequest(method, endpoint, onSuccess, onUnexceptedError) {
    this.options["method"] = method;
    this.options["headers"] = this.headers;

    //timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000);
    this.options["signal"] = controller.signal;

    try {
      const url = this.baseAPI + endpoint;
      const response = await fetch(url, this.options);
      clearTimeout(id);
      onSuccess(response);
    } catch (error) {
      onUnexceptedError(error);
    }
  }
}

export function unexceptedErrorSnackBar() {
  Snackbar.show({
    text: "Lo sentimos algo inesperado ocurrió",
    backgroundColor: DANGER_COLOR,
    pos: "bottom-right",
    showAction: false,
  });
}
