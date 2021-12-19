class FormHandler {
  constructor(id, errorMessage) {
    this.form = id;
    this.sendingButton = document.querySelector(".send-data");
    this.radioButtons = [...this.form.querySelectorAll(".radio-field input")];
    this.errorMessage = errorMessage;
    this.activeRadioInput = this.form.querySelector(".active input");
    this.errorBox = this.form.querySelector(".errorBox");
    this.fileInput = this.form.querySelector(".file-input");

    this.initListeners();
  }

  sendRequest = (e) => {
    e.preventDefault();
    fetch(`${window.location + "Contractor/Save "}`, {
        method: "POST",
      })
      .then((res) => {
        if (res.ok) return console.log(res);
        return Promise.reject(
          (this.form.querySelector(".error-text").innerHTML = this.errorMessage)
        );
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  sendForm = () => {
    const isValidated = this.validate();
    if (!isValidated) {
      this.errorBox.classList.add("active");
      return;
    } else {
      this.clearErrorBox();
      this.activeRadioInput.value = "";
    }
  };

  validate = () => {
    const nipRegex = /^[0-9]{10}$/;
    const peselRegex = /^[0-9]{11}$/;
    const inputToCheckValue = this.activeRadioInput.value;
    switch (this.activeRadioInput.name) {
      case "pesel":
        return peselRegex.test(String(inputToCheckValue));
      case "nip":
        return nipRegex.test(String(inputToCheckValue));
    }
  };

  setTypeInputVisible = (e) => {
    switch (e.target.value) {
      case "person":
        this.form.querySelector(".pesel").classList.add("active");
        this.form.querySelector(".nip").classList.remove("active");
        break;
      case "company":
        this.form.querySelector(".nip").classList.add("active");
        this.form.querySelector(".pesel").classList.remove("active");
        break;
    }
  };

  handleAttachment = (e) => {
    const imageURL = URL.createObjectURL(e.target.files[0]);
    let attachmentsBox = this.form.querySelector('.attachments')
    const newImg = document.createElement("img");
    newImg.src = imageURL
    newImg.classList.add('attachment-item')
    attachmentsBox.appendChild(newImg);
  }

  clearErrorBox = () => this.errorBox.classList.remove("active");

  initListeners = () => {
    this.form.addEventListener("submit", (e) => this.sendRequest(e));
    this.radioButtons.forEach((btn) => {
      btn.addEventListener("change", (e) => {
        this.setTypeInputVisible(e);
        this.clearErrorBox();
      });
    });
    this.sendingButton.addEventListener("click", () => this.sendForm());
    this.fileInput.addEventListener("change", (e) => this.handleAttachment(e));
  };
}

const form = document.getElementById("#form166");
const errorMessage = "Nie znaleziono metody zapisu";
const contractorForm = new FormHandler(form, errorMessage);