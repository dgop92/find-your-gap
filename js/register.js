const registerForm = document.getElementById("register-form");
const inputs = registerForm.querySelectorAll(".input-container input");

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
    const input = document.querySelector(`input[name="${key}"]`);
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

/* OnSubmit form */

registerForm.onsubmit = function (e) {
  e.preventDefault();

  const form_data = {};

  inputs.forEach(function (input) {
    form_data[input.name] = input.value;
  });

  registerUser(form_data);
};

/* client validations */

inputs.forEach(function (input) {
  function checkValidity() {
    const inputContainer = input.parentElement;

    if (!input.validity.valid) {
      inputContainer.classList.add("invalid-input-container");
      input.nextElementSibling.innerHTML = input.validationMessage;
    } else {
      inputContainer.classList.remove("invalid-input-container");
      input.nextElementSibling.innerHTML = "";
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