//Chúc năng gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");
      // console.log(userId);
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
//END Chúc năng gửi yêu cầu kết bạn

//Chức năng hủy yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");
      // console.log(userId);
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
//END Chức năng hủy yêu cầu kết bạn

//Lời mời kết bạn - Chức năng xóa lời mời kết bạn
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");

    const userId = button.getAttribute("btn-refuse-friend");
    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  });
};
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    refuseFriend(button);
  });
}
//END Lời mời kết bạn - Chức năng xóa lời mời kết bạn

//Lời mời kết bạn - Chức năng chấp nhận
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");

    const userId = button.getAttribute("btn-accept-friend");
    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
};
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    acceptFriend(button);
  });
}
//END Lời mời kết bạn - Chức năng chấp nhận

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-users-accept]");
if (badgeUserAccept) {
  const userId = badgeUserAccept.getAttribute("badge-users-accept");
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    if (userId === data.userId) {
      badgeUserAccept.innerHTML = data.lengthAcceptFriends;
    }
  });
}
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND

//SERVER_RETURN_INFO_ACCEPT_FRIEND
const dataUserAccept = document.querySelector("[data-users-accept]");
if (dataUserAccept) {
  const userId = dataUserAccept.getAttribute("data-users-accept");
  socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    //Vẽ giao diện
    if (userId === data.userId) {
      const div = document.createElement("div");
      div.classList.add("col-6");
      div.setAttribute("data-id", data.infoUserA._id);

      div.innerHTML = `
        <div class="box-user box-user-friend">
          <div class="inner-avatar">
            <img
              src="${data.infoUserA.avatar ? data.infoUserA.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}"
              alt="${data.infoUserA.fullname}"
              class="rounded-circle"
              width="80"
              height="80"
            >
          </div>

          <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullname}</div>

            <div class="inner-buttons">
              <button
                class="btn btn-sm btn-primary m-1"
                btn-accept-friend="${data.infoUserA._id}"
              >
                Chấp nhận
              </button>

              <button
                class="btn btn-sm btn-secondary m-1"
                btn-refuse-friend="${data.infoUserA._id}"
              >
                Xóa
              </button>

              <button
                class="btn btn-sm btn-secondary m-1"
                btn-delete-friend="${data.infoUserA._id}"
                disabled
              >
                Đã xóa
              </button>

              <button
                class="btn btn-sm btn-primary m-1"
                btn-accepted-friend="${data.infoUserA._id}"
                disabled
              >
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `;

      dataUserAccept.appendChild(div);

      //Hủy lời mời kết bạn
      const buttonRefuse = div.querySelector("[btn-refuse-friend]");
      refuseFriend(buttonRefuse);

      //Chấp nhận lời mời kết bạn
      const buttonAccept = div.querySelector("[btn-accept-friend]");
      acceptFriend(buttonAccept);
    }
  });
}
//END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_INFO_CANCEL_FRIEND
socket.on("SERVER_RETURN_INFO_CANCEL_FRIEND", (data) => {
  const boxUserRemove = document.querySelector(`[data-id='${userIdA}']`);
  if (boxUserRemove) {
    const dataUserAccept = document.querySelector("[data-users-accept]");
    dataUserAccept.removeChild(boxUserRemove);
  }
});
// END SERVER_RETURN_INFO_CANCEL_FRIEND
