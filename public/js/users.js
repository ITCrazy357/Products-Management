//Chúc năng gửi yêu cầu kết bạn
const addFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("add");

    const userId = button.getAttribute("btn-add-friend");
    socket.emit("CLIENT_ADD_FRIEND", userId);
  });
};

const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    addFriend(button);
  });
}
//END Chúc năng gửi yêu cầu kết bạn

//Chức năng hủy yêu cầu kết bạn
const cancelFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.remove("add");

    const userId = button.getAttribute("btn-cancel-friend");
    socket.emit("CLIENT_CANCEL_FRIEND", userId);
  });
};

const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    cancelFriend(button);
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

// HÀM VẼ LẠI USER VÀO DANH SÁCH NGƯỜI DÙNG
const drawUserNotFriend = (dataUserNotFriend, infoUser) => {
  const existUser = dataUserNotFriend.querySelector(
    `[user-id='${infoUser._id}']`,
  );
  if (!existUser) {
    const div = document.createElement("div");
    div.classList.add("col-6");
    div.setAttribute("user-id", infoUser._id);

    div.innerHTML = `
      <div class="box-user box-user-friend">
        <div class="inner-avatar">
          <img
            src="${infoUser.avatar ? infoUser.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}"
            alt="${infoUser.fullname}"
            class="rounded-circle"
            width="80"
            height="80"
          >
        </div>

        <div class="inner-info">
          <div class="inner-name">${infoUser.fullname}</div>

          <div class="inner-buttons">
            <button
              class="btn btn-sm btn-primary m-1"
              btn-add-friend="${infoUser._id}"
            >
              Kết bạn
            </button>

            <button
              class="btn btn-sm btn-secondary m-1"
              btn-cancel-friend="${infoUser._id}"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    `;

    dataUserNotFriend.appendChild(div);

    // Gắn sự kiện cho các nút mới
    const buttonAdd = div.querySelector("[btn-add-friend]");
    if (buttonAdd) addFriend(buttonAdd);

    const buttonCancel = div.querySelector("[btn-cancel-friend]");
    if (buttonCancel) cancelFriend(buttonCancel);
  } else {
    // Nếu box đã tồn tại nhưng đang ở trạng thái "Hủy" (có class .add) thì gỡ class đó ra để về lại "Kết bạn"
    const boxUser = existUser.querySelector(".box-user");
    if (boxUser) {
      boxUser.classList.remove("add");
    }
  }
};
// END HÀM VẼ LẠI USER VÀO DANH SÁCH NGƯỜI DÙNG

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

// SERVER_RETURN_LENGTH_REQUEST_FRIEND
const badgeUserRequest = document.querySelector("[badge-users-request]");
if (badgeUserRequest) {
  const userId = badgeUserRequest.getAttribute("badge-users-request");
  socket.on("SERVER_RETURN_LENGTH_REQUEST_FRIEND", (data) => {
    if (userId === data.userId) {
      badgeUserRequest.innerHTML = data.lengthRequestFriends;
    }
  });
}
// END SERVER_RETURN_LENGTH_REQUEST_FRIEND

//SERVER_RETURN_INFO_ACCEPT_FRIEND

socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUserAccept = document.querySelector("[data-users-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-users-accept");
    //Vẽ giao diện
    if (userId === data.userId) {
      const div = document.createElement("div");
      div.classList.add("col-6");
      div.setAttribute("user-id", data.infoUserA._id);

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
  }
  //Trang danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId === data.userId) {
      const boxUserRemove = dataUserNotFriend.querySelector(
        `[user-id='${data.infoUserA._id}']`,
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});

//END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_INFO_CANCEL_FRIEND
socket.on("SERVER_RETURN_INFO_CANCEL_FRIEND", (data) => {
  const dataUserAccept = document.querySelector("[data-users-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-users-accept");
    if (userId === data.userIdB) {
      const boxUserRemove = dataUserAccept.querySelector(
        `[user-id='${data.userIdA}']`,
      );
      if (boxUserRemove) {
        dataUserAccept.removeChild(boxUserRemove);
      }
    }
  }

  // B hiển thị lại A trong danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId === data.userIdB) {
      drawUserNotFriend(dataUserNotFriend, data.infoUserA);
    }
  }
});
// END SERVER_RETURN_INFO_CANCEL_FRIEND

// SERVER_RETURN_REFUSE_FRIEND
socket.on("SERVER_RETURN_REFUSE_FRIEND", (data) => {
  const dataUserRequest = document.querySelector("[data-users-request]");
  if (dataUserRequest) {
    const userId = dataUserRequest.getAttribute("data-users-request");
    if (userId === data.userIdA) {
      const boxUserRemove = dataUserRequest.querySelector(
        `[user-id='${data.userIdB}']`,
      );
      if (boxUserRemove) {
        dataUserRequest.removeChild(boxUserRemove);
      }
    }
  }

  // A hiển thị lại B trong danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId === data.userIdA) {
      drawUserNotFriend(dataUserNotFriend, data.infoUserB);
    }
  }
});
// END SERVER_RETURN_REFUSE_FRIEND

// SERVER_RETURN_ACCEPT_FRIEND
socket.on("SERVER_RETURN_ACCEPT_FRIEND", (data) => {
  const dataUserRequest = document.querySelector("[data-users-request]");
  if (dataUserRequest) {
    const userId = dataUserRequest.getAttribute("data-users-request");
    if (userId === data.userIdA) {
      const boxUserRemove = dataUserRequest.querySelector(
        `[user-id='${data.userIdB}']`,
      );
      if (boxUserRemove) {
        dataUserRequest.removeChild(boxUserRemove);
      }
    }
  }

  // Nếu A đang ở trang Danh sách người dùng thì xóa B đi (vì B đã trở thành bạn bè)
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId === data.userIdA) {
      const boxUserRemove = dataUserNotFriend.querySelector(
        `[user-id='${data.userIdB}']`,
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});
// END SERVER_RETURN_ACCEPT_FRIEND

// HÀM FORMAT THỜI GIAN TỰ ĐỘNG
const formatTimeAgo = (dateString) => {
  if (!dateString) return "Offline";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `Hoạt động ${interval} năm trước`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `Hoạt động ${interval} tháng trước`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `Hoạt động ${interval} ngày trước`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `Hoạt động ${interval} giờ trước`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `Hoạt động ${interval} phút trước`;
  return `Vừa mới truy cập`;
};

const updateOfflineStatus = () => {
  const offlineStatus = document.querySelectorAll(
    ".inner-status[status='offline']",
  );
  if (offlineStatus) {
    offlineStatus.forEach((off) => {
      const lastOnline = off.getAttribute("last-online");
      if (lastOnline) {
        off.setAttribute("last-online-text", " " + formatTimeAgo(lastOnline));
      } else {
        off.setAttribute("last-online-text", " Offline");
      }
    });
  }
};

updateOfflineStatus();
setInterval(updateOfflineStatus, 60000); // Cập nhật lại mỗi 1 phút

//SERVER_RETURN_USER_STATUS_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (data) => {
  const dataUserFriend = document.querySelector("[data-users-friend]");
  if (dataUserFriend) {
    const boxUser = dataUserFriend.querySelector(`[user-id='${data.userId}']`);
    if (boxUser) {
      const boxStatus = boxUser.querySelector("[status]");
      boxStatus.setAttribute("status", data.status);

      if (data.status === "offline" && data.lastOnline) {
        boxStatus.setAttribute("last-online", data.lastOnline);
        boxStatus.setAttribute(
          "last-online-text",
          " " + formatTimeAgo(data.lastOnline),
        );
      }
    }
  }
});
//END SERVER_RETURN_USER_STATUS_ONLINE
