/*
 ** This web service outputs the path of book's information
 * ***endpoints***
 *
 * /bestreads/description/:book_id
 * Provides a description of given book
 * Response format: text/plain
 * Example request: "/bestreads/description/harrypotter"
 * Example response:
 *  Harry Potter is lucky to reach the age of thirteen, since he has already survived
 *  the murderous attacks of the feared Dark Lord on more than one occasion. But his
 *  hopes for a quiet term concentrating on Quidditch are dashed when a maniacal
 *  mass-murderer escapes from Azkaban, pursued by the soul-sucking Dementors who
 *  guard the prison. It's assumed that Hogwarts is the safest place for Harry to
 *  be. But is it a coincidence that he can feel eyes watching him in the dark,
 *  and should he be taking Professor Trelawney's ghoulish predictions seriously?
 *
 * /bestreads/info/:book_id
 * Provides a information of given book
 * Response format: json
 * Example request: "/bestreads/info/harrypotter"
 * Example response:
 *  {
 *    "title": "Harry Potter and the Prisoner of Azkaban (Harry Potter #3)",
 *    "author": "by J.K. Rowling, Mary GrandPre (Illustrator)",
 *  }
 *
 * /bestreads/reviews/:book_id
 * Provides reviews of given book
 * Response format: json
 * Example request: "/bestreads/reviews/harrypotter"
 * Example response:
 * [
 *    {
 *        "name": "Wil Wheaton",
 *        "rating": 4.1,
 *        "text": "I'm beginning to wonder if there will ever be a Defense Against The Dark Arts
 *                 teacher who is just a teacher."
 *    },
 *    {
 *        "name": "Zoe",
 *        "rating": 4.8,
 *        "text": "Yup yup yup I love this book"
 *    },
 *    {
 *        "name": "Kiki",
 *        "rating": 5,
 *        "text": "Literally one of the best books I've ever read. I was chained to it for two days.
 *                 I cried and laughed and yelled AHH when all of the action went down."
 *    }
 * ]
 *
 * /bestreads/books
 * Provides all book's title and book ID
 * Response format: json
 * Example request: "/bestreads/books"
 * Example response:
 * {
 *    "books": [
 *        {
 *            "title": "2001: A Space Odyssey",
 *            "book_id": "2001spaceodyssey"
 *        },
 *        {
 *            "title": "Alanna: The First Adventure (Song of the Lioness #1)",
 *            "book_id": "alannathefirstadventure"
 *        },
 *        {
 *            "title": "Alice in Wonderland",
 *            "book_id": "aliceinwonderland"
 *        },
 *        ... (one entry like this for each folder inside books/)
 *    ]
 * }
 */

"use strict";

const util = require("util");
const express = require("express");
const fs = require("fs").promises;
const glob = require("glob");

const globPromise = util.promisify(glob);

const INVALID_PARAM_ERROR = 400;
const FILE_ERROR = 500;

const app = express();

// Provides paths to description of the given book :book_id string.
app.get("/bestreads/description/:book_id", async function(req, res) {
  let bookId = req.params["book_id"];
  let description;
  try {
    description = await fs.readFile("books/" + bookId + "/description.txt", "utf8");
    res.type("text");
    res.send(description);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("No results found for " + bookId + ".");
    } else {
      res.type("text");
      res.status(FILE_ERROR).send("Something went on the server, try again later.");
    }
  }
});

// Provides paths to information of the given book :book_id string.
app.get("/bestreads/info/:book_id", async function(req, res) {
  let bookId = req.params["book_id"];
  let info;
  try {
    info = await fs.readFile("books/" + bookId + "/info.txt", "utf8");
    res.type("json");
    info = info.split(/\r?\n/);
    let title = info[0];
    let author = info[1];
    res.json({
      "title": title,
      "author": author
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      res.type("text");
      res.status(INVALID_PARAM_ERROR).send("No results found for " + bookId + ".");
    } else {
      res.type("text");
      res.status(FILE_ERROR).send("Something went on the server, try again later.");
    }
  }
});

// Provides paths to reviews of the given book :book_id string.
app.get("/bestreads/reviews/:book_id", async function(req, res) {
  let bookId = req.params["book_id"];
  let reviews = await globPromise("books/" + bookId + "/review*.txt");

  if (reviews.length === 0) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("No results found for " + bookId + ".");
  } else {
    let name;
    let rate;
    let text;
    let result = [];
    try {
      for (let i = 0; i < reviews.length; i++) {
        let content = await fs.readFile(reviews[i], "utf8");
        content = content.split(/\r?\n/);
        name = content[0];
        rate = content[1];
        text = content[2];
        let obj = {"name": name, "rating": rate, "text": text};
        result.push(obj);
      }
      res.json(result);
    } catch (err) {
      res.type("text");
      res.status(FILE_ERROR).send("Something went on the server, try again later.");
    }
  }
});

// Provides paths to reach out all book's informatin and title
app.get("/bestreads/books", async function(req, res) {
  let books = await fs.readdir("books");
  let list = [];
  if (books.length === 0) {
    res.type("text");
    res.status(FILE_ERROR).send("Something went on the server, try again later.");
  }
  try {
    for (let i = 0; i < books.length; i++) {
      let info = await fs.readFile("books/" + books[i] + "/info.txt", "utf8");
      info = info.split(/\r?\n/);
      let title = info[0];
      let obj = {"title": title, "book_id": books[i]};
      list.push(obj);
    }
    let result = {"books": list};
    res.json(result);
  } catch (err) {
    res.type("text");
    res.status(FILE_ERROR).send("Something went on the server, try again later.");
  }
});

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
