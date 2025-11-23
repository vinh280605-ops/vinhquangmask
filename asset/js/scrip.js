

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    setTimeout(() => { modal.classList.add('show'); }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

function switchModal(closeId, openId) {
    closeModal(closeId);
    setTimeout(() => { openModal(openId); }, 300);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Xử lý nút ESC để đóng
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeModal('loginModal');
        closeModal('registerModal');
    }
});

// Hàm xử lý demo
function handleLogin() {
    closeModal('loginModal');
    showToast("Login successful!");
}

function handleRegister() {
    closeModal('registerModal');
    showToast("Registration successful! Please log in.");
    setTimeout(() => openModal('loginModal'), 500);
}


// =============================================================================================================================================


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('policyModal');
    const btnAgree = document.getElementById('btnAgree');
    const btnDisagree = document.getElementById('btnDisagree');

    // 1. Kiểm tra xem người dùng đã đồng ý trước đó chưa
    const hasAgreed = localStorage.getItem('sitePolicyAgreed');

    // 2. Nếu CHƯA đồng ý, hiển thị Modal
    if (!hasAgreed) {
        modal.classList.remove('hidden');
        // Ngăn cuộn chuột trên body khi modal hiện
        document.body.style.overflow = 'hidden';
    }

    // 3. Xử lý sự kiện khi bấm "Tôi Đồng Ý"
    btnAgree.addEventListener('click', () => {
        // Lưu trạng thái vào trình duyệt
        localStorage.setItem('sitePolicyAgreed', 'true');

        // Ẩn modal
        modal.classList.add('hidden');

        // Cho phép cuộn trang trở lại
        document.body.style.overflow = 'auto';
    });

    // 4. Xử lý sự kiện khi bấm "Không đồng ý"
    btnDisagree.addEventListener('click', () => {
        alert("Rất tiếc, bạn không thể truy cập trang web nếu không đồng ý với chính sách.");

        // Điều hướng người dùng ra khỏi trang web (Ví dụ về Google)
        // Lưu ý: window.close() thường bị trình duyệt chặn nếu script không mở tab đó.
        // Cách tốt nhất là chuyển hướng (redirect).
        window.location.href = "https://www.google.com";
    });
});

// Hàm phụ trợ để test (Xóa localStorage để hiện lại popup)
function resetPolicy() {
    localStorage.removeItem('sitePolicyAgreed');
    location.reload();
}
