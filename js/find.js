import {
  HTML5FormValidator,
  RequestBuilder,
  FIND_GAP_API,
  DANGER_COLOR,
  unexceptedErrorSnackBar
} from "/js/utils.js";

MicroModal.init({
  onShow: (modal) =>
    document
      .getElementById(modal.id)
      .querySelector("input[name='user']")
      .focus(),
});

const userContainer = document.querySelector(".users-container");
const gapsContainer = document.querySelector(".gaps-container");
const users = new Set();
const gapOptions = {
  compute_sd: true,
};
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
  MicroModal.close("modal-add-user");
}

function getGapItem(gapItemData) {
  const gapItem = document.createElement("div");
  gapItem.classList.add("gap-item");
  let gapItemContent = `
      <p class="gap-item__title">${gapItemData.day} - ${gapItemData.hour}</p>
    `;
  if (gapOptions.compute_sd) {
    gapItemContent += `
      <p class="gap-item__extra-info">Avg: ${gapItemData.avg} - Sd: ${gapItemData.sd}</p>`;
  }

  gapItem.innerHTML = gapItemContent;
  return gapItem;
}

function updateGaps() {
  if (users.size >= 2) {
    const requestBuilder = new RequestBuilder(FIND_GAP_API);
    requestBuilder.setBody({
      usernames: [...users],
      ...gapOptions,
    });
    requestBuilder.makeRequest(
      "POST",
      "/results",
      async (response) => {
        const data = await response.json();
        if (response.status == 200) {
          data.gaps.forEach((gapItemData) => {
            const gapItem = getGapItem(gapItemData);
            gapsContainer.append(gapItem);
          });
        }else if(response.status == 400){
          Snackbar.show({
            text: data["usernames"][0],
            backgroundColor: DANGER_COLOR,
            pos: "bottom-right",
            showAction: false,
          });
        }else{
          unexceptedErrorSnackBar()
        }
      },
      (error) => {
        unexceptedErrorSnackBar()
        console.log(error)
      }
    );
  }else{
    gapsContainer.innerHTML = ""
  }
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
      html5form.clearInputs()
      updateGaps();
    } else {
      const input = html5form.getInputByName("user");
      input.parentElement.classList.add("invalid-input-container");
      input.nextElementSibling.innerHTML = "Ya agregaste a este usuario";
    }
  }
);
html5form.init(".input-container input");