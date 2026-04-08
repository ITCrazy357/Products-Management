// Xử lý tăng/giảm số lượng sản phẩm trong giỏ hàng
const buttonsMinus = document.querySelectorAll(".btn-minus");
const buttonsPlus = document.querySelectorAll(".btn-plus");

// Logic chung để cập nhật (có thể tích hợp Ajax sau này)
const updateQuantity = (input) => {
    const productId = input.getAttribute("item-id");
    const quantity = input.value;
    // Đoạn này sau này bạn có thể fetch/axios lên server để update giỏ hàng Realtime
    // window.location.href = `/cart/update/${productId}/${quantity}`;
};

if (buttonsMinus.length > 0) {
    buttonsMinus.forEach(button => {
        button.addEventListener("click", () => {
            const input = button.parentElement.querySelector(".input-quantity");
            let currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateQuantity(input);
            }
        });
    });
}

if (buttonsPlus.length > 0) {
    buttonsPlus.forEach(button => {
        button.addEventListener("click", () => {
            const input = button.parentElement.querySelector(".input-quantity");
            let currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateQuantity(input);
        });
    });
}