// change-Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonsChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status")
    if(formChangeStatus) {
        const path = formChangeStatus.getAttribute("data-path")
        buttonsChangeStatus.forEach(button => {
            button.addEventListener("click", () => {
                const statusCurrent = button.getAttribute("data-status")
                const id = button.getAttribute("data-id")

                if(id) {
                    let statusChange = statusCurrent == "active" ? "inactive" : "active" 

                    const action = path + `/${statusChange}/${id}?_method=PATCH`
                    formChangeStatus.action = action;

                    formChangeStatus.submit();
                } else {
                    console.error("Không tìm thấy data-id trên nút thay đổi trạng thái!");
                }
            })
        })
    }
}
//END change-Status

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
    const formDeleteItem = document.querySelector("#form-delete-item")
    if(formDeleteItem) {
        const path = formDeleteItem.getAttribute("data-path")
        buttonDelete.forEach(button =>{
            button.addEventListener("click", ()=>{
                const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này không?");

                if(isConfirm){
                    const id = button.getAttribute("data-id");

                    if(id) {
                        const action = `${path}/${id}?_method=DELETE`
                        formDeleteItem.action = action;
                        formDeleteItem.submit();
                    }
                }
            })
        })
    }
}
// END Delete Item

// Restore Item
const buttonRestore = document.querySelectorAll("[button-restore]");
if(buttonRestore.length > 0){
    const formRestoreItem = document.querySelector("#form-restore-item")
    if(formRestoreItem) {
        const path = formRestoreItem.getAttribute("data-path")
        buttonRestore.forEach(button =>{
            button.addEventListener("click", ()=>{
                const id = button.getAttribute("data-id");
                if(id) {
                    const action = `${path}/${id}?_method=PATCH`;
                    
                    formRestoreItem.action = action;
                    formRestoreItem.submit();
                }
            })
        })
    }
}
// END Restore Item