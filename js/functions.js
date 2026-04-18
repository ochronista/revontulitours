document.addEventListener("DOMContentLoaded", () => {

    /* filter for catalog.html */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const products = document.querySelectorAll(".product");

    if (filterButtons.length && products.length) {

        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {

                const category = btn.dataset.category;

                products.forEach(product => {
                    const match =
                        category === "all" ||
                        product.classList.contains(category);

                    product.classList.toggle("d-none", !match);
                });

                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });
    }

    /* form for contactus.html */

    const form = document.getElementById("contactForm");
    if (!form) return;

    const submitBtn = form.querySelector("input[type='submit']");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    const queryTypeSelect = document.getElementById("queryType");
    const tourContainer = document.getElementById("tourSelectionContainer");
    const tourSelect = document.getElementById("tourType");

    const paxField = document.getElementById("travelerCountField");
    const textarea = document.getElementById("textarea");

    let iti = null;

    /* phone input with country codes */

    if (phoneInput && window.intlTelInput) {
        iti = window.intlTelInput(phoneInput, {
            initialCountry: "fi",
            separateDialCode: true,
            preferredCountries: ["fi", "us", "ie", "gb", "br"]
        });
    }

    /* toggle for tour field on contactus.html */

    const toggleTour = () => {
        if (!queryTypeSelect || !tourContainer) return;

        if (queryTypeSelect.value === "booking") {
            tourContainer.classList.remove("d-none");
        } else {
            tourContainer.classList.add("d-none");
            if (tourSelect) tourSelect.value = "";
        }
    };

    if (queryTypeSelect) {
        queryTypeSelect.addEventListener("change", toggleTour);
        toggleTour(); // run on load (IMPORTANT FIX)
    }

    /* url parameters from catalog.html to contactus.html */

    const params = new URLSearchParams(window.location.search);

    const tourParam = params.get("tour");
    const paxParam = params.get("pax");

    if (tourParam && queryTypeSelect && tourSelect) {
        queryTypeSelect.value = "booking";
        toggleTour();
        tourSelect.value = tourParam;
    }

    if (paxParam && paxField) {
        paxField.value = paxParam;
    }

    /* validation */

    const showError = (id, msg) => {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
    };

    const clearError = (id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    };

    const validate = () => {
        let ok = true;

        if (!nameInput?.value.trim()) {
            showError("nameError", "Enter your name");
            ok = false;
        } else clearError("nameError");

        if (!emailInput?.value.includes("@")) {
            showError("emailError", "Enter s valid email");
            ok = false;
        } else clearError("emailError");

        if (phoneInput) {
            const validPhone = iti && iti.isValidNumber();
            if (!validPhone) {
                showError("phoneError", "Enter a valid phone");
                ok = false;
            } else clearError("phoneError");
        }

        if (!queryTypeSelect?.value) {
            showError("queryTypeError", "Select option");
            ok = false;
        } else clearError("queryTypeError");

        if (queryTypeSelect?.value === "booking" && !tourSelect?.value) {
            showError("tourTypeError", "Select tour");
            ok = false;
        } else clearError("tourTypeError");

        if (!textarea?.value || textarea.value.length < 10) {
            showError("textareaError", "Minimum 10 characters");
            ok = false;
        } else clearError("textareaError");

        if (submitBtn) submitBtn.disabled = !ok;

        return ok;
    };

    form.addEventListener("input", validate);
    form.addEventListener("change", validate);

    /* submit */

    form.addEventListener("submit", e => {
        e.preventDefault();

        if (!validate()) return;

        alert("Message sent successfully!");

        form.reset();

        toggleTour();

        if (iti) iti.setCountry("fi");

        document.querySelectorAll(".text-danger").forEach(e => e.textContent = "");
    });

});