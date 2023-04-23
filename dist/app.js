"use strict";
!(() => {
    const randColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `${r}, ${g}, ${b}`;
    };
    const randColors = (num) => {
        return new Array(num).fill("").map(() => randColor());
    };
    const randPickColor = (colorArr) => colorArr[Math.floor(Math.random() * colorArr.length)];
    let GameModes;
    (function (GameModes) {
        GameModes[GameModes["EASY"] = 4] = "EASY";
        GameModes[GameModes["MEDIUM"] = 6] = "MEDIUM";
        GameModes[GameModes["HARD"] = 8] = "HARD";
    })(GameModes || (GameModes = {}));
    let gameMode = GameModes.EASY;
    let attempts = calcAttempts();
    let colorsArray, selectedColor;
    const modesEl = document.querySelectorAll(".modes > ul > li");
    const controlsEl = document.getElementById("controls");
    const messageEl = document.querySelector("#controls > .message");
    const resetEl = document.getElementById("reset");
    const deleteBoxes = () => {
        document.querySelectorAll(".box-wrapper > .box").forEach((box) => {
            if (box.parentNode instanceof Node) {
                box.parentNode.removeChild(box);
                return;
            }
            throw Error("Unable to delete the box!");
        });
    };
    function calcAttempts() {
        return Math.ceil(gameMode / 2);
    }
    const setGameModes = () => {
        for (let i = 0; i < modesEl.length; i++) {
            modesEl[i].addEventListener("click", (evt) => {
                var _a;
                const el = evt.target;
                const children = Array.from(el.parentNode.children);
                for (let menu of children) {
                    menu.classList.remove("active");
                }
                el.classList.add("active");
                const selMode = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim().toUpperCase();
                const keys = Object.keys(GameModes);
                if (!keys.includes(selMode))
                    window.location.reload();
                if (GameModes[selMode] === gameMode)
                    return;
                gameMode = GameModes[selMode];
                init();
            });
        }
    };
    const createAnchorElement = (text) => {
        const anchorTag = document.createElement("a");
        anchorTag.textContent = text;
        anchorTag.href = "";
        anchorTag.onclick = (e) => {
            e.preventDefault();
            init();
        };
        return anchorTag;
    };
    const boxClickHandler = (evt) => {
        var _a, _b;
        const el = evt.target;
        const boxClicked = el.style.backgroundColor
            ? (_b = (_a = el.style.backgroundColor.match(/(\d+)([\d\s\,]+)/gim)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null
            : null;
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
            messageEl.appendChild(createAnchorElement("New game"));
            disposeEventListeners();
            return;
        }
        attempts--;
        el.textContent = "X";
        el.classList.add("incorrect");
        el.setAttribute("style", `${el.getAttribute("style")}; border: 5px solid #ff0000;`);
        messageEl.textContent = `You have ${attempts} ${attempts >= 2 ? "clicks" : "click"} remaining.`;
        if (attempts <= 0) {
            boxes.forEach((box) => {
                if (!box.classList.contains("incorrect")) {
                    box.classList.add("incorrect");
                }
                box.textContent = "X";
                box.setAttribute("style", "color: #000; background-color: #ff0000; border: 5px solid #000;");
                controlsEl.style.backgroundColor = "#ff0000";
                messageEl.textContent = "You lose! ";
                messageEl.appendChild(createAnchorElement("Try again"));
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
            div.addEventListener("click", boxClickHandler);
            boxWrapper.appendChild(div);
        }
    };
    const disposeEventListeners = () => {
        document.querySelectorAll(".box-wrapper > .box").forEach((box) => {
            box.removeEventListener("click", boxClickHandler);
        });
    };
    const reset = () => {
        disposeEventListeners();
        deleteBoxes();
        attempts = calcAttempts();
        colorsArray = randColors(gameMode);
        selectedColor = randPickColor(colorsArray);
        document.getElementById("display-color").textContent = selectedColor;
        document.querySelector("header").removeAttribute("style");
        controlsEl.style.backgroundColor = "#0000ff";
        messageEl.textContent = `You have ${attempts} ${attempts >= 2 ? "clicks" : "click"} remaining.`;
    };
    const init = () => {
        reset();
        createBoxes(gameMode);
        setGameModes();
    };
    init();
    resetEl.addEventListener("click", (evt) => {
        evt.preventDefault();
        init();
    });
    window.onbeforeunload = disposeEventListeners;
    return undefined;
})();
