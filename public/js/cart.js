// Xử lý tăng/giảm số lượng sản phẩm trong giỏ hàng
const buttonsMinus = document.querySelectorAll(".btn-minus");
const buttonsPlus = document.querySelectorAll(".btn-plus");

// Logic chung để cập nhật (có thể tích hợp Ajax sau này)
const updateQuantity = (input) => {
    const productId = input.getAttribute("product-id");
    const quantity = input.value;
    window.location.href = `/cart/update/${productId}/${quantity}`;
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

//Cập nhật số lượng sản phẩm trong giỏ hàng
const inputQuantity = document.querySelectorAll(".input-quantity");
if (inputQuantity.length > 0){
    inputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            updateQuantity(input);
        });
    });
}

// Xóa sản phẩm bằng Ajax (Không load lại trang)
const buttonsDelete = document.querySelectorAll(".btn-danger");
if (buttonsDelete.length > 0) {
    buttonsDelete.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault(); // Ngăn hành vi chuyển trang mặc định của thẻ <a>
            
            const url = button.getAttribute("href");
            
            // Dùng fetch để gọi ngầm lên server
            fetch(url)
                .then(res => res.text()) // Server xóa xong sẽ tự redirect về /cart, fetch sẽ lấy được HTML trang mới
                .then(html => {
                    // Tạo DOM ảo để lấy phần "Tổng đơn hàng" từ HTML trả về
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    
                    const newTotalElement = doc.querySelector("h3.text-right span.text-danger");
                    const currentTotalElement = document.querySelector("h3.text-right span.text-danger");
                    if(newTotalElement && currentTotalElement) {
                        currentTotalElement.innerHTML = newTotalElement.innerHTML;
                    }
                    
                    // Xóa dòng tr (hàng sản phẩm) tương ứng khỏi giao diện
                    button.closest("tr").remove();

                    // Nếu bảng trống thì reload lại để hiển thị trạng thái "Không có sản phẩm nào"
                    if (document.querySelectorAll("tbody tr").length === 0) {
                        window.location.reload();
                    }
                });
        });
    });
}