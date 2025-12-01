document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("labForm");
    const resultsBox = document.getElementById("results");
    const popup = document.getElementById("popupSuccess");
    const submitBtn = form.querySelector("button[type='submit']");

    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
    submitBtn.style.cursor = "not-allowed";


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

    function showError(input, message) {
        input.style.border = "1px solid red";

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


    const phoneInput = document.getElementById("phone");

    phoneInput.addEventListener("input", function () {
        let numbers = phoneInput.value.replace(/\D/g, "");

        
        if (!numbers.startsWith("370")) {
            numbers = "370" + numbers;
        }

        
        let formatted = "+";
        formatted += numbers.substring(0, 3); 

        if (numbers.length > 3) {
            formatted += " " + numbers[3]; 
        }

        if (numbers.length > 4) {
            formatted += numbers.substring(4, 6);
        }

        if (numbers.length > 6) {
            formatted += " " + numbers.substring(6, 10); 
        }

        phoneInput.value = formatted;
    });


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

        popup.style.display = "block";
        setTimeout(() => popup.style.display = "none", 2000);
    });

});
document.addEventListener("DOMContentLoaded", function () {

  const emojis = ['🔥','⭐','🎧','⚡','🎮','🍀','🚗','🎲','🐱','🍎','🎵','🧩'];

  let board = document.getElementById("gameBoard");
  let movesText = document.getElementById("moves");
  let matchesText = document.getElementById("matches");
  let winMessage = document.getElementById("winMessage");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;

function loadBestScore() {
  const difficulty = document.getElementById("difficulty").value;
  const key = difficulty + "_best";

  const best = localStorage.getItem(key);

  if (best) {
    document.getElementById("bestScore").innerText = best;
  } else {
    document.getElementById("bestScore").innerText = "--";
  }
}

function updateBestScore() {
  const difficulty = document.getElementById("difficulty").value;
  const key = difficulty + "_best";

  const previous = localStorage.getItem(key);

  if (!previous || moves < previous) {
    localStorage.setItem(key, moves);
  }

  loadBestScore();
}
  let timerInterval;
  let seconds = 0;

  function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;

    timerInterval = setInterval(() => {
        seconds++;

        let mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        let secs = String(seconds % 60).padStart(2, "0");

        document.getElementById("timer").innerText = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}
  function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
  }

  function generateBoard() {
    board.innerHTML = "";
    winMessage.style.display = "none";
    moves = 0;
    matches = 0;
    startTimer();

    movesText.innerText = moves;
    matchesText.innerText = matches;

    const difficulty = document.getElementById("difficulty").value;
    let neededPairs = difficulty === "easy" ? 6 : 12;

    let selected = emojis.slice(0, neededPairs);
    let gameSet = shuffle([...selected, ...selected]);

    board.className = "memory-board " + difficulty;

    gameSet.forEach(icon => {
      const card = document.createElement("div");
      card.classList.add("memory-card");
      card.dataset.icon = icon;
      card.innerHTML = ""; // hidden at start

      card.addEventListener("click", flipCard);

      board.appendChild(card);
    });
    loadBestScore();
  }

  function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    this.innerHTML = this.dataset.icon;

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;

    moves++;
    movesText.innerText = moves;

    checkMatch();
  }

  function checkMatch() {
    if (firstCard.dataset.icon === secondCard.dataset.icon) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      matches++;
      matchesText.innerText = matches;

      resetTurn();

      const totalPairs = document.getElementById("difficulty").value === "easy" ? 6 : 12;
      if (matches === totalPairs) {
        winMessage.style.display = "block";
        stopTimer();
        updateBestScore();
      }

    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard.innerHTML = "";
        secondCard.innerHTML = "";
        resetTurn();
      }, 800);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  document.getElementById("startGame").addEventListener("click", generateBoard);
  document.getElementById("restartGame").addEventListener("click", generateBoard);

});