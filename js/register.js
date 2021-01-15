import HTML5FormValidator from "/js/utils.js";

const URL_API = "http://127.0.0.1:8000/register/";
const DANGER_COLOR = "#d32f2f"

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
      pos: 'bottom-right',
      showAction: false
    });

    delete errors["non_field_errors"];

  }

  for (const key in errors) {
    const input = html5form.getInputByName(key)
    input.parentElement.classList.add("invalid-input-container");
    input.nextElementSibling.innerHTML = createRequestErrorMessages(
      errors[key]
    );
  }
}

async function registerUser(myBody) {
  try {
    const response = await fetch(URL_API, {
      method: "POST",
      body: JSON.stringify(myBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 201) {
      console.log("Show sucessful toast");
    } else {
      const errors = await response.json();
      showRequestErrors(errors);
    }
  } catch (error) {
    Snackbar.show({
      text: "Lo sentimos algo inesperado ocurrió",
      backgroundColor: DANGER_COLOR,
      pos: 'bottom-right',
      showAction: false
    });
  }
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