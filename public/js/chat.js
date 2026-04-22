import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
import "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";

// đăng ký plugin
FilePond.registerPlugin(FilePondPluginImagePreview);
// khởi tạo
const inputElement = document.querySelector(".filepond");
const upload = FilePond.create(inputElement, {
  allowMultiple: true,
  maxFiles: 10,
});

// Mở popup chọn file khi click vào icon ảnh custom
const customIconImage = document.querySelector(".button-icon-image");
if (customIconImage) {
  customIconImage.addEventListener("click", () => {
    upload.browse();
  });
}
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.getFiles().map((fileItem) => fileItem.file);

    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      upload.removeFiles();
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
//

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  const div = document.createElement("div");
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if (myId === data.user_id) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullname}</div>`;

    div.classList.add("inner-incoming");
  }

  div.setAttribute("message-id", data._id);

  if (data.content) {
    htmlContent = `
      <div class="inner-box">
        <div class="inner-content">${data.content}</div>
        ${
          myId === data.user_id
            ? `
        <div class="inner-action">
          <i class="fa-solid fa-ellipsis"></i>
          <div class="inner-menu">
            <div data-id="${data._id}" class="delete-message">Xóa</div>
          </div>
        </div>`
            : ""
        }
      </div>
    `;
  }

  if (data.images.length > 0) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `
      <div class="image-item">
        <img src="${image}">
        ${
          myId === data.user_id
            ? `
        <div class="inner-action">
          <i class="fa-solid fa-ellipsis"></i>
          <div class="inner-menu">
            <div data-id="${data._id}" data-image="${image}" class="delete-image">Xóa ảnh</div>
          </div>
        </div>`
            : ""
        }
      </div>`;
    }

    htmlImages += `</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;

  body.insertBefore(div, boxTyping);

  // Tự động cuộn xuống đáy khi có tin nhắn mới
  body.scrollTop = body.scrollHeight;
  //Preview Images
  const gallery = new Viewer(div);
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

//Show Typing
var timeOut;

const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
//END Show Typing

const inputChat = document.querySelector(
  ".chat .inner-form input[name='content']",
);

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker && inputChat) {
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode; // Lấy ký tự emoji
    inputChat.value = inputChat.value + icon; // Thêm vào sau nội dung cũ trong input

    const end = inputChat.value.length;

    inputChat.setSelectionRange(end, end);
    inputChat.focus();

    showTyping();
  });
}

//input keyup

if (inputChat) {
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    showTyping();
  });
}
// END input keyup

//end show icon chat

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      // Check if typing indicator for this user already exists
      const existTyping = elementListTyping.querySelector(
        `[user-id='${data.user_id}']`,
      );

      if (!existTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.user_id);

        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullname}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          `;
        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id='${data.user_id}']`,
      );
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}
//END SERVER_RETURN_TYPING

//PREVIEW FULL IMAGE
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if (bodyChatPreviewImage) {
  const gallery = new Viewer(bodyChatPreviewImage);
}
//END PREVIEW FULL IMAGE

// LẮNG NGHE SỰ KIỆN CLICK NÚT XÓA (GỬI YÊU CẦU LÊN SERVER)
const bodyChatElement = document.querySelector(".chat .inner-body");
if (bodyChatElement) {
  bodyChatElement.addEventListener("click", (e) => {
    // Xóa tin nhắn (toàn bộ)
    const btnDeleteContent = e.target.closest(".delete-message");
    if (btnDeleteContent) {
      const messageId = btnDeleteContent.getAttribute("data-id");
      socket.emit("CLIENT_SEND_DELETE_MESSAGE", messageId);
    }

    const btnDeleteImage = e.target.closest(".delete-image");
    if (btnDeleteImage) {
      const messageId = btnDeleteImage.getAttribute("data-id");
      const image = btnDeleteImage.getAttribute("data-image");
      socket.emit("CLIENT_SEND_DELETE_IMAGE", {
        _id: messageId,
        image: image,
      });
    }
  });
}

// NHẬN YÊU CẦU XÓA TIN NHẮN TỪ SERVER (CẬP NHẬT UI REALTIME)
socket.on("SERVER_RETURN_DELETE_MESSAGE", (messageId) => {
  const divMessage = document.querySelector(`[message-id='${messageId}']`);
  if (divMessage) {
    divMessage.remove();
  }
});

// NHẬN YÊU CẦU XÓA ẢNH TỪ SERVER (CẬP NHẬT UI REALTIME)
socket.on("SERVER_RETURN_DELETE_IMAGE", (data) => {
  const divMessage = document.querySelector(`[message-id='${data._id}']`);
  if (divMessage) {
    // Tìm thẻ chứa ảnh tương ứng và gỡ đi
    const imgItem = divMessage.querySelectorAll(".image-item");
    imgItem.forEach((item) => {
      const img = item.querySelector(`img[src='${data.image}']`);
      if (img) {
        item.remove();
      }
    });
  }
});
