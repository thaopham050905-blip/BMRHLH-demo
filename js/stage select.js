const stageCards = document.querySelectorAll(".stage-card");
const backButton = document.getElementById("back-button");

stageCards.forEach((card) => {
    card.addEventListener("click", () => {
        const stage = card.dataset.stage;
        window.location.href = `gameplay${stage}.html`;
    });
});

backButton.addEventListener("click", () => {
    window.location.href = "character select.html";
});
