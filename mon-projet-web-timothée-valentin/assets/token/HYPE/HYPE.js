function loadTokenData(tokenName) {
    fetch(`/token/${tokenName.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
            selected.querySelector("img").src = data.logo;
            selected.querySelector("span").textContent = data.name;
            multiplier = data.price;
        })
        .catch(err => {
            console.error("Erreur chargement token:", err);
        });
}
