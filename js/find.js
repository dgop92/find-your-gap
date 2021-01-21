import {
  HTML5FormValidator,
  RequestBuilder,
  FIND_GAP_API,
  DANGER_COLOR,
  unexceptedErrorSnackBar,
} from "../js/utils.js";

import {
  CheckBoxSetting,
  InputTextSetting,
  SettingsMananger,
} from "../js/gapSettings.js";

MicroModal.init({
  onShow: (modal) => {
    if (modal.id == "modal-add-user") {
      document
        .getElementById(modal.id)
        .querySelector("input[name='user']")
        .focus();
    }
  },
  onClose: (modal) => {
    if (modal.id == "modal-settings") {
      gapOptions = settingsManager.getSettings();
      updateGaps()
    } else if (modal.id == "modal-add-user") {
      userForm.clearInputs();
    }
  },
});

const userContainer = document.querySelector(".users-container");
const gapsContainer = document.querySelector(".gaps-container");
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
    updateGaps();
  });
  userContainer.append(userItem);
}

function getGapItem(gapItemData) {
  const gapItem = document.createElement("div");
  gapItem.classList.add("gap-item");
  let gapItemContent = `
      <p class="gap-item__title">${gapItemData.day} - ${gapItemData.hour}</p>
    `;
  if (gapOptions["show-avg-sd"]) {

    const sdInfo = "sd" in gapItemData ? `- Sd: ${gapItemData.sd.toFixed(2)}` : ""
    
    gapItemContent += `
      <p class="gap-item__extra-info">Avg: ${gapItemData.avg.toFixed(2)} ${sdInfo}</p>
    `

  }

  gapItem.innerHTML = gapItemContent;
  return gapItem;
}

function updateGaps() {
  if (users.size >= 2) {
    const requestBuilder = new RequestBuilder(FIND_GAP_API);
    requestBuilder.setBody({
      usernames: [...users],
      limit: gapOptions["gap-limit"],
      compute_sd: gapOptions["compute-sd"],
    });
    requestBuilder.makeRequest(
      "POST",
      "/results",
      async (response) => {
        const data = await response.json();
        if (response.status == 200) {
          gapsContainer.innerHTML = "";
          data.gaps.forEach((gapItemData) => {
            const gapItem = getGapItem(gapItemData);
            gapsContainer.append(gapItem);
          });
        } else if (response.status == 400) {
          Snackbar.show({
            text: data["usernames"][0],
            backgroundColor: DANGER_COLOR,
            pos: "bottom-right",
            showAction: false,
          });
        } else {
          unexceptedErrorSnackBar();
        }
      },
      (error) => {
        unexceptedErrorSnackBar();
        console.log(error);
      }
    );
  } else {
    gapsContainer.innerHTML = "";
  }
}

const userForm = new HTML5FormValidator(
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
      userForm.clearInputs();
      updateGaps();
    } else {
      const input = userForm.getInputByName("user");
      input.parentElement.classList.add("invalid-input-container");
      input.nextElementSibling.innerHTML = "Ya agregaste a este usuario";
    }
  }
);
userForm.init(".input-container input");

const settingsManager = new SettingsMananger([
  new CheckBoxSetting(document.getElementById("show-avg-sd"), false),
  new CheckBoxSetting(document.getElementById("compute-sd"), true),
  new InputTextSetting(document.getElementById("gap-limit"), "", {
    validateSetting: (input) => {
      if (!input.validity.valid) {
        input.style = "border-color: var(--text-danger)";
        return false;
      } else {
        input.style = "";
        return true;
      }
    },
  }),
]);
let gapOptions = settingsManager.getSettings();
