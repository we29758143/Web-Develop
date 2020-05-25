/*
 * Name: KuanHsun Lu
 * Date: October 26, 2019
 * Section: CSE 154 AH
 * This is the JS to fetch api, will give error message if fail to fetch. If success, will read the
 * value from user input and give the number to topics in the webpage. The topics information
 * includes title, description, news url and picture.
 */

"use strict";

let guid;
let pid;

(function() {
  window.addEventListener("load", init);
  let urlName = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/" +
                "pokedex.php?pokedex=all";
  const urlIcon = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/icons/";
  const urlImg = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/sprites/";
  const urlGame = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/game.php";
  const urlBigImg = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  let p1Curr, p2Curr;
  let p1Health, p2Health;

  /**
   * start the request for receiving all pokemon name
   */
  function init() {
    fetchNameData();
  }

  /**
   * Make request to pokemon name API
   */
  function fetchNameData() {
    let urlFetch = urlName;
    fetch(urlFetch)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(createSprite)
      .catch(console.error);
  }

  /**
   * Create every sprite by reading names, and call "fetchSpriteData" to parse data. Call
   * "spriteFound" to enable new sprites in game
   * @param {object} response - text from pokemon API
   */
  function createSprite(response) {
    let len = response.split("\n").length; // 151
    for (let i = 0; i < len; i++) {
      let oriName = response.split("\n")[i].split(":")[0]; // name
      let spriteName = response.split("\n")[i].split(":")[1]; // shortname
      if (spriteName === "bulbasaur" || spriteName === "charmander" || spriteName === "squirtle") {
        let img = getImg(spriteName, oriName);
        img.classList.add("sprite");
        img.classList.add("found");
        img.addEventListener("click", function() {
          fetchSpriteData(oriName);
        });
        id("pokedex-view").appendChild(img);
      } else {
        let img = getImg(spriteName, oriName);
        img.classList.add("sprite"); // add shadow
        id("pokedex-view").appendChild(img);
      }
    }
    spriteFound();
  }

  /**
   * Find all the sprite will class ".found" and enable these sprites to start the game
   */
  function spriteFound() {
    for (let i = 0; i < qsa(".found").length; i++) {
      qsa(".found")[i].addEventListener("click", function() {
        id("start-btn").classList.remove("hidden");
        gameStart();
      });
    }
  }

  /**
   * Add addEventListener to start button and will hide "start-btn", "pokedex-view", unhide "p2",
   * "hp-info", "results-container", "flee-btn"
   * Enable "flee-btn", all the moves button in card
   * Call fetchGame to start the game
   */
  function gameStart() {
    id("start-btn").addEventListener("click", function() {
      id("start-btn").classList.add("hidden");
      id("pokedex-view").classList.add("hidden");
      id("p2").classList.remove("hidden");
      qs(".hp-info").classList.remove("hidden");
      id("results-container").classList.remove("hidden");
      id("flee-btn").classList.remove("hidden");
      qs("header h1").innerText = "Pokemon Battle Mode!";
      fleeBtnEnable();
      removeAllChild();
      for (let i = 0; i < qsa("#p1 div.moves button").length; i++) {
        let button = qsa("#p1 div.moves button")[i];
        button.disabled = false;
      }
      fetchGame();
    });
  }

  /**
   * Add addEventListener to "flee-btn", and make sure it only calls one time, otherwise it will
   * always fetch accumulating data.
   */
  function fleeBtnEnable() {
    if (id("flee-btn").getAttribute("addClickHandleFlag") !== "1") {
      id("flee-btn").setAttribute("addClickHandleFlag", "1");
      id("flee-btn").addEventListener('click', function() {
        fetchPlayMove("flee");
      });
    }
  }

  /**
   * Make post request to gaming API, two key-value pairs "startgame" and "mypokemon"
   */
  function fetchGame() {
    let data = new FormData();
    data.append("startgame", true);
    data.append("mypokemon", qs("#p1 h2.name").innerText);
    fetch(urlGame, {method: "POST", body: data})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(store)
      .catch(console.error);
  }

  /**
   * Retrieve guid and pid data, parse "p2" data and remove "buffs" div
   * Call "moveName" "function
   * @param {object} data - JSON object from gaming API
   */
  function store(data) {
    guid = data["guid"];
    pid = data["pid"];
    parseData(data["p2"], "#p2");
    qs("#p1 div.buffs").classList.remove("hidden");
    moveName();
  }

  /**
   * Create a "img" object with corresponding name
   * @param {string} shortName sprites shortname
   * @param {string} oriName sprites original name
   * @return {object} - "img" with sprites
   */
  function getImg(shortName, oriName) {
    let name = shortName;
    let img = document.createElement("img");
    img.src = urlImg + name + ".png";
    img.alt = oriName;
    return img;
  }

  /**
   * Make get request from pokemon data API.
   * @param {string} oriName sprites original name
   */
  function fetchSpriteData(oriName) {
    let urlData = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex." +
    "php?pokemon=";
    let urlFetch = urlData + oriName;
    fetch(urlFetch)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(function(resp) {
        return parseData(resp, "#p1");
      })
      .catch(console.error);
  }

  /**
   * Add addEventListener to "p1" moves button
   */
  function moveName() {
    for (let i = 0; i < qsa("#p1 div.moves button").length; i++) {
      let move = qsa("#p1 div.moves button")[i];
      move.addEventListener("click", fetchPlayMove);
    }
  }

  /**
   * Make post request to pokemon game API, receive the results from API
   * @param {string} movement moves name by "p1" sprite
   */
  function fetchPlayMove(movement) {
    removeAllChild();
    id("loading").classList.remove("hidden");
    id("p1-turn-results").classList.add("hidden");
    id("p2-turn-results").classList.add("hidden");
    let move;
    if (movement === "flee") {
      move = movement;
    } else {
      console.log(this);
      move = this.getElementsByTagName("span")[0].innerText;
    }
    let data = new FormData();
    data.append("guid", guid);
    data.append("pid", pid);
    data.append("movename", move);
    fetch(urlGame, {method: "POST", body: data})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(gamePlay)
      .catch(console.error);
  }

  /**
   * Parse result data into "turn-results" and update HP condition
   * @param {object} data JSON object from gaming API
   */
  function gamePlay(data) {
    id("loading").classList.add("hidden");
    id("p1-turn-results").classList.remove("hidden");
    id("p2-turn-results").classList.remove("hidden");
    buffing(data);
    if (data["results"]["p1-move"] === null) {
      id("p1-turn-results").innerText = "";
    } else {
      id("p1-turn-results").innerText = "Player 1 played " + data["results"]["p1-move"] + " and " +
      data["results"]["p1-result"];
    }
    if (data["results"]["p2-move"] === null) {
      id("p2-turn-results").innerText = "";
    } else {
      id("p2-turn-results").innerText = "Player 2 played " + data["results"]["p2-move"] + " and " +
      data["results"]["p2-result"];
    }
    let p1Damage, p2Damage;
    p1Damage = p1DamageHelper(data);
    p2Damage = p2DamageHelper(data);
    if (data["results"]["p1-move"] === "flee") {
      p2Damage = p1Curr;
      loseHealth(p1Damage, p2Damage);
    } else {
      loseHealth(p1Damage, p2Damage);
    }
    zeroHP();
  }

  /**
   * While HP is lower than 0, set it to zero, otherwise keeping subtracking health
   */
  function zeroHP() {
    if (p1Curr <= 0) {
      qs("#p1 span.hp").innerText = "0HP";
    } else {
      qs("#p1 span.hp").innerText = p1Curr + "HP";
    }
    if (p2Curr <= 0) {
      qs("#p2 span.hp").innerText = "0HP";
    } else {
      qs("#p2 span.hp").innerText = p2Curr + "HP";
    }
  }

  /**
   * Record p1 movement and update damage madeI
   * @param {object} data JSON object from gaming API
   * @return {integer} update p1Damage
   */
  function p1DamageHelper(data) {
    let p1Damage;
    if (data["results"]["p1-result"] === "hit") {
      let len = data["p1"]["moves"].length;
      for (let i = 0; i < len; i++) {
        if (data["p1"]["moves"][i]["name"] === data["results"]["p1-move"]) {
          if (data["p1"]["moves"][i]["dp"] === undefined) {
            p1Damage = 0;
          } else {
            p1Damage = data["p1"]["moves"][i]["dp"];
          }
        }
      }
    } else {
      p1Damage = 0;
    }
    return p1Damage;
  }

  /**
   * Record p2 movement and update damage madeI
   * @param {object} data JSON object from gaming API
   * @return {integer} update p1Damage
   */
  function p2DamageHelper(data) {
    let p2Damage;
    if (data["results"]["p2-result"] === "hit") {
      let len = data["p2"]["moves"].length;
      for (let i = 0; i < len; i++) {
        if (data["p2"]["moves"][i]["name"] === data["results"]["p2-move"]) {
          if (data["p2"]["moves"][i]["dp"] === undefined) {
            p2Damage = 0;
          } else {
            p2Damage = data["p2"]["moves"][i]["dp"];
          }
        }
      }
    } else {
      p2Damage = 0;
    }
    return p2Damage;
  }

  /**
   * Adding buffs data from game API
   * @param {object} data JSON object from game API
   */
  function buffing(data) {
    let p1Buff = data["p1"]["buffs"];
    let p2Buff = data["p2"]["buffs"];
    let p1Debuff = data["p1"]["debuffs"];
    let p2Debuff = data["p2"]["debuffs"];

    if (p1Buff.length !== 0) {
      buffingHelper(p1Buff, "buff", "#p1");
    }
    if (p2Buff.length !== 0) {
      buffingHelper(p2Buff, "buff", "#p2");
    }
    if (p1Debuff.length !== 0) {
      buffingHelper(p1Debuff, "debuff", "#p1");
    }
    if (p2Debuff.length !== 0) {
      buffingHelper(p2Debuff, "debuff", "#p2");
    }
  }

  /**
   * Remove all the child in "buffs" when new move "clicked"
   */
  function removeAllChild() {
    let child1 = qsa("#p1 div.buffs div").length;
    let child2 = qsa("#p2 div.buffs div").length;

    if (child1 !== 0) {
      for (let i = 0; i < child1; i++) {
        let div = qsa("#p1 div.buffs div")[0];
        div.parentNode.removeChild(div);
      }
    }

    if (child2 !== 0) {
      for (let i = 0; i < child2; i++) {
        let div = qsa("#p2 div.buffs div")[0];
        div.parentNode.removeChild(div);
      }
    }
  }

  /**
   * A helper function for "buffs" adding the corresponding buffs from API
   * @param {Array} array An array of Buffs
   * @param {string} type buffs or debuffs
   * @param {string} card p1 or p2
   */
  function buffingHelper(array, type, card) {
    for (let i = 0; i < array.length; i++) {

      if (array[i] === "attack") {
        let img = document.createElement("div");
        img.classList.add(type, "attack");
        qs(card + " div.buffs").appendChild(img);
      } else if (array[i] === "defense") {
        let img = document.createElement("div");
        img.classList.add(type, "defense");
        qs(card + " div.buffs").appendChild(img);
      } else if (array[i] === "accuracy") {
        let img = document.createElement("div");
        img.classList.add(type, "accuracy");
        qs(card + " div.buffs").appendChild(img);
      }
    }
  }

  /**
   * Update two players health condition when moves clicked
   * @param {Integer} p1Damage Damage made from p1 player
   * @param {Integer} p2Damage Damage made from p2 player
   */
  function loseHealth(p1Damage, p2Damage) {
    let p1Hp = p1Health.slice(0, -2);
    let p2Hp = p2Health.slice(0, -2);
    p1Curr = p1Curr - p2Damage;
    p2Curr = p2Curr - p1Damage;
    if (p1Curr / p1Hp <= 0) {
      endGame("lose");
      qs("header h1").innerText = "You lost!";
      qs("#p1 div.health-bar").classList.add("low-health");
      qs("#p1 div.health-bar").style.width = "0px";
    } else if (p1Curr / p1Hp < 0.2) {
      qs("#p1 div.health-bar").classList.add("low-health");
      qs("#p1 div.health-bar").style.width = (p1Curr / p1Hp) * 100 + "%";
    } else {
      qs("#p1 div.health-bar").style.width = (p1Curr / p1Hp) * 100 + "%";
    }
    if (p2Curr / p2Hp <= 0) {
      endGame("win");
      qs("header h1").innerText = "You won!";
      qs("#p2 div.health-bar").classList.add("low-health");
      qs("#p2 div.health-bar").style.width = "0px";
    } else if (p2Curr / p2Hp < 0.2) {
      qs("#p2 div.health-bar").classList.add("low-health");
      qs("#p2 div.health-bar").style.width = (p2Curr / p2Hp) * 100 + "%";
    } else {
      qs("#p2 div.health-bar").style.width = (p2Curr / p2Hp) * 100 + "%";
    }
  }

  /**
   * When flee or one of the player lose the game, call this function
   * Didabled the moves button, hide flee button, unhide endgame button
   * Add eventListener to "endgame" button
   * @param {string} result win or lose
   */
  function endGame(result) {
    id("flee-btn").classList.add("hidden");
    id("endgame").classList.remove("hidden");
    let len = qsa("#p1 div.moves button").length;
    for (let i = 0; i < len; i++) {
      qsa("#p1 div.moves button")[i].disabled = true;
    }
    if (result === "win") {
      for (let i = 0; i < qsa("#pokedex-view img").length; i++) {
        let img = qsa("#pokedex-view img")[i];
        if (img.alt === qs("#p2 h2.name").innerText) {
          img.classList.add("found");
          img.addEventListener("click", function() {
            fetchSpriteData(img.alt);
          });
        }
      }
    }
    id("endgame").addEventListener("click", function() {
      reset();
    });
  }

  /**
   * Reset everything while clicked the endgame button.
   */
  function reset() {
    id("endgame").classList.add("hidden");
    id().classList.add("hidden");
    id("results-container").classList.add("hidden");
    qs("#p1 .hp-info").classList.add("hidden");
    qs("#p1 div.buffs").classList.add("hidden");
    id("start-btn").classList.remove("hidden");
    qs("header h1").innerText = "Your Pokedex";
    qs("#p1 div.health-bar").style.width = "100%";
    qs("#p2 div.health-bar").style.width = "100%";
    id("pokedex-view").classList.remove("hidden");
    qs("#p1 div.health-bar").classList.remove("low-health");
    qs("#p2 div.health-bar").classList.remove("low-health");
    id("p1-turn-results").innerText = "";
    id("p2-turn-results").innerText = "";
    qs("#p1 span.hp").innerText = p1Health;
    qs("#p2 span.hp").innerText = p2Health;
    p1Curr = p1Health.slice(0, -2);
    p2Curr = p2Health.slice(0, -2);
  }

  /**
   * Parse stripes data into card format
   * @param {object} data JSON obect from pokemon dataAPI
   * @param {string} card p1 or p2
   */
  function parseData(data, card) {
    let name = qs(card + " h2.name");
    name.innerText = data["name"];
    let hp = qs(card + " span.hp");
    hp.innerText = data["hp"] + "HP";
    if (card === "#p1") {
      p1Curr = data["hp"];
      p1Health = data["hp"] + "HP";
    } else {
      p2Curr = data["hp"];
      p2Health = data["hp"] + "HP";
    }
    let des = qs(card + " p.info");
    des.innerText = data["info"]["description"];
    let type = qs(card + " img.type");
    type.src = urlIcon + data["info"]["type"] + ".jpg";
    type.alt = data["info"]["type"];
    let weak = qs(card + " img.weakness");
    weak.src = urlIcon + data["info"]["weakness"] + ".jpg";
    weak.alt = data["info"]["weakness"];
    let pic = qs(card + " img.pokepic");
    pic.src = urlBigImg + data["images"]["photo"];
    pic.alt = data["name"];
    parseDataHelper(data, card);
  }

  /**
   * A helper function for parseData, deal with moves button
   * @param {object} data JSON obect from pokemon dataAPI
   * @param {string} card p1 or p2
   */
  function parseDataHelper(data, card) {
    let move = qsa(card + " span.move");
    let dp = qsa(card + " span.dp");
    let movesType = qsa(card + " button img");

    for (let i = 0; i < 4; i++) {
      move[i].parentNode.classList.remove("hidden");
      dp[i].innerText = "";
    }
    for (let i = 0; i < 4; i++) {
      if (data["moves"][i] === undefined) {
        move[i].parentNode.classList.add("hidden");
      } else {
        movesType[i].src = urlIcon + data["moves"][i]["type"] + ".jpg";
        move[i].innerText = data["moves"][i]["name"];
        if (data["moves"][i]["dp"] === undefined) {
          dp[i].innerText = "";
        } else {
          dp[i].innerText = data["moves"][i]["dp"] + "DP";
        }
      }
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID
   * @returns {object} DOM object associated with id.
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

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response; // a Response object
  }

})();
