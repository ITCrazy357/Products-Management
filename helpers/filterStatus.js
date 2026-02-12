module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    // ✅ reset class trước
    filterStatus.forEach(item => item.class = "");

    if (query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);

        // ✅ tránh index = -1
        if (index !== -1) {
            filterStatus[index].class = "active";
        }
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }
    return filterStatus;
}