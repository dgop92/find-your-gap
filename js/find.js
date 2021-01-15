import HTML5FormValidator from "/js/utils.js";
MicroModal.init({
  onShow: (modal) =>
    document
      .getElementById(modal.id)
      .querySelector("input[name='user']")
      .focus(),
});

const userContainer = document.querySelector(".users-container");
const users = new Set();

// Another aprooch, save in set, then create a method that render what is inside the set
function addUser(user) {
  const userItem = document.createElement("div");
  userItem.classList.add("user-item");
  userItem.innerHTML = `<i class="fas fa-times"></i>
  <p>${user}</p>
  `;
  userItem.firstElementChild.addEventListener("click", () => {
    userItem.remove();
    users.delete(user);
  });
  userContainer.append(userItem);
  MicroModal.close("modal-add-user");
}

const html5form = new HTML5FormValidator(
  document.getElementById("add-user-form"),
  (input) => {
    input.parentElement.classList.remove("invalid-input-container");
    input.nextElementSibling.innerHTML = "";
  },
  (input) => {
    input.parentElement.classList.add("invalid-input-container");
    input.nextElementSibling.innerHTML = input.validationMessage;
  },
  (data) => {
    const user = data["user"];
    if (!users.has(user)) {
      users.add(user);
      addUser(user);
    } else {
      const input = html5form.getInputByName("user");
      input.parentElement.classList.add("invalid-input-container");
      input.nextElementSibling.innerHTML = "Ya Agregaste a este usuario";
    }
  }
);
html5form.init(".input-container input");
