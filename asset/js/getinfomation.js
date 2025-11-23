
lucide.createIcons();

// DOM Elements
const formContainer = document.getElementById("form-container");
const successContainer =
    document.getElementById("success-container");
const userForm = document.getElementById("userInfoForm");
const returnBtn = document.getElementById("returnBtn");

// Handle Form Submission
userForm.addEventListener("submit", function (e) {
    e.preventDefault();
    itBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
        '<i data-lucide="loader-2" class="animate-spin h-5 w-5"></i> Processing...';
    lucide.createIcons();

    setTimeout(() => {

        formContainer.classList.add("hidden");
        successContainer.classList.remove("hidden");
        successContainer.classList.add("flex");


        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 1000);
});

// Handle Return Button
returnBtn.addEventListener("click", function () {

    successContainer.classList.add("hidden");
    successContainer.classList.remove("flex");
    formContainer.classList.remove("hidden");

    userForm.reset();
});