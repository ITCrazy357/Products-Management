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
  buttonsMinus.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button
        .closest(".input-group")
        .querySelector(".input-quantity");
      let currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
      }
    });
  });
}

if (buttonsPlus.length > 0) {
  buttonsPlus.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button
        .closest(".input-group")
        .querySelector(".input-quantity");
      let currentValue = parseInt(input.value);
      input.value = currentValue + 1;
    });
  });
}
// END Quantity Input Buttons

// ===== Chuyển đổi Form Đăng nhập / Đăng ký =====
const authTabs = document.querySelectorAll(".auth-tab");
if (authTabs.length > 0) {
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Bỏ active tất cả các tab
      authTabs.forEach((t) => t.classList.remove("active"));

      // Thêm active cho tab được click
      tab.classList.add("active");

      // Ẩn tất cả các form
      const authForms = document.querySelectorAll(".auth-form");
      authForms.forEach((form) => form.classList.remove("active"));

      // Hiện form tương ứng
      const target = tab.getAttribute("data-target");
      const targetForm = document.getElementById(`form-${target}`);
      if (targetForm) {
        targetForm.classList.add("active");
      }

      // Tự động đổi đường dẫn URL trên trình duyệt nhưng không load lại web
      const url = target === "login" ? "/user/login" : "/user/register";
      window.history.pushState({}, "", url);
    });
  });
}

// Hiển thị con mắt ẩn/hiện mật khẩu
const toggles = document.querySelectorAll(".toggle-password");

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const inputId = toggle.getAttribute("data-target");
    const input = document.getElementById(inputId);

    if (input.type === "password") {
      input.type = "text";
      toggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      input.type = "password";
      toggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  });
});

// ===== Thêm vào giỏ hàng (AJAX + Animation bay) =====
const formsAddToCart = document.querySelectorAll(".form-add-to-cart");
if (formsAddToCart.length > 0) {
  formsAddToCart.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Ngăn chặn form load lại trang

      const action = form.getAttribute("action");
      const method = form.getAttribute("method") || "POST";
      const quantity = form.querySelector("input[name='quantity']").value;

      // 1. Gửi request ngầm lên server
      fetch(action, {
        method: method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `quantity=${quantity}`,
      })
        .then(() => {
          // 2. Xử lý Animation bay vào giỏ hàng
          const productItem = form.closest(".product-item");
          const productImage = productItem.querySelector(".inner-image img");
          const cartIcon = document.querySelector(
            ".header .inner-actions__item i.fa-cart-shopping",
          );

          if (productImage && cartIcon) {
            const imgRect = productImage.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();

            // Tạo một ảnh clone đè lên ảnh thật
            const cloneImg = productImage.cloneNode(true);
            cloneImg.style.position = "fixed";
            cloneImg.style.top = `${imgRect.top}px`;
            cloneImg.style.left = `${imgRect.left}px`;
            cloneImg.style.width = `${imgRect.width}px`;
            cloneImg.style.height = `${imgRect.height}px`;
            cloneImg.style.borderRadius = "8px";
            cloneImg.style.zIndex = "9999";
            cloneImg.style.transition =
              "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // bay mượt
            cloneImg.style.objectFit = "cover";
            cloneImg.style.pointerEvents = "none";
            document.body.appendChild(cloneImg);

            // Thu nhỏ và di chuyển ảnh clone đến icon giỏ hàng
            setTimeout(() => {
              cloneImg.style.top = `${cartRect.top}px`;
              cloneImg.style.left = `${cartRect.left}px`;
              cloneImg.style.width = "20px";
              cloneImg.style.height = "20px";
              cloneImg.style.opacity = "0.5";
            }, 10);

            // 3. Xóa ảnh clone và cập nhật số trên giỏ hàng
            setTimeout(() => {
              cloneImg.remove();

              // Lấy thẻ hiển thị số lượng giỏ hàng
              const cartLink = cartIcon.parentElement;
              let cartBadge = cartLink.querySelector(".cart-badge");

              if (cartBadge) {
                const currentQuantity = parseInt(cartBadge.innerText);
                cartBadge.innerText = currentQuantity + parseInt(quantity);
              } else {
                // Nếu giỏ hàng đang trống, tạo mới badge
                cartBadge = document.createElement("span");
                cartBadge.classList.add("cart-badge");
                cartBadge.innerText = quantity;
                cartLink.appendChild(cartBadge);
              }

              // Hiệu ứng nảy giỏ hàng
              cartLink.classList.add("cart-bounce");
              setTimeout(() => {
                cartLink.classList.remove("cart-bounce");
              }, 300);
            }, 800); // 800ms khớp với thời gian transition ở trên
          }
        })
        .catch((error) => console.error("Lỗi khi thêm vào giỏ:", error));
    });
  });
}

// ===== Upload Avatar =====
const uploadAvatarInput = document.querySelector(".input-upload-avatar");
if (uploadAvatarInput) {
  uploadAvatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = document.querySelector(".image-preview");
      const iconDefault = document.querySelector(".icon-default");
      const formUploadAvatar = document.querySelector("#form-upload-avatar");

      // Cập nhật lại UI preview
      imagePreview.src = URL.createObjectURL(file);
      imagePreview.classList.remove("d-none");

      if (iconDefault) {
        iconDefault.classList.add("d-none");
      }

      // Tự động submit form khi người dùng đã chọn xong ảnh
      if (formUploadAvatar) {
        formUploadAvatar.submit();
      }
    }
  });
}
