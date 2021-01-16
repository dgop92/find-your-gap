import {
  HTML5FormValidator,
  RequestBuilder,
  FIND_GAP_API,
  DANGER_COLOR,
  SUCCESS_COLOR,
} from "/js/utils.js";

function createRequestErrorMessages(errors) {
  return errors.reduce(
    (accumulator, currentValue) => accumulator + "<br>" + currentValue
  );
}

function showRequestErrors(errors) {
  if ("non_field_errors" in errors) {
    Snackbar.show({
      text: errors["non_field_errors"][0],
      backgroundColor: DANGER_COLOR,
      pos: "bottom-right",
      showAction: false,
    });

    delete errors["non_field_errors"];
  }

  for (const key in errors) {
    const input = html5form.getInputByName(key);
    input.parentElement.classList.add("invalid-input-container");
    input.nextElementSibling.innerHTML = createRequestErrorMessages(
      errors[key]
    );
  }
}

function registerUser(registerData) {
  const requestBuilder = new RequestBuilder(FIND_GAP_API);
  requestBuilder.setBody(registerData);
  requestBuilder.makeRequest(
    "POST",
    "/register",
    async (response) => {
      const data = await response.json();
      if (response.status == 201) {
        Snackbar.show({
          text: "Registro exitoso",
          backgroundColor: SUCCESS_COLOR,
          pos: "bottom-right",
          showAction: false,
        });
        html5form.clearInputs();
      } else if (response.status == 400) {
        showRequestErrors(data);
      } else {
        unexceptedErrorSnackBar();
      }
    },
    (error) => {
      unexceptedErrorSnackBar();
      console.log(error);
    }
  );
}

const html5form = new HTML5FormValidator(
  document.getElementById("register-form"),
  (input) => {
    input.parentElement.classList.remove("invalid-input-container");
    input.nextElementSibling.innerHTML = "";
  },
  (input) => {
    input.parentElement.classList.add("invalid-input-container");
    input.nextElementSibling.innerHTML = input.validationMessage;
  },
  (data) => {
    registerUser(data);
  }
);
html5form.init(".input-container input");
