export class SettingsMananger {
  constructor(inputSettings) {
    this.inputSettings = inputSettings;
  }

  getSettings() {
    const settingsData = {};
    this.inputSettings.forEach((inputSetting) => {
      if(inputSetting.getSetting() !== ""){
        settingsData[inputSetting.getName()] = inputSetting.getSetting();
      }
    });
    return settingsData;
  }
}

/* 

The following classes uses the interface of InputSetting
interface InputSetting{
    getName()
    getSetting()
}

*/

export class CheckBoxSetting {
  constructor(input, defaultValue) {
    this.input = input;
    this.setting = defaultValue;
    this.input.checked = defaultValue;
    this.init();
  }

  init() {
    this.input.addEventListener("change", (event) => {
      this.setting = event.target.checked;
    });
  }

  getSetting() {
    return this.setting;
  }

  getName() {
    return this.input.getAttribute("name");
  }
}

export class InputTextSetting {
  constructor(input, defaultValue, { validateSetting = (input) => true } = {}) {
    this.input = input;
    this.setting = defaultValue;
    this.validateSetting = validateSetting;
    this.init();
  }

  init() {
    this.input.addEventListener("change", (event) => {
      if (this.validateSetting(this.input)) {
        this.setting = event.target.value;
      }
    });
  }

  getSetting() {
    return this.setting;
  }

  getName() {
    return this.input.getAttribute("name");
  }
}
