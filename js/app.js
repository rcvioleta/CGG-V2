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

const randColors = num => new Array(num).fill("").map(() => randColor());

const randPickColor = (colorArr) =>
  colorArr[Math.floor(Math.random() * colorArr.length)];

const gameModes = {
  easy: 4,
  medium: 6,
  hard: 8,
};
let gameMode = gameModes.easy;

const calcAttempts = () => Math.ceil(gameMode / 2);

let attempts = calcAttempts();
let colorsArray, selectedColor = undefined;

const deleteBoxes = () => {
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
      const selectedMode = el.textContent.trim().toLowerCase();
      const gameModeKeys = Object.keys(gameModes);

      if (!gameModeKeys.includes(selectedMode)) {
        window.location.reload();
      }

      if (gameModes[selectedMode] === gameMode) {
        return
      }

      gameMode = gameModes[selectedMode];
      init();
    });
  }
};

const createResetLink = (text) => {
  const a = document.createElement('a');
  a.textContent = text;
  a.href = '';
  a.onclick = evt => {
    evt.preventDefault();
    init();
  }
  return a;
}

const boxClickHandler = (evt) => {
  const el = evt.target;
  const userSelectedColor =
    el.style.backgroundColor.match(/(\d+)([\d\s\,]+)/gim)[0];
  const boxes = document.querySelectorAll(".box-wrapper > .box");
  const messageEl = document.querySelector("#controls > .message");

  if (userSelectedColor === selectedColor) {
    document
      .querySelector("header")
      .setAttribute("style", `background-color: rgb(${selectedColor});`);
    boxes.forEach((box) => {
      box.setAttribute("style", `background-color: rgb(${selectedColor});`);
      box.textContent = "";
    });
    document.getElementById("controls").style.backgroundColor = "#008000";
    messageEl.textContent = "Congrats, you win! ";
    messageEl.appendChild(createResetLink('New game'))
    cleanupEventListeners();
    return
  }

  attempts--;
  el.textContent = "X";
  el.classList.add('incorrect');
  el.setAttribute("style", `${el.getAttribute("style")}; border: 5px solid #ff0000;`);
  messageEl.textContent = `You have ${attempts} ${attempts >= 2 ? 'clicks' : 'click'} remaining.`;

  if (attempts <= 0) {
    console.log('attempts <= 0 true')
    boxes.forEach((box) => {
      if (!box.classList.contains('incorrect')) {
        box.classList.add('incorrect')
      }
      box.textContent = "X"
      box.setAttribute("style", 'color: #000; background-color: #ff0000; border: 5px solid #000;');
      document.getElementById("controls").style.backgroundColor = "#ff0000";
      messageEl.textContent = 'You lose! ';
      messageEl.appendChild(createResetLink('Try again'));
      cleanupEventListeners();
    });
  }
};

const createBoxes = () => {
  const boxWrapper = document.querySelector(".box-wrapper"); ``
  for (let i = 0; i < gameMode; i++) {
    const div = document.createElement("div");
    div.classList.add("box");
    div.setAttribute("style", `background-color: rgb(${colorsArray[i]});`);
    div.addEventListener("click", boxClickHandler, false);
    boxWrapper.appendChild(div);
  }
};

const cleanupEventListeners = () => {
  const boxes = document.querySelectorAll(".box-wrapper > .box");
  boxes.forEach((box) => box.removeEventListener("click", boxClickHandler));
};

const reset = () => {
  cleanupEventListeners();
  deleteBoxes();
  attempts = calcAttempts();
  colorsArray = randColors(gameMode);
  selectedColor = randPickColor(colorsArray);
  document.getElementById("display-color").textContent = selectedColor;
  document
    .querySelector("header")
    .removeAttribute("style");
  document.getElementById("controls").style.backgroundColor = "#0000ff";
  document.querySelector("#controls > .message").textContent =
    `You have ${attempts} ${attempts >= 2 ? 'clicks' : 'click'} remaining.`;
}

const init = () => {
  reset();
  createBoxes();
  setGameModes();
};

init();

window.onbeforeunload = cleanupEventListeners;
