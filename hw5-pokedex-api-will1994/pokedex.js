/*
 * Name: KuanHsun Lu
 * Date: Dec 04, 2019
 * Section: CSE154 AH, Valerie
 * An API can manipulate with pokemon battle. Each end point is defined below.
 *
 * *** Endpoint Documentation ***
 * Endpoint: /credentials
 * Description: Your service should return the user's player ID (PID) and token.
 *
 * Request Type: GET
 * Response Type: JSON
 * Example Request: /credentials
 * Example Response:
 *
 * bricker
 * poketoken_123456789.987654321
 *
 * *************************************
 * Endpoint: /pokedex/list
 * Description: Your service should return a JSON response with a key "pokemon" mapping to an array
 * of all Pokemon you have found (your Pokedex table), including the name, nickname, and found date
 * /time for each Pokemon.
 *
 * Request Type: GET
 * Response Type: JSON
 * Example Request: /pokedex/list
 * Example Response:
 * {
 * "pokemon" : [
 *    {
 *      "name" : "bulbasaur",
 *      "nickname" : "Bulby",
 *      "datefound" : "2019-28-23T17:52:06.000Z"
 *    },
 *   {
 *     "name" : "charmander",
 *      "nickname" : "CHARMANDER",
 *      "datefound" : "2019-19-23T17:56:06.000Z"
 *    },
 *  ...
 *  ]
 * }
 * When output is empty: { "pokemon" : [] }
 *
 * *************************************
 * Endpoint: /pokedex/insert
 * Description: Your service should add a Pokemon to your Pokedex table, given a required name
 * parameter.
 * Request Type: POST
 * Required Parameters: name, nickname(optional paramter)
 * Response Type: JSON
 * Example Request: /pokedex/insert
 *
 * Example Response: { "success" : "<name> added to your Pokedex!" }
 * Error Handling: Responds with 400 if the required parameters are not passed, or
 *                 if there is an item in the database for the given name.
 *                 { "error" : "<name> already found." } or
 *                 { "error" : "Missing <parametername> parameter."}
 *                 Responds with 500 if the server went wrong
 *                  { "error" : "A database error occurred. Please try again later." }
 *
 * *************************************
 *
 * Endpoint: /pokedex/delete
 * Description: When passed a name, the Pokemon with the given name (case-insensitive) should be
 * removed from your Pokedex.
 * parameter.
 * Request Type: POST
 * Required Parameters: name
 * Response Type: JSON
 * Example Request: /pokedex/delete
 *
 * Example Response: { "success" : "<name> removed from your Pokedex!" }
 * Error Handling: Responds with 400 if the required parameters are not passed, or
 *                 if there is not item in the database for the given name.
 *                 { "error" : "<name> not found in your Pokedex." } or
 *                 { "error" : "Missing <parametername> parameter."}
 *                 Responds with 500 if the server went wrong
 *                  { "error" : "A database error occurred. Please try again later." }
 * *************************************
 *
 * Endpoint: /pokedex/delete/all
 * Description: Your service should remove all Pokemon that are currently in the Pokedex table.
 *
 * Request Type: POST
 * Response Type: JSON
 * Example Request: /pokedex/delete/all
 *
 * Example Response: { "success" : "All Pokemon removed from your Pokedex!" }
 * Error Handling: Responds with 500 if the server went wrong
 *                 { "error" : "A database error occurred. Please try again later." }
 * *************************************
 *
 * Endpoint: /pokedex/trade
 * Description: Your service should take a Pokemon to remove from your Pokedex mypokemon
 * (case-insensitive) and a Pokemon to add to your Pokedex theirpokemon.
 * Request Type: POST
 * Required Parameters: mypokemon, theirpokemon
 * Response Type: JSON
 * Example Request: /pokedex/trade
 *
 * Example Response: { "success" : "You have traded your <mypokemon> for <theirpokemon>!" }
 * Error Handling: Responds with 400 if the required parameters are not passed, or
 *                 if there is an item in the database for the given name.
 *                  { "error" : "You have already found <theirpokemon>." } or
 *                 { "error" : "<mypokemon> not found in your Pokedex." } or
 *                 { "error" : "Missing <parametername> parameter."}
 *                 Responds with 500 if the server went wrong
 *                  { "error" : "A database error occurred. Please try again later." }
 * *************************************
 *
 * Endpoint: /pokedex/update
 * Description: Your service should update a Pokemon in your Pokedex table with the given name
 * (case-insensitive) parameter to have the given nickname (overwriting any previous nicknames)
 * Request Type: POST
 * Required Parameters: name, nickname(optional)
 * Response Type: JSON
 * Example Request: /pokedex/update
 *
 * Example Response: { "success" : "Your <name> is now named <nickname>!" }
 * Error Handling: Responds with 400 if the required parameters are not passed, or
 *                 if there is not item in the database for the given name.
 *                 { "error" : "<name> not found in your Pokedex." } or
 *                 { "error" : "Missing <parametername> parameter."}
 *                 Responds with 500 if the server went wrong
 *                 { "error" : "A database error occurred. Please try again later." }
 */

"use strict";

const express = require("express");
const mysql = require("mysql2/promise");
const multer = require("multer");

const INVALID_PARAM_ERROR = 400;
const FILE_ERROR = 500;
const TOKEN = "will1994\npoketoken_5ddb5d869c6574.38203354";

/**
 * Establishes a database connection to the blog database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
const db = mysql.createPool({
  host: process.env.DB_URL || 'localhost',
  port: process.env.DB_PORT || '8889',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'hw5db'
});

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

// Provides paths to reach out user's information
app.get("/credentials", function(req, res) {
  res.set("Content-Type", "text/plain");
  res.send(TOKEN);
});

// Provides paths to reach out all the pokemon
app.get("/pokedex/list", async function(req, res) {
  try {
    let list = await db.query("SELECT name, nickname, datefound FROM Pokedex ORDER BY datefound;");
    res.type("json");
    res.json({"pokemon": processList(list[0])});
  } catch (err) {
    res.type("json");
    res.status(FILE_ERROR).send({"error": "A database error occurred. Please try again later."});
  }
});

// Provides a post request to insert new pokemon
app.post("/pokedex/insert", async function(req, res) {
  let name = req.body.name;
  let nickname = req.body.nickname;
  if (name === undefined) {
    res.type("json");
    res.status(INVALID_PARAM_ERROR).send({"error": "Missing name parameter."});
  }
  if (nickname === undefined) {
    nickname = name.toUpperCase();
  }
  try {
    let check = await db.query("SELECT name FROM Pokedex WHERE name = ?;", [name]);
    if (check[0].length === 0 && name !== undefined) {
      let datefound = getTime();
      let sql = "INSERT INTO Pokedex(name, nickname, datefound) VALUES (?, ?, ?);";
      await db.query(sql, [name.toLowerCase(), nickname, datefound]);
      res.type("json");
      res.send({"success": name + " added to your Pokedex!"});
    } else {
      res.type("json");
      res.status(INVALID_PARAM_ERROR).send({"error": name + " already found."});
    }
  } catch (err) {
    res.type("json");
    res.status(FILE_ERROR).send({"error": "A database error occurred. Please try again later."});
  }
});

// Provides a post request to delete a pokemon if exists, return error if did not exist.
app.post("/pokedex/delete", async function(req, res) {
  let name = req.body.name;
  try {
    if (name === undefined) {
      res.type("json");
      res.status(INVALID_PARAM_ERROR).send({"error": "Missing name parameter."});
    }
    let check = await db.query("SELECT name FROM Pokedex WHERE name = ?;", [name]);
    if (check[0].length !== 0) {
      let lowerName = req.body.name.toLowerCase();
      let sql = "DELETE FROM Pokedex WHERE name = ?;";
      await db.query(sql, [lowerName]);
      res.type("json");
      res.send({success: name + " removed from your Pokedex!"});
    } else {
      res.type("json");
      res.status(INVALID_PARAM_ERROR).send({"error": name + " not found in your Pokedex."});
    }
  } catch (err) {
    res.type("json");
    res.status(FILE_ERROR).send({"error": "A database error occurred. Please try again later."});
  }
});

// Provides a post request to delete all the exists pokemon
app.post("/pokedex/delete/all", async function(req, res) {
  let sql = "DELETE FROM Pokedex;";
  await db.query(sql);
  res.type("json");
  res.send({success: "All Pokemon removed from your Pokedex!"});
});

// Provides a post request to delete all the exists pokemon
app.post("/pokedex/trade", async function(req, res) {
  let mypokemon = req.body.mypokemon;
  let theirpokemon = req.body.theirpokemon;
  if (mypokemon === undefined || theirpokemon === undefined) {
    res.type("json");
    res.status(INVALID_PARAM_ERROR).send({"error": "Missing mypokemon or theirpokemon parameter."});
  }
  try {
    let lowerMypokemon = req.body.mypokemon.toLowerCase();
    let datefound = getTime();
    let sql = "SELECT name, nickname, datefound FROM Pokedex WHERE name = ?;";
    let checkMyPoke = await db.query(sql, [lowerMypokemon]);
    if (checkMyPoke[0].length === 0) {
      res.type("json");
      res.send({error: mypokemon + " not found in your Pokedex."});
    } else {
      tradeHelper(mypokemon, theirpokemon, res, datefound);
    }
  } catch (err) {
    res.type("json");
    res.status(FILE_ERROR).send({"error": "A database error occurred. Please try again later."});
  }
});

// Provides a post request to update the nickname
app.post("/pokedex/update", async function(req, res) {
  let name = req.body.name;
  if (name === undefined) {
    res.type("json");
    res.status(INVALID_PARAM_ERROR).send({"error": "Missing name parameter."});
  }
  try {
    let check = await db.query("SELECT name FROM Pokedex WHERE name = ?;", [name]);
    if (check[0].length !== 0) {
      let pokeName = name.toLowerCase();
      let nickname = req.body.nickname;
      let sql = "UPDATE Pokedex SET nickname = ? WHERE name = ?;";
      if (nickname === undefined) {
        nickname = name.toUpperCase();
      }
      await db.query(sql, [nickname, pokeName]);
      res.type("json");
      res.send({success: "Your " + name + " is now named " + nickname + "!"});
    } else {
      res.type("json");
      res.status(INVALID_PARAM_ERROR).send({"error": name + " not found in your Pokedex."});
    }
  } catch (err) {
    res.type("json");
    res.status(FILE_ERROR).send({"error": "A database error occurred. Please try again later."});
  }
});

/**
 * Takes an array of list items and processes it into an array.
 * @param {array} list - An array of list with name, nickname, datefound
 * @returns {object} - The formatted object.
 */
function processList(list) {
  let result = [];
  if (list.length !== 0) {
    for (let i = 0; i < list.length; i++) {
      let name = list[i]["name"];
      let nickname = list[i]["nickname"];
      let datefound = list[i]["datefound"];
      result.push({name: name, nickname: nickname, datefound: datefound});
    }
  }
  return result;
}

/**
 * Takes an array of list items and processes it into an array.
 * @param {string} mypokemon - my pokemon in list
 * @param {string} theirpokemon - other user's pokemon
 * @param {respond} res - respond
 * @param {string} datefound - current time
 */
async function tradeHelper(mypokemon, theirpokemon, res, datefound) {
  let lowerMypokemon = mypokemon.toLowerCase(); // delete
  let lowerTheirpokemon = theirpokemon.toLowerCase(); // insert
  let sql2 = "SELECT name, nickname, datefound FROM Pokedex WHERE name = ?;";
  let checkTheirPoke = await db.query(sql2, [lowerTheirpokemon]);
  if (checkTheirPoke[0].length === 0) {
    let sql3 = "DELETE FROM Pokedex WHERE name = ?";
    sqlHelper(sql3, [lowerMypokemon]);
    let sql4 = "INSERT INTO Pokedex(name, nickname, datefound) VALUES (?, ?, ?);";
    sqlHelper(sql4, [lowerTheirpokemon, theirpokemon.toUpperCase(), datefound]);
    res.type("json");
    res.status(INVALID_PARAM_ERROR).send({success: "You have traded your " + mypokemon + " for " +
    theirpokemon + "!"});
  } else {
    res.type("json");
    res.status(INVALID_PARAM_ERROR).send({error: "You have already found " + theirpokemon + "."});
  }
}

/**
 * Takes an array of list items and processes it into an array.
 * @param {string} sql - sql direct
 * @param {list} values - list of values
 */
async function sqlHelper(sql, values) {
  await db.query(sql, values);
}

/**
 * Gets the current date and time in string format.
 * @return {String} the current date and time
 */
function getTime() {
  let date = new Date();
  return date.getFullYear() +
    '-' + (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1) +
    '-' + (date.getDate() < 10 ? '0' : '') + date.getDate() +
    ' ' + (date.getHours() < 10 ? '0' : '') + date.getHours() +
    ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
    ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
