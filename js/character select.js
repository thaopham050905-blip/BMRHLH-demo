const characters = [
    {
        id: "dai-trang",
        name: "ĐÀI TRANG",
        image: "assets/character%20select/charDaiTrang.svg",
        alt: "Đài Trang",
        locked: false
    }
];

let currentCharacter = 0;

const characterImage = document.getElementById("character-image");
const characterName = document.getElementById("character-name");
const selectCharacterButton = document.getElementById("select-character");
const backCharacterButton = document.getElementById("back-character");
const prevCharacterButton = document.getElementById("prev-character");
const nextCharacterButton = document.getElementById("next-character");
const characterLock = document.getElementById("character-lock");

function updateCharacter() {
    const character = characters[currentCharacter];
    characterImage.src = character.image;
    characterImage.alt = character.alt;
    characterName.textContent = character.name;
    characterLock.classList.remove("show");
    selectCharacterButton.disabled = !!character.locked;
}

prevCharacterButton.addEventListener("click", () => {
    currentCharacter = (currentCharacter - 1 + characters.length) % characters.length;
    updateCharacter();
});

nextCharacterButton.addEventListener("click", () => {
    currentCharacter = (currentCharacter + 1) % characters.length;
    updateCharacter();
});

selectCharacterButton.addEventListener("click", () => {
    const character = characters[currentCharacter];
    if (character.locked) return;
    localStorage.setItem("selectedCharacter", character.id);
    window.location.href = "stage select.html";
});

backCharacterButton.addEventListener("click", () => {
    window.location.href = "index.html";
});

updateCharacter();
