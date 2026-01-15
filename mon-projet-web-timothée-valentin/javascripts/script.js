document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("inputAmount");
    const output = document.getElementById("outputAmount");
    const calcSpan = document.getElementById("calculatedValue");

    const dropdown = document.getElementById("tokenDropdown");
    const selected = dropdown.querySelector(".selected-token");
    const menu = dropdown.querySelector(".dropdown-menu");

    let multiplier = 25; // Par défaut HYPE
    let lastEstimate = 0;
    let animationFrameId = null;

    // Gestion du menu déroulant
    selected.addEventListener("click", () => {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    menu.querySelectorAll(".token-option").forEach(option => {
        option.addEventListener("click", () => {
            const name = option.getAttribute("data-token");
            const logo = option.getAttribute("data-logo");

            // Met à jour le texte et le logo du token sélectionné
            selected.querySelector(".selected-name").textContent = name;
            const logoImg = selected.querySelector(".selected-logo");

            if (logo) {
                logoImg.src = logo;
                logoImg.alt = name + " logo";
                logoImg.style.display = "inline-block";
            } else {
                logoImg.removeAttribute("src");
                logoImg.alt = "";
                logoImg.style.display = "none";  // Masque complètement l'image
            }


            menu.style.display = "none";

            // Mise à jour du multiplier
            switch (name.toLowerCase()) {
                case "st hype":
                    multiplier = 25;
                    break;
                case "loopedhype":
                    multiplier = 30;
                    break;
                case "alright buddy":
                    multiplier = 10;
                    break;
                case "usdxl":
                    multiplier = 1;
                    break;
                case "kei":
                    multiplier = 5;
                    break;
                case "cat":
                    multiplier = 3;
                    break;
                case "catbal":
                    multiplier = 2;
                    break;
                case "feusd":
                    multiplier = 0.98;
                    break;
                default:
                    multiplier = 1;
            }

            // Recalcul si nécessaire
            triggerCalculation();
        });
    });

    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            menu.style.display = "none";
        }
    });

    function animateValue(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = start + (end - start) * progress;

            element.textContent = currentValue.toFixed(2);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(update);
            }
        }

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(update);
    }

    function triggerCalculation() {
        let value = input.value;

        if (value.length > 18) {
            value = value.slice(0, 18);
            input.value = value;
        }

        const num = parseFloat(value);

        if (!isNaN(num) && value.trim() !== "") {
            const result = num * 0.99;
            output.value = result.toFixed(6);
            output.classList.remove("placeholder");

            animateValue(calcSpan, lastEstimate, num * multiplier, 600);
            lastEstimate = num * multiplier;
        } else {
            output.value = "0.0";
            output.classList.add("placeholder");

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            calcSpan.textContent = "0.0";
            lastEstimate = 0;
        }
    }

    input.addEventListener("input", triggerCalculation);
    
});
