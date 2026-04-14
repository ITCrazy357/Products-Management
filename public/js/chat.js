import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
import "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}
//

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");
  let htmlFullName = "";

  if (myId === data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullname}</div>`;

    div.classList.add("inner-incoming");
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);

  // Tự động cuộn xuống đáy khi có tin nhắn mới
  body.scrollTop = body.scrollHeight;
});

//END SERVER_RETURN_MESSAGE

//Sroll chat to buttom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//END Sroll chat to buttom

//show icon chat

//Show popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
//END Show popup

const inputChat = document.querySelector(
  ".chat .inner-form input[name='content']",
);

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker && inputChat) {
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode; // Lấy ký tự emoji
    inputChat.value = inputChat.value + icon; // Thêm vào sau nội dung cũ trong input
  });
}

//input keyup
if (inputChat) {
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
  });
}
// END input keyup

//end show icon chat

//SERVER_RETURN_TYPING
socket.on("SERVER_RETURN_TYPING", (data) => {
  console.log(data);
});
//END SERVER_RETURN_TYPING
