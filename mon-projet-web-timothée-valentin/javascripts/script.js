document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("inputAmount");
    const output = document.getElementById("outputAmount");
    const calcSpan = document.getElementById("calculatedValue");
    const swapButton = document.getElementById("swapButton");

    // Récupérer les deux dropdowns
    const inputDropdown = document.getElementById("inputTokenDropdown");
    const outputDropdown = document.getElementById("outputTokenDropdown");
    
    const inputSelected = inputDropdown.querySelector(".selected-token");
    const inputMenu = inputDropdown.querySelector(".dropdown-menu");
    const inputSelectedLogo = inputSelected.querySelector(".selected-logo");
    const inputSelectedName = inputSelected.querySelector(".selected-name");
    
    const outputSelected = outputDropdown.querySelector(".selected-token");
    const outputMenu = outputDropdown.querySelector(".dropdown-menu");
    const outputSelectedLogo = outputSelected.querySelector(".selected-logo");
    const outputSelectedName = outputSelected.querySelector(".selected-name");

    let inputMultiplier = 25; // Par défaut HYPE
    let outputMultiplier = 1; // Par défaut USDT0
    let lastEstimate = 0;
    let animationFrameId = null;

    

    // Fonction pour gérer la sélection d'un token
    function handleTokenSelection(selectedElement, logoElement, nameElement, menuElement, isInputToken) {
        return function(option) {
            option.addEventListener("click", (e) => {
                e.stopPropagation();
                
                const name = option.getAttribute("data-token");
                const logo = option.getAttribute("data-logo");
                const imgSrc = option.querySelector("img").src;

                // Met à jour le texte et le logo du token sélectionné
                nameElement.textContent = name;
                
                if (imgSrc) {
                    logoElement.src = imgSrc;
                    logoElement.style.display = "inline-block";
                }

                menuElement.style.display = "none";

                // Mise à jour du multiplier selon le token
                let multiplierValue;
                switch (name.toLowerCase()) {
                    case "hype":
                        multiplierValue = 25;
                        break;
                    case "sthype":
                        multiplierValue = 26;
                        break;
                    case "buddy":
                        multiplierValue = 0.025;
                        break;
                    case "usdxl":
                        multiplierValue = 1.001;
                        break;
                    case "kei":
                        multiplierValue = 0.9997;
                        break;
                    case "catbal":
                        multiplierValue = 12.2;
                        break;
                    case "feusd":
                        multiplierValue = 0.998;
                        break;
                    case "mhype":
                        multiplierValue = 24.5;
                        break;
                    case "usdt0":
                        multiplierValue = 1;
                        break;
                    case "pip":
                        multiplierValue = 11;
                        break;
                    default:
                        multiplierValue = 1;
                }

                // Met à jour le bon multiplier
                if (isInputToken) {
                    inputMultiplier = multiplierValue;
                } else {
                    outputMultiplier = multiplierValue;
                }

                // Recalcul si nécessaire
                triggerCalculation();
            });
        };
    }

    // Gestion du menu déroulant INPUT
    inputSelected.addEventListener("click", (e) => {
        e.stopPropagation();
        inputMenu.style.display = inputMenu.style.display === "block" ? "none" : "block";
        // Fermer l'autre menu si ouvert
        outputMenu.style.display = "none";
    });

    // Gestion du menu déroulant OUTPUT
    outputSelected.addEventListener("click", (e) => {
        e.stopPropagation();
        outputMenu.style.display = outputMenu.style.display === "block" ? "none" : "block";
        // Fermer l'autre menu si ouvert
        inputMenu.style.display = "none";
    });

    // Appliquer les gestionnaires aux options des deux menus
    inputMenu.querySelectorAll(".token-option").forEach(
        handleTokenSelection(inputSelected, inputSelectedLogo, inputSelectedName, inputMenu, true)
    );

    outputMenu.querySelectorAll(".token-option").forEach(
        handleTokenSelection(outputSelected, outputSelectedLogo, outputSelectedName, outputMenu, false)
    );

    // Fermer les menus en cliquant à l'extérieur
    document.addEventListener("click", (e) => {
        if (!inputDropdown.contains(e.target)) {
            inputMenu.style.display = "none";
        }
        if (!outputDropdown.contains(e.target)) {
            outputMenu.style.display = "none";
        }
    });

    // Gestion du bouton d'échange (⇅)
    swapButton.addEventListener("click", () => {
        // Échange les tokens entre input et output
        const tempName = inputSelectedName.textContent;
        const tempLogo = inputSelectedLogo.src;
        const tempMultiplier = inputMultiplier;
        
        inputSelectedName.textContent = outputSelectedName.textContent;
        inputSelectedLogo.src = outputSelectedLogo.src;
        inputMultiplier = outputMultiplier;
        
        outputSelectedName.textContent = tempName;
        outputSelectedLogo.src = tempLogo;
        outputMultiplier = tempMultiplier;
        
        // Assurer que les logos sont visibles
        inputSelectedLogo.style.display = "inline-block";
        outputSelectedLogo.style.display = "inline-block";
        
        // Recalculer après l'échange
        triggerCalculation();
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

        // Limite à 18 caractères maximum
        if (value.length > 18) {
            value = value.slice(0, 18);
            input.value = value;
        }

        const num = parseFloat(value);

        if (!isNaN(num) && value.trim() !== "") {
            // Utilise le multiplier du token d'entrée pour le calcul
            const result = num * 1 * (inputMultiplier / outputMultiplier);
            output.value = result.toFixed(6);
            output.classList.remove("placeholder");

            animateValue(calcSpan, lastEstimate, num * inputMultiplier, 600);
            lastEstimate = num * inputMultiplier;
            document.getElementById("calculatedValueOutput").textContent = (num * inputMultiplier).toFixed(2);
        } else {
            output.value = "0.0";
            output.classList.add("placeholder");

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            calcSpan.textContent = "0.00";
            lastEstimate = 0;
            document.getElementById("calculatedValueOutput").textContent = "0.00";
        }
    }

    // Gestion de l'input - version corrigée
    input.addEventListener("input", function(e) {
        // Empêche le comportement par défaut qui pourrait interférer
        e.stopPropagation();
        
        // Appelle la fonction de calcul
        triggerCalculation();
    });

    // Gestion des touches clavier - version sécurisée
    input.addEventListener("keydown", function(e) {
        // Autorise seulement les touches utiles
        const allowedKeys = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
            'Tab', 'Home', 'End'
        ];
        
        // Si la touche n'est pas autorisée, empêche le comportement par défaut
        if (!allowedKeys.includes(e.key) && 
            !(e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 'x'))) {
            e.preventDefault();
        }
    });

    // Gestion du clic sur le bouton Max
    document.querySelector(".max")?.addEventListener("click", function() {
        input.value = "36"; // Valeur maximale
        triggerCalculation();
    });

    // Initialisation
    triggerCalculation();
    
    // Empêcher la propagation dans les menus
    inputMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    
    outputMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    
    // S'assurer que l'input est focusable
    input.addEventListener("focus", function() {
        this.select(); // Sélectionne tout le texte quand on clique
    });
    // Initialisation de la valeur $ en bas
    document.getElementById("calculatedValueOutput").textContent = "0.00";

});