/*
 * Name: KuanHsun Lu
 * Date: Nov 18, 2019
 * Section: CSE 154 AH
 * This is the js file which fetch the API on our localhost. The JS file will utilize the data from
 * bestread API and create a webpage which user can click on. By clicking the book's cover, it will
 * display the reviews, description and rating.
 */

"use strict";

(function() {
  window.addEventListener("load", init);
  let urlName = "/bestreads/books";
  let urlReview = "/bestreads/reviews/";
  let urlInfo = "/bestreads/info/";
  let urlDes = "/bestreads/description/";

  /**
   * Fetch all books into webpage and add EventListener to home button.
   */
  function init() {
    fetchNameData();
    id("home").addEventListener("click", function() {
      id("all-books").classList.remove("hidden");
      id("single-book").classList.add("hidden");
    });
  }

  /**
   * Make request to fetch all books into webpage
   */
  function fetchNameData() {
    let urlFetch = urlName;
    fetch(urlFetch)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(display)
      .catch(handleError);
  }

  /**
   * Create div element and append to #all-books, fetch name, img.
   * Add eventListener to each div element.
   * @param {object} data - json object from API
   */
  function display(data) {
    for (let i = 0; i < data["books"].length; i++) {
      let bookId = data["books"][i]["book_id"];
      let img = document.createElement("img");
      img.src = "covers/" + bookId + ".jpg";
      img.alt = bookId;
      let bookTitle = data["books"][i]["title"];
      let title = document.createElement("p");
      title.textContent = bookTitle;
      let div = document.createElement("div");
      div.appendChild(img);
      div.appendChild(title);
      div.classList.add("selectable");
      div.id = bookId;
      id("all-books").appendChild(div);
      id("single-book").classList.add("hidden");
      div.addEventListener("click", function() {
        removeallChild();
        fetchInfo(this.id);
        fetchDes(this.id);
        fetchReview(this.id);
        id("all-books").classList.add("hidden");
        id("book-cover").src = "covers/" + this.id + ".jpg";
        id("single-book").classList.remove("hidden");
      });
    }
  }

  /**
   * Helper function to remove reviews.
   */
  function removeallChild() {
    let child = qsa("#book-reviews div").length;
    if (child !== 0) {
      for (let i = 0; i < child; i++) {
        let div = qsa("#book-reviews div")[0];
        div.parentNode.removeChild(div);
      }
    }
  }

  /**
   * Make request from API to get reviews
   * @param {string} bookName - book name
   */
  function fetchReview(bookName) {
    let urlFetch = urlReview + bookName;
    fetch(urlFetch)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(review)
      .catch(handleError);
  }

  /**
   * Append child to #book-reviews and do formatted rate to one decimal point.
   * @param {object} data - json object from API
   */
  function review(data) {
    let ave = 0;
    for (let i = 0; i < data.length; i++) {
      let name = document.createElement("h3");
      name.textContent = data[i]["name"];
      let rating = document.createElement("h4");
      let num = parseFloat(data[i]["rating"]).toFixed(1);
      rating.textContent = "Rating: " + num;
      ave += parseFloat(data[i]["rating"]);
      let text = document.createElement("p");
      text.textContent = data[i]["text"];
      let div = document.createElement("div");
      div.appendChild(name);
      div.appendChild(rating);
      div.appendChild(text);
      id("book-reviews").appendChild(div);
    }
    ave /= data.length;
    let formattedRating = ave.toFixed(1);
    id("book-rating").textContent = formattedRating;
  }

  /**
   * Make request to API to get information.
   * @param {string} bookName - book name
   */
  function fetchInfo(bookName) {
    let urlFetch = urlInfo + bookName;
    fetch(urlFetch)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(info)
      .catch(handleError);
  }

  /**
   * Assign book title and author.
   * @param {object} data - json object
   */
  function info(data) {
    let title = data["title"];
    let author = data["author"];
    id("book-title").textContent = title;
    id("book-author").textContent = author;
  }

  /**
   * Make request to API to get description.
   * @param {string} bookName - book name
   */
  function fetchDes(bookName) {
    let urlFetch = urlDes + bookName;
    fetch(urlFetch)
      .then(checkStatus)
      .then(resp => resp.text())
      .then(des)
      .catch(handleError);
  }

  /**
   * While error happened, disabled home button and display error message/
   * @param {object} err - object from API
   */
  function handleError() {
    id("all-books").classList.add("hidden");
    id("single-book").classList.add("hidden");
    id("error-text").classList.remove("hidden");
    id("home").disabled = true;
  }

  /**
   * Make description of the book.
   * @param {string} data - text
   */
  function des(data) {
    id("book-description").textContent = data;
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
