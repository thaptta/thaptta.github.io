document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".navbar a");
    const tabContents = document.querySelectorAll(".tab-content");
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");

    const contentTrangChu = document.getElementById("content-trangchu");
    tabContents.forEach(tab => tab.style.display = "none");
    if (contentTrangChu) contentTrangChu.style.display = "block";

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const target = this.getAttribute("data-target");
            const activeTab = document.getElementById("content-" + target);
            tabContents.forEach(tab => tab.style.display = "none");
            if (activeTab) activeTab.style.display = "block";
            searchInput.value = "";
        });
    });

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        if (keyword) {
            window.location.href = "kqtk.html?keyword=" + encodeURIComponent(keyword);
        } else {
            alert("Vui lòng nhập từ khóa tìm kiếm.");
        }
    });
});
