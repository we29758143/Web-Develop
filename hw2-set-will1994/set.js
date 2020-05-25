/*
 * Name: KuanHsun Lu
 * Date: October 15, 2019
 * Section: CSE154 AH, Valerie
 *
 * This is .js file. In partA, toggle the menu-view and game-view by clicking start-button
 * and back-button. Further implementation will be done in partB.
 */

"use strict";

// Required module globals
let timerId;
let remainingSeconds;

// Optional module global
let totalCards;

(function() {
  window.addEventListener("load", init);

  /**
   * Sets up event listeners for the adding items button.
   */
  function init() {
    let strBtn = id("start-btn");
    strBtn.addEventListener("click", function() {
      toggleView();
      startTimer();
      level();
    });

    let refBtn = id("refresh-btn");
    refBtn.addEventListener("click", function() {
      id("board").innerHTML = '';
      level();
    });

    let backBtn = id("back-btn");
    backBtn.addEventListener("click", function() {
      toggleView();
      clearInterval(timerId);
      setZero();
      id("board").innerHTML = '';
      refBtn.disabled = false;
    });
  }

  /**
   * Call by init(), will set "Sets Found" to 0 when click "start buttom"
   */
  function setZero() {
    let cou = id("set-count");
    cou.innerText = 0;
  }

  /**
   * Call by init(), fetch the difficulty of selected level and generate
   * the corresponding card numbers and style. Create a set which add all
   * the existing card in "board". Make sure it will not generate duplicate
   * cards.
   */
  function level() {
    let isEasy;
    let diff = qs('input[name = "diff"]:checked').value;
    if (diff === "easy") {
      totalCards = 9;
      isEasy = true;
    } else {
      totalCards = 12;
      isEasy = false;
    }
    for (let i = 0; i < totalCards; i++) {
      let card = generateUniqueCard(isEasy);
      id("board").appendChild(card);
    }
  }

  /**
   * While click the start button or go back button, toggle the view to
   * menu mode or game mode
   */
  function toggleView() {
    let game = document.getElementById("game-view");
    let menu = document.getElementById("menu-view");

    game.classList.toggle("hidden");
    menu.classList.toggle("hidden");
  }

  /**
   * Returns an array with four attributes, with the order of style,
   * color, shape, count.
   * @param {boolean} isEasy - Determine the difficulty of the game.
   * @returns {array} - Array with four attributes [style, color, shape, count]
   */
  function generateRandomAttributes(isEasy) {
    let result = new Array(4);

    let style = ["solid", "outline", "striped"];
    let color = ["green", "purple", "red"];
    let shape = ["diamond", "oval", "squiggle"];
    let count = ["1", "2", "3"];

    let indexStyle = Math.floor(Math.random() * style.length);
    let indexColor = Math.floor(Math.random() * color.length);
    let indexShape = Math.floor(Math.random() * shape.length);
    let indexCount = Math.floor(Math.random() * count.length);

    result[0] = style[indexStyle];
    result[1] = shape[indexShape];
    result[2] = color[indexColor];
    result[3] = count[indexCount];

    if (isEasy === true) {
      result[0] = "solid";
    }
    return result;
  }

  /**
   * Return a set of cardID which is in the "board".
   * @return {set} set of card id.
   */
  function countSet() {
    let set = new Set();
    for (let i = 0; i < qsa(".card").length; i++) {
      set.add(qsa(".card")[i].id);
    }
    return set;
  }

  /**
   * Return generateRandomAttributes function to decide what attribute to generate
   * @param {boolean} isEasy true if easy, false if standard.
   * @returns {array} - An array with four attributes.
   */
  function cardLevel(isEasy) {
    if (isEasy === true) {
      return generateRandomAttributes(true);
    } else {
      return generateRandomAttributes(false);
    }
  }

  /**
   * Return a div element with COUNT number of img elements appended as children
   * @param {boolean} isEasy - Determine the difficulty of the game.
   * @returns {object} - An object with id, attributes, img
   */
  function generateUniqueCard(isEasy) {
    let j = 1;
    let set = countSet();
    while (j === 1) {
      let attribute = cardLevel(isEasy);
      let style = attribute[0];
      let shape = attribute[1];
      let color = attribute[2];
      let count = attribute[3];
      let CARD_IMG = style + "-" + shape + "-" + color;
      let card = document.createElement("div");
      card.id = CARD_IMG + "-" + count;
      card.classList.add("card");
      let img = document.createElement("img");
      img.src = "img/" + CARD_IMG + ".png";
      img.alt = CARD_IMG + "-" + count;
      for (let i = 0; i < count; i++) {
        card.appendChild(img.cloneNode());
      }
      if (!set.has(card.id)) {
        j--;
        card.addEventListener("click", cardSelected);
        return card;
      }
    }
  }

  /**
   * Read the timing option variable, set it to global variable "remainingSeconds"
   * parse the remainingSeconds to time format XX:XX, then call advanceTimer every
   * second.
   */
  function startTimer() {
    let e = id("menu-view").getElementsByTagName("select")[0];
    let duration = e[e.selectedIndex].value;
    remainingSeconds = duration;

    let minutes = parseInt(duration / 60);
    let seconds = parseInt(duration % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let display = id("time");
    display.innerText = minutes + ":" + seconds;

    timerId = setInterval(advanceTimer, 1000);
  }

  /**
   * Will subtract remainingSeconds every call by startTimer, which is every second,
   * also parse the time into format XX:XX. if remainingSeconds is smaller than 0,
   * stop the timer, disabled the Refresh button and disabled the cardSelected.
   */
  function advanceTimer() {
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
    } else {
      remainingSeconds--;
    }

    let timer = remainingSeconds;
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let display = id("time");
    display.textContent = minutes + ":" + seconds;

    if (remainingSeconds === 0) {
      display.textContent = "00:00";
      clearInterval(timerId);
      timerId = null;
      let reBtn = id("refresh-btn");
      reBtn.disabled = true;
      for (let i of qsa(".card")) {
        i.removeEventListener("click", cardSelected);
        i.classList.remove("selected");
      }
    }
  }

  /**
   * Will toggle while a card is selected, and create an array[3], which will store three selected
   * cards. While a set is selected, add "hide-imgs" class, which will hide the imgs in the card.
   * Pass the array to function "isASet", which will return true or false.
   * Case true: variable "countCard" + 1, create an element with p tag then append to the card,
   * set an one second time interval, then generate a new set of cards
   * Case false: variable "remainingSeconds" - 15, create an element with p tag then append to the
   * card,then remove it after a second, will not generate new set.
   */
  function cardSelected() {
    this.classList.toggle("selected");
    let arr = new Array(3);
    let j = 0;
    if (qsa(".selected").length === 3) {
      for (let i of qsa(".selected")) {
        arr[j++] = i;
        i.classList.add("hide-imgs");
      }
      if (isASet(arr)) {
        let cou = id("set-count");
        cou.innerText++;
        isSet();
      } else {
        if (remainingSeconds < 15) {
          for (let i of qsa(".card")) {
            i.removeEventListener("click", cardSelected);
          }
          terminate();
        } else {
          notSetHandleTime();
        }
        notSet();
      }
    }
  }

  /**
   * Will terminate the game while remainingSeconds < 15.
   */
  function terminate() {
    let display = id("time");
    display.textContent = "00:00";
    clearInterval(timerId);
    timerId = null;
    let reBtn = id("refresh-btn");
    reBtn.disabled = true;
  }

  /**
   * Helper for handle time display while card is not a set.
   */
  function notSetHandleTime() {
    remainingSeconds -= 15;
    let minutes = parseInt(remainingSeconds / 60, 10);
    let seconds = parseInt(remainingSeconds % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let display = id("time");
    display.textContent = minutes + ":" + seconds;
  }

  /**
   * Helper for cardSelected while is a set
   */
  function isSet() {
    let isEasy = gameLevel();
    for (let i of qsa(".selected")) {
      let set = pTag("SET!");
      i.appendChild(set);
      i.classList.remove("selected");
      setTimeout(function() {
        let card = generateUniqueCard(isEasy);
        id("board").replaceChild(card, i);
      }, 1000);
    }
  }

  /**
   * Helper for cardSelected while is not a set
   */
  function notSet() {
    for (let i of qsa(".selected")) {
      let set = pTag("Not a Set :(");
      i.appendChild(set);
      i.classList.remove("selected");
      setTimeout(function() {
        i.classList.remove("hide-imgs");
        i.removeChild(set);
      }, 1000);
    }
  }

  /**
   * Helper for cardSelected while creating a p tag element
   * @param {string} string innertext in p tag
   * @return {object} an p tag element
   */
  function pTag(string) {
    let set = document.createElement("p");
    set.innerText = string;
    return set;
  }

  /**
   * Helper for cardSelected while setting game level.
   * @return {boolean} True if easy mode, false if standard mode.
   */
  function gameLevel() {
    let isEasy;
    if (totalCards === 9) {
      isEasy = true;
    } else {
      isEasy = false;
    }
    return isEasy;
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - List of all selected cards to check if a set.
   * @return {boolean} True if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let allSame = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      let allDiff = attributes[0][i] !== attributes[1][i] &&
                    attributes[1][i] !== attributes[2][i] &&
                    attributes[0][i] !== attributes[2][i];
      if (!(allDiff || allSame)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} - The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

})();
