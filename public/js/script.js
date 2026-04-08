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