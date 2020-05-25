# Homework 2 - Set! - Project Specification
_Special thanks to Melissa Hovik for the developing the original version of this assignment, to Lauren Bricker for editing, structure, and guidance on specification development, to Tal Wolman and Jack Venberg for restructuring the assignment to include scaffolding for students._
***
<p>
  <img src="https://courses.cs.washington.edu/courses/cse154/19au/homework/hw2/screenshots/spec-intro-view.png" width="60%" alt="Set! Game board">
</p>

This assignment continues what we've been learning in Module 1 (HTML/CSS) and applies what you are
learning in Module 2 (JavaScript, DOM, and Animations). As a longer assignment, it will be worth
more points than HW1 and consists of two submissions:
1. Part A Submission (8 points)
2. Part B (Final) Submission (22 points)

To accept and submit for both submissions you will clone a HW repo just like you've done with CP1/HW1/CP2, but will need to get the README spec for Part B. You will need to use `git pull` to get this updated file in your `hw2` repository.

Recall the instructions to accept and submit for Part A:
1. Click "Accept HW" button for HW2 Part A.
2. Clone this `hw2-set-<username>` repo in your local cse154 directory (NOT within another git repository)
3. Add/commit/push your work when ready to submit for Part A.
4. Click "Turn in HW" button for Part A assignment before the Part A due date.

To accept and submit Part B (after submitting Part A) you will:
1. Run `git pull` in your `hw2-set-<username>` repo from Part A to get the new files for Part B.
2. Click "Accept HW" button for HW2 Part B
3. *Continue working on the same repository from Part A*
4. Add/commit/push your work when ready to submit for the submission
5. Click "Turn in HW" button for Part B (Final Submission) assignment


## Assignment Overview
In this assignment you will use JS to add functionality to a basic webpage and
use responsive CSS to layout two different views for the webpage. Specifically,
you will implement a web-based version of the Set card game, providing features
to generate new games for a user and to keep track of how many correct Sets a player has found.
You will also implement a basic timer for the user to keep track of how quickly it takes
them to solve a given game. You can find a video demonstrating expected behavior for
different cases on the [homework
page](https://courses.cs.washington.edu/courses/cse154/19au/homework/) of the course website.

### Rules of Set
See Part A. You can also practice the game [here](https://www.nytimes.com/puzzles/set), which gives useful feedback to users about incorrect selections.

### Starter Files and Final Deliverables
You will have the required `img`, `set.html`, `set.css`, and `set.js` files in your repository for Part A.  Note that `set.html` is a little different than `milestone.html` - it factors out the cards from HTML to dynamically generating using JS based on selected options and gameplay. You will just be implementing timed mode (5, 3, and 1 minute games).

In Part B (final submission) you must not change `set.html` or any of the images, but you will be submitting your changes to `set.css` and `set.js` to meet this specification's requirements.

| File/folders&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    | Repository files to stay unchanged |
|----------------|------------------------------|
| `set.html`     | (**Specific to Part B**) Provided HTML linking to your `set.css` and `set.js` files |
| `img`          | A folder with 27 classic set cards, each named with the convention: *STYLE-SHAPE-COLOR.png* (replacing STYLE, SHAPE, COLOR with a value for that attribute as listed in "Rules of Set" section) |
| `milestone.html` | (**Only Part A**) A starter file for testing styles related to cards. |
| `set.css` | (**Both Part A and Part B**) Stylesheet for set.html (also required for Milestone) |

With the exception of `milestone.html`, which will not be graded with the final turn in,
your repository should be submitted with these starter files as
well as the following files you are to implement (below). **All files** except the `set.css` file are to remain unchanged.

| File      | Repository files you will implement and turn in |
|-----------|------------------------------|
| `set.js`  | (**Part B only**) JS file for managing game UI and behavior |

Your final solution will be graded only on `set.css` and `set.js` - any changes you
make to `set.html` or the card images folder will not be eligible for full credit.

---

## Milestone Requirements (CSS & Start Javascript)
Implemented in Part A.

---

## Final Submission Requirements
The final submission for this  assignment requires that you fully implement the user interaction and game management for the Set! game. To be eligible for full credit on this assignment your submission:
* Must meet the expected behavior as outlined below and as demoed in the provided video
* Implement the 6 required functions described in the spec (including the `toggleView` function you implemented in Part A)

Beyond proper implementation, you are expected to implement the feedback from Part A before turning in your completed project. You will receive the feedback prior to the due date of this assignment and are responsible for correcting and clarifying anything noted by your TA. If you do not implement the feedback you will not be eligible for full credit on the assignment. Remember that this is your chance to iterate on early feedback to demonstrate an understanding of the material we've covered so far.

### Notes
* **IMPORTANT:** The defined functions described below must be implemented as described in the spec. You are expected to refactor sections of code into _smaller_, helper functions that are called by the defined functions. This makes your code significantly easier to read and reduces redundancy across your JS file.
* These functions are **not** exhaustive meaning that you are _still_ expected to write the code to tie these functions together and connect them to the user interface. This will definitely require writing additional functions beyond what is outlined in the spec. Think of these defined functions as the building blocks of the game. It is your task to implement the fundamentals and connect the pieces.

**Note about difficulty and generated cards**: In both Easy (9 card) and Standard (12 card)
difficulties, there are 4 attributes (style, color, shape, and count) and 3 possible options
for any attribute (e.g. red, green, or purple options for the color attribute). For Standard
difficulty, each card should have a randomly-selected value for each of the 4 attributes. For
Easy difficulty, the "style" attribute should be fixed to "solid". To avoid redundancy in your
program and allow for flexibility if users later want to change the images and attributes, **we
suggest using 4 arrays as module-global constants, one for each attribute type (style, color,
shape, count) - since count is an integer, you may alternatively use a different datatype to represent it as a constant.** Remember that a module-global symbol is any that is in the module pattern but
defined outside of the local scope of functions within the module pattern (in general, you
should minimize the number of module-global variables).

# Behavior Details Overview
Below are the details describing how to play the game Set. This description, as well as the description of the required functions should provide you with all the information necessary to implement the game.

### Starting a Game
* The current set count should be 0.
* A timer should be started depending on the currently-selected option in the dropdown. The game timer should start with the number of seconds determined by the selected
  option and decrement each second (never going below 0 seconds).
* The Main Menu view should be hidden.
* The Game View should be displayed (after the first two steps so that the initial game information
  is shown correctly when the view changes).
* A new randomly-generated board of cards is generated, where each of the 4 attributes of a card
  are randomly-chosen (recall each attribute has 3 options) in Standard difficulty. The only
  difference in the randomness of cards in Easy difficulty is that the "style" attribute
  should always be fixed to "solid".
* The generated board should never have duplicate cards (cards that share all 4 attributes).
  During this step, you should not create more than 12 card DOM elements.
* The `Refresh Board` button should be reenabled (in case it was disabled in a previous game)

### Game Play
Upon initialization a user should be able to select and deselect from the cards on the board. When three cards have been selected there will be a message displayed to the user indicating whether the three cards make a Set or not:
  * If the cards make a Set, the message "SET!" will be briefly displayed and the cards will be replaced with three, new, unique cards.
  * If the cards do not make a Set, the message "Not a Set :(" will be briefly displayed and the same cards will be re-displayed on the board.

### Refreshing the Board
When the "Refresh Board" button is clicked:
* All cards on the board should be replaced with a new collection of cards, following the same
rules for generating a board outlined in "Starting a Game".

### Ending the Game
A game ends when the user clicks the "Back to Main" button or when they run out of time. In both cases, the game timer should be stopped and not started again until a new game is
started by the user (when the "Start" button is clicked again).

If the game ends due to running out of time:
* The current view should remain on the Game View until the "Back to Main" button is clicked.
* Any cards currently selected should appear unselected.
* To ensure a user cannot continue playing until a new game is started, nothing should happen when a
user clicks on a card.
* The "Refresh Board" button should also be disabled until it is re-enabled if a user starts a new
game later.
* The timer calling `advanceTimer()` should be stopped and cleared.

When the "Back to Main" button is clicked:
* The current view should be switched from the Game View to the Menu View having the same selected
options for difficulty as the previous game.

## Required Module Global Variables for Part B:
| Module Global Name | Description |
|--------------------|-------------|
|`timerId`   | represents the time for the current game  |
|`remainingSeconds`   | represents the time in seconds left in the current game  |

You may optionally have a `totalCards` module-global variable to represent the total number of cards managed on the board for the current game. This isn't required, but there are reasonable trade-offs depending on different program implementations.

## Provided Function For Part B:

### `isASet(selected)`
* This function should be copied into and used within `set.js`

```javascript
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
```

Accepted parameters:
* `selected` {DOMList}: A DOM list of properly generated card `div` elements that are selected.
  * These cards should be generated from `generateUniqueCard(isEasy)` described below

Expected returns:
* Returns `true` if all the given cards are a Set, otherwise returns `false`

#### Optional, but strongly recommended functions
You are welcome to use the helper/shorthand functions discussed in lecture like `id`, `qs`, `qsa`, and `gen`. These functions make your code more concise as well as easier to write and read. However, make sure you do not include helper functions in your `set.js` file that are not used as that would be unnecessary and ensure that, just like any other function in your `set.js`, these functions have appropriate JSDoc header comments.

## Required Functions For Part B
In addition to the `toggleView` function you were required to implement in Part A, there are 5 required functions in Part B. We have provided a table for a summary, but more details are provided below the table for each function.

As a reminder, you are expected to break down your program into smaller functions as necessary, but these will be used to test your code and will need to work with the different interactive elements and events using event listeners appropriately.

| Function Name/Arguments      | Brief Description/Return Value |
|-----------|------------------------------|
| `generateRandomAttributes(isEasy)`  | Returns a randomly-generated array of string attributes in the form `[STYLE, SHAPE, COLOR, COUNT]` |
| `generateUniqueCard(isEasy)`  | Return a `div` element with `COUNT` number of `img` elements appended as children |
| `startTimer()` |Starts the timer for a new game. No return value.|
| `advanceTimer()` |Updates the game timer (module-global and #time shown on page) by 1 second. No return value.|
| `cardSelected()` |Used when a card is selected, checking how many cards are currently selected. If 3 cards are selected, uses `isASet` (provided) to handle "correct" and "incorrect" cases. No return value.|

### `generateRandomAttributes(isEasy)`
Accepted parameters:
* `isEasy` {boolean} : if `true` style of card will always be solid, otherwise the style attribute should be randomly selected.

Each card has four different attributes - style, shape, color and count.
* Use `Math.random()` to randomly generate each of these four different attributes. Store each attribute in an array in the exact order shown here:`[STYLE, SHAPE, COLOR, COUNT]` and return the array.
* Implementation suggestion: focus on generating these attribute combinations one at a time to reduce redundancy.

Expected returns:
* Returns a randomly generated array of attributes in the form `[STYLE, SHAPE, COLOR, COUNT]`

### `generateUniqueCard(isEasy)`
Accepted parameters:
* `isEasy` {boolean} : if `true`, the style of card will always be solid, otherwise each of the three possible styles is equally likely.

Expected returns:
* Return a `div` element with `COUNT` number of `img` elements appended as children
    * `img` elements should have a `src` attribute following the appropriate image naming convention (i.e `STYLE-SHAPE-COLOR`) to reference the correct image inside of the `/img` directory.
    * `img` elements should also have an `alt` that stored the attributes of the form: `STYLE-SHAPE-COLOR-COUNT`
* For keeping track of unique cards, you are required to give your card `div`'s an ID with the 4 attributes in the form: `STYLE-SHAPE-COLOR-COUNT`.
    * `generateUniqueCard()` should **only** generate cards that are **not** currently inside of `#board`, meaning they do not have the same ID.
    * **IMPORTANT**: You cannot make any assumptions about the current state of the game and cards previously put on the board, you should only use the information currently inside of `#board` and nothing you have kept track of previously.
* The card `div` should have the class `card` added to it in order to style the cards.
* The card should have an click event listener attached to it that calls the function `cardSelected()` defined below in the spec.

### `startTimer()`
* Called when a game starts.
* Grabs the timing option from the `#menu-view` and sets the timer to display that time and updates the state of the game to keep track of the current time.
* Starts the periodic calling of `advanceTimer()` every `1` second (see specification for function below)

### `advanceTimer()`
* With each call of this function, the time should be decremented by `1` second.
* This should both update the time kept track in the game and update the `#time` on the board
  * **Note about the game timer format**: When updating during the Game View, the timer format in `#time`
   must stay in proper MM:SS format (for example, if there are 8 seconds left, the timer
   should display 00:08.
* If there is no time left in the game (time reaches or goes below 0), the board should be disabled as described in the [Ending the Game](#ending-the-game) above:
> * The current view should remain on the Game View until the "Back to Main" button is clicked.
> * Any cards currently selected should appear unselected.
> * To ensure a user cannot continue playing until a new game is started, nothing should happen when a
user clicks on a card.
> * The "Refresh Board" button should also be disabled until it is re-enabled if a user starts a new
game later.
> * The timer calling `advanceTimer()` should be stopped and cleared.

### `cardSelected()`
* Once the game has been initialized, a user can click on cards to find a Set. Clicking on a card should toggle its `.selected` state (all cards are initially unselected). When three cards are `.selected` on the board, there are two possible cases you should handle depending on what `isASet` returns.
  * **REMINDER**: the function for checking whether 3 cards are a set (`isASet`) is provided. Please do not reimplement or modify this function. Modifications to the provided code are ineligible for full credit.

**Both Cases**:
* For both cases, the three selected cards should lose the `.selected` appearance just prior to the appropriate 1-second message displaying (refer to provided video demo linked on the course website).
* Below is an example of the message displayed when an incorrect Set is selected:
  <img src="https://courses.cs.washington.edu/courses/cse154/19au/homework/hw2/screenshots/game-view-not-set.png" width="60%" alt="Not a Set display example">


**Case 1: The three selected cards create a Set**
* Number of sets found should be incremented (the set counter should be incremented by one in `#set-count`)
* A `<p>` element containing the text message "SET!" should appear in each card and the `img` elements within the card should be hidden by adding the class `hide-imgs` to the `.card` itself.
  * Remember that you may **not** modify the provided HTML file but the structure of your card should look like this for 1 second before populating a new randomly generated card to replace the previous one (we recommend setting a breakpoint in the Chrome Inspector Sources tab and check the card's HTML when you expect a card to display the message).
  ```html
  <div id="id-of-card" class="card selected hide-imgs">
      <img src="img-src" alt="id-of-card">
      <!-- possibly more images -->
      <p>SET!</p>
  </div>
  ```
* After 1 second, you should replace the selected cards with a new **unique** card that is not currently on the `#board`. For this, you should use the `generateUniqueCard(isEasy)` function that you have already implemented.
  * When replacing cards in a found Set, the order/position of other cards on the board should remain unchanged - refer to the demo video for an example.

**Case 2: The three selected cards do not create a Set**
* A `<p>` element containing the text message "Not a Set :(" should appear in each card and the `img` elements within the card should be hidden by adding the class `hide-imgs` to the `.card` itself
  * Remember that you may **not** modify the provided HTML file but the structure of your card should look like this for 1 second before returning to its original structure (_without the `<p>` element_).
  ```html
  <div id="id-of-card" class="card selected hide-imgs">
      <img src="img-src" alt="id-of-card">
      <!-- possibly more images -->
      <p>Not a Set :(</p>
  </div>
  ```
* An invalid Set results in a 15 second deduction from the time remaining
    * **Note**: The time displayed should never be negative meaning that if there are less than 15 seconds remaining the clock should display `00:00` in addition to implementing the appropriate end game behavior.
    * Your time should be updated immediately on the page  after clicking the third card and not wait for the `advanceTimer()` function or the message to go away to make it reflect on the page.

---

## JS File Contents
In order to be eligible for full credit, **the naming and casing of all required functions must
be correct**. Below is the skeleton for the function with the correct naming and casing. To help
ensure it is correct in your code, you can copy it into you `.js` file. Note that the function
documentation is not included but required. Additionally, in order to be eligible for full credit
you should **remove all unnecessary comments** before submitting. Failure to do any of the above may be reflected in your assignment grade.
```js
// Required module globals
let timerId;
let remainingSeconds;

// Optional module global
let totalCards;

// Required functions to implement for part A
function toggleView()  {
  // code should have been implemented for part A submission
}

// Required functions to implement for part B are below
function generateRandomAttributes(isEasy) {
  // code for function goes here
}

function generateUniqueCard(isEasy) {
  // code for function goes here
}

function startTimer() {
  // code for function goes here
}

function advanceTimer() {
  // code for function goes here
}

function cardSelected() {
  // code for function goes here
}
```

## Development Strategies
If you’re unsure where to start, the following is a roadmap of recommended steps to make the assignment more approachable:

1. Understand the overall behavior of the game to give important context in implementing the game
   * Watch the videos, read the [Behavior Details Overview](#behavior-details-overview)
   * Understand the `isASet` function and when you might use it.
2. Start by implementing the defined functions in the order they're introduced in the spec
   * This should give you the majority of the behavior of the game.
   * Take each function one step at a time and remember to use your other functions to avoid reimplementing shared behavior.
   * When you are implementing the functions, make sure you only add the functionality outlined in the spec.
   * Remember to break down the defined functions into smaller functions functions to make the problem easier to tackle, read, and understand.
3. Implement the overall connection of the DOM and the defined functions and any other behavior to complete the game.
   * You may find it helpful to create a table similar to the one suggested in the CP2 spec while developing
4. Running into bugs? Use the Chrome console/sources tab as demonstrated in lecture/section, use `console.log` to see what the result of a statement is, add a breakpoint in the sources tab to access information at each step of the function, etc.  
5. Rewatch the video to ensure you have not missed any details
6. Be proud of what you've done (this is a challenging assignment) and play the game!

## External Requirements
Your webpage should match the overall appearance of the provided screenshots and
it **must** match the appearance specified in this document. We do not expect you
to produce a pixel-perfect page that exactly matches the expected output image.
However, your page should follow the specific style guidelines specified in this
document and match the look, layout, and behavior shown here as closely as possible.
Any properties unspecified in this spec or visually discernible in screenshots
should be left to the default values for the respective page element (e.g the
font size of the `h1` element on the page).

## Internal Requirements
For full credit, your page must not only match the External Requirements listed above, you must also
demonstrate that you understand what it means to write code following a set of programming standards.
Your CSS and JS should also maintain good code quality by following the
  [CSE154 Code Quality Guide](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/). Make sure to review the section specific to JavaScript! We also expect you to implement relevant feedback from previous assignments. Some guidelines that are particularly important to remember for this assignment:

#### CSS:
* Your Part B work will be all JS. That said, you should review your feedback from Part A for CSS as part of your grade for Part B will be for completely accurate CSS.

#### JS:
* Your `.js` file must be [in the module pattern](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/javascript/#module-pattern) and run in strict mode by putting `"use strict";` above the module pattern.
* Use `camelCase` naming conventions for variables and functions
* There should be never be any DOM elements on the page sharing the same ID.
* All images in cards should be given an appropriate alt attribute.
* You should not have any unnecessary interval/time-out running on your page at any time (make sure
  you understand the difference between an interval and delay)
* Do not use any global variables, and minimize the use of module-global variables. Do not ever
  store DOM element objects, such as those returned by the `document.getElementById` function, as
  global variables.  
  * *Note*: Our solution has the two required module-globals described above (the game timer and number of seconds in a
  current game) and some solutions may also have a module-global to keep track of the count of cards for the current game difficulty. Otherwise, these are the **only** module-global variables you need to declare in this assignment.
* If a particular literal value is used frequently, declare it as a module-global "constant"
`IN_UPPER_CASE` and use the constant in your code. Our solution has an array for each attribute, a
path to the images folder, and two constants for the number of cards associated with each difficulty. Constants make your code significantly more readable and modular, you are encouraged to declare them to eliminate "magic" values in your code.

#### Both:
* Format your CSS, and JS to be as readable as possible, similarly to the examples from class: Properly use whitespace and indent your CSS and JS code as shown in class. You can find information about JS conventions [here](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/javascript/#whitespace-before-blocks).
* You may not use any CSS/JS frameworks for this assignment.
* Your page must pass the CSS Linter and
  [CSE 154 ESLint](https://oxford.cs.washington.edu/cse154/jslint/) with no errors.

### Documentation
Place a comment header **in each file** with your name, section, a brief description of the assignment, and the file's contents (examples have been given on previous assignments).
* You will be expected to properly document your functions in `set.js` using JSDoc with `@param` and `@return` where necessary. Refer to the [Code Quality Guide](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/javascript/#comments-function-header) for some examples.

## Grading
The grading distribution for Part B will be broken down as follows (subject to small changes):
* External Correctness: 45-55%
* Internal Correctness: 35-45%
* Documentation: 5-10%

## Academic Integrity
As with other CSE 154 HW assignments, you may not work with other students on HW2, and all work must be your own. Submissions found sharing code or using code from resources online will be subject to the University's Academic Misconduct process. You may also not place your solution to a publicly-accessible web
site, neither during nor after the school quarter is over. Doing so is considered a violation of our
course [academic integrity](https://courses.cs.washington.edu/courses/cse154/19au/syllabus/syllabus.html#academic-conduct)
policy. As a reminder: This page page states:

  The Paul G Allen School has an entire page on
  [Academic Misconduct](https://www.cs.washington.edu/academics/misconduct) within the context of
  Computer Science, and the University of Washington has an entire page on how
  [Academic Misconduct](https://www.washington.edu/cssc/for-students/academic-misconduct/) is
  handled on their
  [Community Standards and Student Conduct](https://www.washington.edu/cssc/) Page. Please acquaint
  yourself with both of those pages, and in particular how academic misconduct will be reported to
  the University.
