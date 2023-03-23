const pipe =
  (...fns) =>
  (val) =>
    fns.reduce((nv, fn) => fn(nv), val);

const randColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `${r}, ${g}, ${b}`;
};

const randColors = function (num) {
  return new Array(num).fill("").map(() => randColor());
};

const randPickColor = (colorArr) =>
  colorArr[Math.floor(Math.random() * colorArr.length)];

const gameModeObj = {
  easy: 4,
  medium: 6,
  hard: 8,
};
const DEFAULT_GAME_MODE = gameModeObj.easy;
let gameMode = DEFAULT_GAME_MODE;

let colorsArray = randColors(gameMode);
let selectedColor = randPickColor(colorsArray);

const delChildBoxes = () => {
  const boxes = document.querySelectorAll(".box-wrapper > .box");
  boxes.forEach((box) => box.parentNode.removeChild(box));
};

const setGameModes = () => {
  const gameModesEl = document.querySelectorAll(".modes > ul > li");

  for (let i = 0; i < gameModesEl.length; i++) {
    gameModesEl[i].addEventListener("click", function (evt) {
      const el = evt.target;
      for (let menuItem of el.parentNode.children) {
        menuItem.classList.remove("active");
      }
      el.classList.add("active");
      const userSelectedMode = el.textContent.trim().toLowerCase();

      if (!Object.keys(gameModeObj).includes(userSelectedMode)) {
        return;
      }
      gameMode = gameModeObj[userSelectedMode];
      colorsArray = randColors(gameMode);
      selectedColor = randPickColor(colorsArray);
      delChildBoxes();
      init();
    });
  }
};

const boxClickHandler = (evt) => {
  const el = evt.target;
  const userSelectedColor =
    el.style.backgroundColor.match(/(\d+)([\d\s\,]+)/gim)[0];
  const boxes = document.querySelectorAll(".box-wrapper > .box");

  if (userSelectedColor === selectedColor) {
    document
      .querySelector("header")
      .setAttribute("style", `background-color: rgb(${selectedColor});`);
    boxes.forEach((box) => {
      box.setAttribute("style", `background-color: rgb(${selectedColor});`);
      box.textContent = "";
    });
    document.getElementById("controls").style.backgroundColor = "green";
    document.querySelector("#controls > .message").textContent =
      "Congrats, you win!";
    return cleanupEventListeners();
  }
  el.textContent = "X";
  el.setAttribute("style", "background-color: red;");
};

const buildBoxes = () => {
  const boxWrapper = document.querySelector(".box-wrapper");
  for (let i = 0; i < gameMode; i++) {
    const div = document.createElement("div");
    div.classList.add("box");
    div.setAttribute("style", `background-color: rgb(${colorsArray[i]});`);
    div.addEventListener("click", boxClickHandler, false);
    boxWrapper.appendChild(div);
  }
};

const cleanupEventListeners = () => {
  // remove event listeners here
  const boxes = document.querySelectorAll(".box-wrapper > .box");
  boxes.forEach((box) => box.removeEventListener("click", boxClickHandler));
};

const init = () => {
  // display the boxes according to the game mode
  document.getElementById("display-color").textContent = selectedColor;
  buildBoxes();
  setGameModes();
};

init();

window.onbeforeunload = cleanupEventListeners;
