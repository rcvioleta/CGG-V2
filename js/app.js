!(() => {
  const randColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `${r}, ${g}, ${b}`;
  };

  const randColors = num => new Array(num).fill("").map(() => randColor());

  const randPickColor = (colorArr) =>
    colorArr[Math.floor(Math.random() * colorArr.length)];

  const modes = {
    easy: 4,
    medium: 6,
    hard: 8,
  };
  let gameMode = modes.easy;
  let attempts = calcAttempts();
  let colorsArray, selectedColor = undefined;

  const modesEl = document.querySelectorAll(".modes > ul > li");
  const controlsEl = document.getElementById("controls");
  const messageEl = document.querySelector("#controls > .message");
  const resetEl = document.getElementById('reset');

  const deleteBoxes = () => {
    document.querySelectorAll(".box-wrapper > .box").forEach((box) => {
      box.parentNode.removeChild(box)
    });
  };

  function calcAttempts() {
    return Math.ceil(gameMode / 2);
  }

  const setGameModes = () => {
    for (let i = 0; i < modesEl.length; i++) {
      modesEl[i].addEventListener("click", (evt) => {
        const el = evt.target;
        for (let menu of el.parentNode.children) {
          menu.classList.remove("active");
        }
        el.classList.add("active");
        const selMode = el.textContent.trim().toLowerCase();
        const keys = Object.keys(modes);

        if (!keys.includes(selMode)) window.location.reload();
        if (modes[selMode] === gameMode) return

        gameMode = modes[selMode];
        init();
      });
    }
  };

  const createElWithText = (text) => {
    const anchorTag = document.createElement('a');
    anchorTag.textContent = text;
    anchorTag.href = '';
    anchorTag.onclick = e => {
      e.preventDefault();
      init();
    }
    return anchorTag;
  }

  const boxClickHandler = (evt) => {
    const el = evt.target;
    const boxClicked =
      el.style.backgroundColor.match(/(\d+)([\d\s\,]+)/gim)[0];
    const boxes = document.querySelectorAll(".box-wrapper > .box");

    if (boxClicked === selectedColor) {
      document
        .querySelector("header")
        .setAttribute("style", `background-color: rgb(${selectedColor});`);
      boxes.forEach((box) => {
        box.setAttribute("style", `background-color: rgb(${selectedColor});`);
        box.textContent = "";
      });
      controlsEl.style.backgroundColor = "#008000";
      messageEl.textContent = "Congrats, you win! ";
      messageEl.appendChild(createElWithText('New game'))
      disposeEventListeners();
      return
    }

    attempts--;
    el.textContent = "X";
    el.classList.add('incorrect');
    el.setAttribute("style", `${el.getAttribute("style")}; border: 5px solid #ff0000;`);
    messageEl.textContent = `You have ${attempts} ${attempts >= 2 ? 'clicks' : 'click'} remaining.`;

    if (attempts <= 0) {
      boxes.forEach((box) => {
        if (!box.classList.contains('incorrect')) {
          box.classList.add('incorrect')
        }
        box.textContent = "X"
        box.setAttribute("style", 'color: #000; background-color: #ff0000; border: 5px solid #000;');
        controlsEl.style.backgroundColor = "#ff0000";
        messageEl.textContent = 'You lose! ';
        messageEl.appendChild(createElWithText('Try again'));
        disposeEventListeners();
      });
    }
  };

  const createBoxes = (numBoxes) => {
    const boxWrapper = document.querySelector(".box-wrapper");
    for (let i = 0; i < numBoxes; i++) {
      const div = document.createElement("div");
      div.classList.add("box");
      div.setAttribute("style", `background-color: rgb(${colorsArray[i]});`);
      div.addEventListener("click", boxClickHandler, false);
      boxWrapper.appendChild(div);
    }
  };

  const disposeEventListeners = () => {
    // remove event listeners for boxes
    document.querySelectorAll(".box-wrapper > .box").forEach((box) => {
      box.removeEventListener("click", boxClickHandler)
    });
  };

  const reset = () => {
    disposeEventListeners();
    deleteBoxes();
    attempts = calcAttempts();
    colorsArray = randColors(gameMode);
    selectedColor = randPickColor(colorsArray);
    document.getElementById("display-color").textContent = selectedColor;
    document
      .querySelector("header")
      .removeAttribute("style");
    controlsEl.style.backgroundColor = "#0000ff";
    messageEl.textContent =
      `You have ${attempts} ${attempts >= 2 ? 'clicks' : 'click'} remaining.`;
  }

  const init = () => {
    reset();
    createBoxes(gameMode);
    setGameModes();
  };

  init();

  resetEl.addEventListener('click', evt => {
    evt.preventDefault();
    init();
  });

  window.onbeforeunload = disposeEventListeners
})()