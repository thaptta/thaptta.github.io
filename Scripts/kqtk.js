document.addEventListener("DOMContentLoaded", function () {
    const keywordDisplay = document.getElementById("keyword-display");
    const resultsList = document.getElementById("results-list");

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword");

    if (keyword) {
        keywordDisplay.textContent = keyword;
        resultsList.innerHTML = `
            <ul>
                <li>Kết quả 1 cho từ khóa "<strong>${keyword}</strong>"</li>
                <li>Kết quả 2 cho từ khóa "<strong>${keyword}</strong>"</li>
                <li>Kết quả 3 cho từ khóa "<strong>${keyword}</strong>"</li>
            </ul>
        `;
    } else {
        keywordDisplay.textContent = "(Không có từ khóa)";
        resultsList.innerHTML = "<p>Vui lòng nhập từ khóa để tìm kiếm.</p>";
    }

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const newKeyword = searchInput.value.trim();
        if (newKeyword) {
            window.location.href = "kqtk.html?keyword=" + encodeURIComponent(newKeyword);
        } else {
            alert("Vui lòng nhập từ khóa tìm kiếm.");
        }
    });
});
