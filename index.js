const cardName = document.getElementById("cardname");
const cardDate = document.getElementById("carddate");
const cardYear = document.getElementById("cardyear");
const cardNumber = document.getElementById("cardvalue");
const cardCvc = document.getElementById("cardcvc");
const cardInput = document.querySelectorAll("input");
const cardButton = document.getElementById("button");
const form = document.querySelector("form");
const thankYouCard = document.querySelector(".thankyou");
const thanksButton = document.getElementById("thanksbutton");
var masterCardRegex = /^(?:5[1-5][0-9]{14})$/;
var visaCardRegex = /^(?:4[0-9]{12})(?:[0-9]{3})$/;
let verve = /^(?:50[067][180]|6500)(?:[0-9]{15})$/;

//realtime data switch
class RealTimeInput {
  constructor() {
    this.limit = "";
    this.el = cardInput;
    this.el[0].addEventListener("keyup", () => {
      this.cardName();
    });
    this.el[1].addEventListener("keyup", () => {
      this.cardNumber();
    });
    this.el[2].addEventListener("keyup", () => {
      this.cardExpDate(2, cardDate);
    });
    this.el[3].addEventListener("keyup", () => {
      this.cardExpDate(3, cardYear);
    });
    this.el[4].addEventListener("keyup", () => {
      this.cardExpDate(4, cardCvc);
    });
  }
  cardName() {
    let input = this.el[0].value;
    if (input !== " ") {
      if (input.length > 12) {
        let splitName = input.split(" ");
        let shortName = splitName
          .map((name) => {
            return name[0];
          })
          .join(".")
          .toLocaleUpperCase();
        cardName.textContent = shortName;
      } else {
        cardName.textContent = this.el[0].value;
      }
    }
  }
  cardNumber() {
    if (this.el[1].value !== " ") {
      let label = this.el[1].nextElementSibling;
      let input = this.el[1].value;
      let newValue = input.replace(/[^\d]/g, "");
      this.limit = newValue.substring(0, 16);
      let newSection = this.limit.match(/\d{1,4}/g);
      if (newSection !== null) {
        newValue = newSection.join(" ");
      }
      if (this.el[1].value !== newValue) {
        this.el[1].value = newValue;
      }
      cardNumber.textContent = this.el[1].value;
      if (this.limit.match(masterCardRegex)) label.textContent = `Mastercard`;

      if (this.limit.match(visaCardRegex)) label.textContent = `Visacard`;

      if (this.limit.match(verve)) label.textContent = `Vervecard`;
    }
  }
  cardExpDate(num, el) {
    let input = this.el[num].value;
    let newValue = input.replace(/[^\d]/g, "");
    this.el[num].value = newValue;
    el.textContent = this.el[num].value;
  }
  errorMessage(num, message) {
    let label = this.el[num].nextElementSibling;
    label.textContent = `${message}`;
    label.classList.add("danger");
  }
  normal() {
    cardName.textContent = "Jane Appleseed";
    cardCvc.textContent = "000";
    cardDate.textContent = "00";
    cardYear.textContent = "00";
    cardNumber.textContent = "000 000 000 000";
  }
  cardValidity() {
    let isEroor = false;
    console.log(this.el[0].value.length);
    if (this.el[0].value === "") {
      this.errorMessage(0, "Empty field fill in CardName");
      isEroor = true;
    }
    if (
      this.el[1].value === "" ||
      this.el[1].value.length < 16 ||
      this.limit < 16
    ) {
      this.errorMessage(1, `fill in CardNumber Appropriately`);
      isEroor = true;
    }

    if (this.el[2].value === "") {
      this.errorMessage(2, "fill in Day");
      isEroor = true;
    }
    if (this.el[3].value === "") {
      this.errorMessage(3, "fill in year");
      isEroor = true;
    }
    if (this.el[4].value === "") {
      this.errorMessage(4, "fill in cvc");
      isEroor = true;
    } else if (!isEroor) {
      let thanksText;
      form.classList.add("displayz");
      thankYouCard.classList.remove("displayz");
      let thankstext = thankYouCard.querySelector("h1");
      if (this.el[0].value.length > 5) {
        let sliced = this.el[0].value.split(" ");
        thanksText = sliced[0].toLocaleUpperCase();
      }
      thankstext.textContent = `THANK YOU ${
        thanksText === undefined ? "!" : thanksText
      } `;
      form.querySelectorAll("label").forEach((labels) => {
        labels.textContent = "";
        labels.classList.remove("danger");
      });
      form.reset();
    }
  }
}

let cardRealTime = new RealTimeInput();
thanksButton.addEventListener("click", () => {
  form.classList.remove("displayz");
  thankYouCard.classList.add("displayz");
  cardRealTime.normal();
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  cardRealTime.cardValidity();
});
