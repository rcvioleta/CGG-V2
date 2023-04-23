!(() => {
  const randColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `${r}, ${g}, ${b}`;
  };

  const randColors = (num: number): string[] => {
    return new Array(num).fill("").map(() => randColor());
  };

  const randPickColor = (colorArr: string[]): string =>
    colorArr[Math.floor(Math.random() * colorArr.length)];

  enum GameModes {
    EASY = 4,
    MEDIUM = 6,
    HARD = 8,
  }

  let gameMode = GameModes.EASY;
  let attempts = calcAttempts();
  let colorsArray: string[], selectedColor: string;

  const modesEl = document.querySelectorAll(".modes > ul > li")!;
  const controlsEl = document.getElementById("controls")!;
  const messageEl = document.querySelector("#controls > .message")!;
  const resetEl = document.getElementById("reset")!;

  const deleteBoxes = (): void => {
    document.querySelectorAll(".box-wrapper > .box").forEach((box) => {
      if (box.parentNode instanceof Node) {
        box.parentNode.removeChild(box);
        return;
      }
      throw Error("Unable to delete the box!");
    });
  };

  function calcAttempts(): number {
    return Math.ceil(gameMode / 2);
  }

  const setGameModes = (): void => {
    for (let i = 0; i < modesEl.length; i++) {
      modesEl[i].addEventListener("click", (evt) => {
        const el = evt.target as HTMLElement;
        const children = Array.from(el.parentNode!.children) as HTMLElement[];
        for (let menu of children) {
          menu.classList.remove("active");
        }
        el.classList.add("active");
        const selMode = el.textContent
          ?.trim()
          .toUpperCase() as keyof typeof GameModes;
        const keys = Object.keys(GameModes);

        if (!keys.includes(selMode)) window.location.reload();
        if (GameModes[selMode] === gameMode) return;

        gameMode = GameModes[selMode];
        init();
      });
    }
  };

  const createAnchorElement = (text: string): HTMLAnchorElement => {
    const anchorTag = document.createElement("a");
    anchorTag.textContent = text;
    anchorTag.href = "";
    anchorTag.onclick = (e) => {
      e.preventDefault();
      init();
    };
    return anchorTag;
  };

  const boxClickHandler = (evt: MouseEvent): void => {
    const el = evt.target as HTMLElement;
    const boxClicked: string | null = el.style.backgroundColor
      ? el.style.backgroundColor.match(/(\d+)([\d\s\,]+)/gim)?.[0] ?? null
      : null;
    const boxes = document.querySelectorAll(".box-wrapper > .box");

    if (boxClicked === selectedColor) {
      document
        .querySelector("header")!
        .setAttribute("style", `background-color: rgb(${selectedColor});`);
      boxes.forEach((box) => {
        box.setAttribute("style", `background-color: rgb(${selectedColor});`);
        box.textContent = "";
      });
      controlsEl.style.backgroundColor = "#008000";
      messageEl.textContent = "Congrats, you win! ";
      messageEl.appendChild(createAnchorElement("New game"));
      disposeEventListeners();
      return;
    }

    attempts--;
    el.textContent = "X";
    el.classList.add("incorrect");
    el.setAttribute(
      "style",
      `${el.getAttribute("style")}; border: 5px solid #ff0000;`
    );
    messageEl.textContent = `You have ${attempts} ${
      attempts >= 2 ? "clicks" : "click"
    } remaining.`;

    if (attempts <= 0) {
      boxes.forEach((box) => {
        if (!box.classList.contains("incorrect")) {
          box.classList.add("incorrect");
        }
        box.textContent = "X";
        box.setAttribute(
          "style",
          "color: #000; background-color: #ff0000; border: 5px solid #000;"
        );
        controlsEl.style.backgroundColor = "#ff0000";
        messageEl.textContent = "You lose! ";
        messageEl.appendChild(createAnchorElement("Try again"));
        disposeEventListeners();
      });
    }
  };

  const createBoxes = (numBoxes: number) => {
    const boxWrapper = document.querySelector(".box-wrapper")!;
    for (let i = 0; i < numBoxes; i++) {
      const div = document.createElement("div");
      div.classList.add("box");
      div.setAttribute("style", `background-color: rgb(${colorsArray[i]});`);
      div.addEventListener("click", boxClickHandler as EventListener);
      boxWrapper.appendChild(div);
    }
  };

  const disposeEventListeners = () => {
    // remove event listeners for boxes
    document.querySelectorAll(".box-wrapper > .box").forEach((box) => {
      box.removeEventListener("click", boxClickHandler as EventListener);
    });
  };

  const reset = () => {
    disposeEventListeners();
    deleteBoxes();
    attempts = calcAttempts();
    colorsArray = randColors(gameMode);
    selectedColor = randPickColor(colorsArray);
    document.getElementById("display-color")!.textContent = selectedColor;
    document.querySelector("header")!.removeAttribute("style");
    controlsEl.style.backgroundColor = "#0000ff";
    messageEl.textContent = `You have ${attempts} ${
      attempts >= 2 ? "clicks" : "click"
    } remaining.`;
  };

  const init = () => {
    reset();
    createBoxes(gameMode);
    setGameModes();
  };

  init();

  resetEl.addEventListener("click", (evt: MouseEvent): void => {
    evt.preventDefault();
    init();
  });

  window.onbeforeunload = disposeEventListeners;

  return undefined;
})();
