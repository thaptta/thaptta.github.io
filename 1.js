document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".navbar a");
    const tabContents = document.querySelectorAll(".tab-content");
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");

    // Khởi tạo: Đảm bảo chỉ có Trang chủ được hiển thị ban đầu
    const contentTrangChu = document.getElementById("content-trangchu");
    tabContents.forEach(tab => tab.style.display = "none");
    if (contentTrangChu) contentTrangChu.style.display = "block";

    // === Xử lý khi click vào menu (Chuyển tab nội dung) ===
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const target = this.getAttribute("data-target");
            const activeTab = document.getElementById("content-" + target);

            // Ẩn tất cả tab và hiện tab được chọn
            tabContents.forEach(tab => tab.style.display = "none");
            if (activeTab) activeTab.style.display = "block";

            // Xoá nội dung tìm kiếm khi chọn menu
            searchInput.value = "";
        });
    });

    // === Xử lý sự kiện Submit của Form (CHUYỂN HƯỚNG SANG TRANG KẾT QUẢ) ===
    searchForm.addEventListener("submit", function (e) {
        // NGĂN CHẶN trình duyệt tải lại trang
        e.preventDefault(); 
        
        const keyword = searchInput.value.trim();

        if (keyword) {
            // Thay 'ket_qua_tim_kiem.html' bằng 'kqtk.html' nếu bạn đặt tên file là kqtk.html
            window.location.href = "kqtk.html?keyword=" + encodeURIComponent(keyword);
        } else {
            alert("Vui lòng nhập từ khóa tìm kiếm.");
        }
    });
});