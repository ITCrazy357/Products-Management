//Show Alert
const showAlert = document.querySelectorAll("[show-alert]");
if (showAlert.length > 0) {
  showAlert.forEach((alert) => {
    const time = parseInt(alert.getAttribute("data-time"));
    const closeAlert = alert.querySelector("[close-alert]");

    setTimeout(() => {
      alert.classList.add("alert-hidden");
    }, time);

    if (closeAlert) {
      closeAlert.addEventListener("click", () => {
        alert.classList.add("alert-hidden");
      });
    }
  });
}
//END Show Alert

// Quantity Input Buttons (+/-)
const buttonsMinus = document.querySelectorAll(".btn-minus");
const buttonsPlus = document.querySelectorAll(".btn-plus");

if (buttonsMinus.length > 0) {
    buttonsMinus.forEach(button => {
        button.addEventListener("click", () => {
            const input = button.closest(".input-group").querySelector(".input-quantity");
            let currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });
    });
}

if (buttonsPlus.length > 0) {
    buttonsPlus.forEach(button => {
        button.addEventListener("click", () => {
            const input = button.closest(".input-group").querySelector(".input-quantity");
            let currentValue = parseInt(input.value);
            input.value = currentValue + 1;
        });
    });
}
// END Quantity Input Buttons