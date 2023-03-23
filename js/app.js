const pipe = (...fns) => val => fns.reduce((nv, fn) => fn(nv), val)

const randColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `${r}, ${g}, ${b}`;
}

const randColors = function (num) {
  return new Array(num).fill('').map(() => randColor())
}

const randPickColor = colorArr => colorArr[Math.floor(Math.random() * colorArr.length)];

const gameModeObj = {
  easy: 4,
  medium: 6,
  hard: 8,
};
const DEFAULT_GAME_MODE = gameModeObj.medium;
let gameMode = DEFAULT_GAME_MODE;

const colorsArray = randColors(gameMode);
const SELECTED_COLOR = randPickColor(colorsArray);

console.log(colorsArray)
console.log(SELECTED_COLOR)

// document.getElementById('display-color').textContent = SELECTED_COLOR;

// const gameModesEl = document.querySelectorAll('.modes > ul > li');

// for (let i = 0; i < gameModesEl.length; i++) {
//   gameModesEl[i].addEventListener('click', function (evt) {
//     const userSelectedMode = evt.target.textContent.trim().toLowerCase();

//     if (!Object.keys(gameModeObj).includes(userSelectedMode)) {
//       return;
//     }

//     gameMode = gameModeObj[userSelectedMode];
//   });
// }

const boxes = document.querySelectorAll('.box-wrapper > .box');

const boxClickHandler = evt => {
  const el = evt.target;
  const userSelectedColor = el.style.backgroundColor.match(/(\d+)([\d\s\,]+)/gim)[0];
  if (userSelectedColor === SELECTED_COLOR) {
    document.querySelector('header').setAttribute('style', `background-color: rgb(${SELECTED_COLOR});`);
    document.querySelectorAll('.box-wrapper > .box').forEach(box => {
      box.setAttribute('style', `background-color: rgb(${SELECTED_COLOR});`)
      box.textContent = '';
    });
    return alert("Congrats, you win!");
  }
  el.textContent = "X";
  el.setAttribute('style', 'background-color: red;');
}

const init = () => {
  // display the boxes according to the game mode
  document.getElementById('display-color').textContent = SELECTED_COLOR;

  const boxWrapper = document.querySelector('.box-wrapper')
  for (let i = 0; i < gameMode; i++) {
    const div = document.createElement('div');
    div.classList.add('box');
    div.setAttribute('style', `background-color: rgb(${colorsArray[i]});`)
    div.addEventListener('click', boxClickHandler, false);
    boxWrapper.appendChild(div);
  };
}

init();

window.onbeforeunload = () => {
  // remove event listeners here
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].removeEventListener('click', boxClickHandler);
  };
}