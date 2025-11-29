document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("labForm");
    const resultsBox = document.getElementById("results");
    const popup = document.getElementById("popupSuccess");
    const submitBtn = form.querySelector("button[type='submit']");

    // Disable submit at start
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
    submitBtn.style.cursor = "not-allowed";

    // --- VALIDATION FUNCTIONS -----------------------------------

    function isNotEmpty(value) {
        return value.trim().length > 0;
    }

    function isLetters(value) {
        return /^[A-Za-z\s]+$/.test(value);
    }

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidRating(value) {
        return value >= 1 && value <= 10;
    }

    function isMeaningfulAddress(value) {
        return value.trim().length >= 5;
    }

    // Add error message under field
    function showError(input, message) {
        input.style.border = "1px solid red";

        // prevent duplication
        if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-text")) return;

        const small = document.createElement("small");
        small.classList.add("error-text");
        small.style.color = "red";
        small.style.display = "block";
        small.style.marginTop = "5px";
        small.innerText = message;

        input.insertAdjacentElement("afterend", small);
    }

    function clearError(input) {
        input.style.border = "";

        if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-text")) {
            input.nextElementSibling.remove();
        }
    }

    // --- PHONE MASKING -------------------------------------------

    const phoneInput = document.getElementById("phone");

    phoneInput.addEventListener("input", function () {
        let numbers = phoneInput.value.replace(/\D/g, ""); // remove non-digits

        // Start with +370 automatically
        if (!numbers.startsWith("370")) {
            numbers = "370" + numbers;
        }

        // Format: +370 6xx xxxx
        let formatted = "+";
        formatted += numbers.substring(0, 3); // 370

        if (numbers.length > 3) {
            formatted += " " + numbers[3];  // 6
        }

        if (numbers.length > 4) {
            formatted += numbers.substring(4, 6); // xx
        }

        if (numbers.length > 6) {
            formatted += " " + numbers.substring(6, 10); // xxxx
        }

        phoneInput.value = formatted;
    });

    // --- REAL-TIME VALIDATION --------------------------------------

    const inputs = form.querySelectorAll("input");

    inputs.forEach(input => {
        input.addEventListener("input", validateForm);
    });

    function validateForm() {
        let valid = true;

        const name = document.getElementById("name");
        if (!isNotEmpty(name.value) || !isLetters(name.value)) {
            showError(name, "Enter a valid name (letters only)");
            valid = false;
        } else clearError(name);

        const surname = document.getElementById("surname");
        if (!isNotEmpty(surname.value) || !isLetters(surname.value)) {
            showError(surname, "Enter a valid surname (letters only)");
            valid = false;
        } else clearError(surname);

        const email = document.getElementById("email");
        if (!isEmail(email.value)) {
            showError(email, "Enter a valid email");
            valid = false;
        } else clearError(email);

        const address = document.getElementById("address");
        if (!isMeaningfulAddress(address.value)) {
            showError(address, "Address must be at least 5 characters");
            valid = false;
        } else clearError(address);

        const r1 = document.getElementById("rating1");
        const r2 = document.getElementById("rating2");
        const r3 = document.getElementById("rating3");

        if (!isValidRating(r1.value)) { showError(r1, "1–10 only"); valid = false; } else clearError(r1);
        if (!isValidRating(r2.value)) { showError(r2, "1–10 only"); valid = false; } else clearError(r2);
        if (!isValidRating(r3.value)) { showError(r3, "1–10 only"); valid = false; } else clearError(r3);

        // Enable or disable submit
        if (valid) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
        } else {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            submitBtn.style.cursor = "not-allowed";
        }
    }

    // --- SUBMIT LOGIC (your required task) --------------------------

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent reload

        const data = {
            name: document.getElementById("name").value,
            surname: document.getElementById("surname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            rating1: Number(document.getElementById("rating1").value),
            rating2: Number(document.getElementById("rating2").value),
            rating3: Number(document.getElementById("rating3").value)
        };

        console.log("Form Data:", data);

        const average = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);

        let color = "white";
        if (average <= 4) color = "red";
        else if (average < 7) color = "orange";
        else color = "lightgreen";

        resultsBox.innerHTML = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Surname:</strong> ${data.surname}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Average Rating:</strong> 
              <span style="color:${color}; font-weight:600;">${average}</span></p>
        `;

        // Popup
        popup.style.display = "block";
        setTimeout(() => popup.style.display = "none", 2000);
    });

});