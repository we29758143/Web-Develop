# Homework 5 - Pokedex API - Project Specification
*Special thanks to Whitaker Brand and Melissa Hovik for the original version of this assignment. Additional thanks to Tal Wolman and Jack Venberg for the adaptation of this assignment into Node.js*

# Overview

For this assignment, you will be using Node.js and SQL to create a Pokedex API that keeps track of a user's Pokemon that they catch. Additionally you will create, modify, and query information in a database.

### Learning Objectives
* Continue to practice all of the CSE 154 learning objectives from previous assignments, including:
    * Carefully reading and following assignment specifications.
    * Reducing redundancy in your code while producing expected output.
    * Producing quality readable and maintainable code with unobtrusive JS.
    * Clearly documenting your code as specified in the CSE 154 Code Quality Guide.
* Building an API that responds to GET and POST requests using Node.js.
* Using Node to read information from a database with SQL.
* Using Node to write information to a database with SQL.

### Final Deliverables and Provided Files

You are to implement the following files and turn them in through your repository:

| File          | Repository file you will implement and turn in |
|---------------|------------------------------|
| `pokedex.js` | A JS file that defines all endpoints of your webservice. |
| `package.json` | The JSON file with all your project dependencies (e.g. `express`) which you initialize with `npm init` with the correct values |
| `setup.sql` | creates the necessary table to store your collected Pokemon |


**Important Note**:
*  Make sure you run `npm init` and specify all the fields. Most importantly, making sure to set `main` to `pokedex.js`. (this will automatically be specified for you if you run `npm init` after creating the `pokedex.js` file assuming your directory structure is correct)
* Make sure to never directly edit the `package.json` dependencies to ensure we can install the `node_modules` necessary for your solution.
* Additionally, we have included a `.gitignore` file so that the `node_modules` do not get pushed to GitLab. DO NOT modify this file.
* You are not required to turn in the `package-lock.json` file that's generated (you can choose to leave it or remove it).

The `pokedex.js` file should be saved at the root of this directory. Incorrect directory structure will make you ineligible for full credit on this assignment.

### Provided Front End

We have provided the following client side files that utilize your API in your repository.

| File  | Repository files to stay unchanged |
|--------------------|------------------------------|
| `public/main.html`   | the main page of the application, which lets a user choose to start a game or trade Pokemon with another user and the pokedex/game view of the application, which lets a user choose a Pokemon to play with and then play a Pokemon card game with another player. |
| `public/main.min.js` | Minified JavaScript for `main.html`. |
| `public/styles.css`   | The styles for `main.html` |

These files should stay **unchanged** throughout your development cycle.

#### Tips For Use/Testing With Front End

Once your API is completed, you should hit the `Reset Pokedex` button in order to tell the client side to populate your Pokedex API with three random start Pokemon.
From there, you can challenge your fellow classmates in battle, rename your Pokemon, or trade them.

Your solution will be graded only on the `pokedex.js` and `setup.sql` files in the first table above. Any changes you make to the provided files will be ignored.

# External Requirements - Web Service Behavior

## Database Setup
Before starting the `.js` file for your webservice, you will need to set up your own SQL database and table to represent your Pokedex. This is the table your web services will be using to keep track of which Pokemon you have caught. Storing
your Pokemon in a database (instead of in a DOM element as you did in HW3) allows us to maintain the state
after refreshing or exiting the web page.

To do this, you will write the required SQL command to create your `Pokedex` table inside of `setup.sql`.

We have provided starter code in your `setup.sql` that will clear any previous tables/databases and create a database called `hw5db` that you will use to store your `Pokedex` table.

Your code in `setup.sql` must contain queries that you wrote yourself and were not generated
by exporting from phpMyAdmin or the like. This file should meet the following requirements:
* The `Pokedex` table should have three columns:
  * `name` for each Pokemon's name which also serves as the table's `PRIMARY KEY` (e.g., "bulbasaur")
  * `nickname` for each Pokemon's nickname (e.g., "Bulby")
  * `datefound` for the date and time you collected the Pokemon
*  The `name` and `nickname` columns should have `VARCHAR` data types and allow string lengths of `30` characters.
* To represent the date and time, use the `DATETIME` data type. In MySQL, this type represents a date and
time in the format `YYYY-MM-DD HH:MI:SS` (e.g., 2018-05-28 13:54:00 to represent 1:54 PM on May 28th,
2018).
* Your database name (`hw5db`), table name (`Pokedex`), column names (`name`, `nickname`, `datefound`) **must
match exactly those here in the spec with correct casing**.
* Your code in `setup.sql` must be valid MySQL - that is, if we were to import it into a database on phpMyAdmin, it would be run without any errors to create/populate the table(s).

## Pokedex API Specification
Your `pokedex.js` web service will provided different data based upon the route. The possible endpoints are described below.

### **Overall Error Handling For Each Endpoint**

### **Error-Handling for Database Connection (Service Unavailable)**
Handle any errors related to database-connections with a 500 error and a message in the JSON format:

```json
{ "error" : "A database error occurred. Please try again later." }
```

### **Error-Handling for Missing Parameters (Invalid Request)**
Any of the following invalid request errors should be sent as a 400 error with descriptive messages having a JSON content type (note the difference between plain text error messages you used in HW4).

For any of the POST endpoints supported by your web service, the expected JSON format of the message is specified as follows:

If the endpoint has **one required** parameter and is missing/incorrect the error message should be exactly as shown below:

```json
{ "error" : "Missing <parametername> parameter."}
```

If the endpoint has **two required** parameter and either one _or_ both are missing/incorrect the error message should be exactly as shown below::

```json
{ "error" : "Missing <parameter1> or <parameter2> parameter."}
```

**Important: If the user does not provide a required parameter, then the Pokedex database should not be modified**


### **Endpoint 1: Fetching Player Credentials**
**Request Format:** `/credentials`

**Request Type:** GET

**Returned Data Format:** plain text

**Description:** Your service should return the user's player ID (PID) and token.
* For this assignment,
your PID will be your UW netid. These PID and token values will be used by the front-end code and
our game web service for verifying that players are who they say they are when they play moves in
battle mode, and trade with one another.
* You will need to generate your token to play games and
trade with other students on our server. To do so, visit
[this link](https://oxford.cs.washington.edu/cse154/pokedex-2/uwnetid/generate-token.php).
  * **WARNING**: Every time you refresh this page, you will get a new token and your project will not work with the old token.
The PID and token values displayed should be carefully copy/pasted as `const`s at the top of your `pokedex.js` file.
There are no query parameters for this route; it returns the PID and the token each on their own line.

**Example Request:** `/credentials`

**Example Output:** (bricker is the example PID):

```
bricker
poketoken_123456789.987654321
```

### **Endpoint 2: Fetching Pokemon Data**

**Request Format:** `/pokedex/list`

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** Your service should return a JSON response with a key "pokemon" mapping to an array of all Pokemon you have found (your Pokedex table), including the name, nickname, and found date/time for each Pokemon.

* The array of Pokemon should be **in ascending order by the datefound column**
  *  **Important:** You should handle the ordering of the response through your SQL command and not by sorting in Javascript
* The array should be empty if the Pokedex table happens to be empty. This route does not take any query parameters (ignore any parameters passed).


**Example Request:** `/pokedex/list`

**Example Output:** (abbreviated)

```
{
"pokemon" : [
    {
      "name" : "bulbasaur",
      "nickname" : "Bulby",
      "datefound" : "2019-28-23T17:52:06.000Z"
    },
    {
      "name" : "charmander",
      "nickname" : "CHARMANDER",
      "datefound" : "2019-19-23T17:56:06.000Z"
    },
  ...
  ]
}
```

**Example Output** (when Pokedex table is empty):

```
{ "pokemon" : [] }
```

### **Endpoint 3: Adding Pokemon to your Pokedex**

**Request Format:** `/pokedex/insert`

**Request Type:** POST

**Request Parameters**:
  * `name` - a name of a Pokemon to add
  * `nickname` (optional parameter) - a nickname of added Pokemon

**Returned Data Format:** JSON

**Description:** Your service should add a Pokemon to your Pokedex table, given a required `name`
parameter.
* The `name` should be added to your Pokedex in all-lowercase (for example,
a `name` POST parameter passed with the value `BulbaSAUR` should be saved as `bulbasaur` in the Pokedex table).
* If passed a `nickname` parameter, this nickname should also be added with the Pokemon (don't modify
anything to uppercase or lowercase for the nickname, just store it as it was given).
  * Otherwise, the nickname for
the Pokemon in your Pokedex table should be set to the Pokemon's name in all uppercase (e.g., BULBASAUR
for `name` of `BulbaSAUR` when no nickname parameter is passed).
* You should also make sure to include the date/time you added the Pokemon. You can get the current date/time in the format for the previously-described SQL `DATETIME` data type using the following provided function below. Please do not modify this function.
  * You should add the result of `getTime()` to your `datefound` table column.

```js
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
```

**Example Output:**
Upon success, you should return a JSON result in the format:
```json
{ "success" : "<name> added to your Pokedex!" }
```
If the Pokemon is already in the Pokedex (as determined by a duplicate name field), you should
return a message with a 400 error code in the JSON format:

```json
{ "error" : "<name> already found." }
```

Nothing should change anything in your Pokedex if there is an error due to a name collision. However, in both
success and error cases, `<name>` should be replaced with the value of the passed `name` (maintaining letter-casing).

### **Endpoint 4: Removing a Specific Pokemon from your Pokedex**

**Request Format:** `/pokedex/delete`

**Request Type:** POST

**Returned Data Format:** JSON

**Request Parameters**
  * `name` - a name of a Pokemon to delete

**Description:** When passed a name, the Pokemon with the given `name` (case-insensitive) should be removed from your
Pokedex.
* For example, if you have a pokemon named `charmander` in your Pokedex table and a POST request to `pokedex/delete` with
`name` passed as `charMANDER` is made, your Charmander should be removed from your table.

**Example Output:**
Upon success in using the name parameter, you should return a JSON result in the format:
```json
{ "success" : "<name> removed from your Pokedex!" }
```

If passed a Pokemon name that is not in your Pokedex, you should return a message with a 400 error
code in JSON format:

```json
{ "error" : "<name> not found in your Pokedex." }
```

Your table should then not change as a result.

For both success and error cases, `<name>` in the message should be replaced with the value of the
passed name (maintaining the provided letter-casing).

### **Endpoint 5: Removing All Pokemon from your Pokedex**

**Request Format:** `/pokedex/delete/all`

**Request Type:** POST

**Returned Data Format:** JSON

**Description:** Your service should remove all Pokemon that are currently in the Pokedex table.
* **Note**: You should
**not** accomplish this by dropping your Pokedex table and re-creating it.

**Example Output:**
When all Pokemon are successfully removed from your Pokedex table, you should return a JSON result in the format:

```json
{ "success" : "All Pokemon removed from your Pokedex!" }
```

### **Endpoint 6: Trading Pokemon**

**Request Format:** `/pokedex/trade`

**Request Type:** POST

**Request Parameters**:
  * `mypokemon` - name of Pokemon to give up in trade
  * `theirpokemon` - name of Pokemon to receive in trade

**Returned Data Format:** JSON

**Description:** Your service should take a Pokemon to remove from your Pokedex `mypokemon` (case-insensitive) and a
Pokemon to add to your Pokedex `theirpokemon`.
* When adding `theirpokemon` to your Pokedex, the Pokemon name should be added in all lowercase and the Pokemon
should have the default nickname format (i.e. the name in all UPPERCASE). Similar to the
behavior specified in the `/pokedex/insert` endpoint, the date/time added should be when the trade occurred.

**Example Output:**
Upon success, you should return a JSON result in the format:

```json
{ "success" : "You have traded your <mypokemon> for <theirpokemon>!" }
```

If you do not have the passed `mypokemon` in your Pokedex table, you should return a 400 error
code with following message in JSON format:

```json
{ "error" : "<mypokemon> not found in your Pokedex." }
```
Otherwise, if you already have the passed `theirpokemon` in your Pokedex, you should return a 400
error code with the following message in JSON format:

```json
{ "error" : "You have already found <theirpokemon>." }
```

If either error occurs, your table should not be changed as a result. For any case, `<mypokemon>`
and `<theirpokemon>` in the JSON response should be replaced with the respective query parameter
values (maintaining letter-casing).

### **Endpoint 7: Renaming a Pokemon in your Pokedex**

**Request Format:** `pokedex/update`

**Request Type:** POST

**Request Parameters**:
  * `name` - name of Pokemon to rename
  * `nickname` (optional) - new nickname to give to Pokemon

**Returned Data Format:** JSON

**Description:** Your service should update a Pokemon in your Pokedex table with the given `name` (case-insensitive)
parameter to have the given `nickname` (overwriting any previous nicknames)
* If missing the `nickname` POST parameter, the Pokemon's nickname should be replace with the UPPERCASE
version of the Pokemon's name (similar to the case in `pokemen/insert`).
  * So for example, if passed
`name` of `bulbasSAUR` (given you have a Bulbasaur in the table) and no `nickname` parameter is
given, any previous nickname should be replaced with `BULBASAUR`.

**Example Output:**
Upon success, you should return a JSON result in the format:

```json
{ "success" : "Your <name> is now named <nickname>!" }
```
If you are not passed a nickname, your success message
should then use the uppercase version of the pokemon's name for the nickname (i.e. `BULBASAUR`
as the format for `<nickname>`).

If you do not have the Pokemon with the passed `name` in your Pokedex, you should return an error
as in the same case for `pokedex/delete`.

# Development Strategies

### SQL
This homework should give you a lot of experience using the mysql program to keep track of what changes are
being made to your database.

* Test basic versions of your queries in the phpMyAdmin SQL tab or mysql terminal before
putting them into your `js` file.
* Get your database setup, implement `setup.sql` and practice making some database SELECT, INSERT,
UPDATE, DELETE queries in the phpMyAdmin SQL command box or the mysql terminal

### Testing Your Web Service
The provided front end (`main.html`/`main.min.js`) for this homework is NOT a good
testing program. It assumes that your code works, and makes many calls against your code in quick
succession. We STRONGLY encourage you not to use this as a testing program, but more for a fun application using your final work.

Instead we encourage you to call your JS functions with other testing strategies before trying to use your code in concert with
the provided front-end files.

For `GET` requests the easiest thing to do is simply use a browser to visit the URL and pass the query params.

For the `POST` endpoints supported by your webservice, there are a few strategies we recommend, since
it's harder to simulate `POST` requests than `GET` requests. Here are some options:
* Make a dummy HTML page that lets you write JS fetch commands for POSTS, or use the JS console
(`tester.html`/`tester.js` is an example of this)
* Make a dummy HTML page with a form that submits to your Node.js app.
* Use a program like [Postman](https://www.getpostman.com/) to craft
POST requests against your API.
* One other way is to test with `GET`, and change to `POST` after you are satisfied that it works. However, you should still test that the `POST` works before you turn your homework in, and for this reason, we encourage you to use another testing strategy to get into the flow of actually testing POSTs.

## Internal Requirements
For full credit, your page must not only match the external requirements listed above, but must also
demonstrate good use of JavaScript and SQL and overall code quality. This includes the following requirements:
* Your code in `setup.sql` should be valid MySQL as covered in lecture/section/lab. That is, importing it in phpMyAdmin (on another computer) in a `hw5db` databse should not result in any errors.
* Your code in `setup.sql` **must** code that **you wrote yourself** and were not generated by exporting from phpMyAdmin or the like.
* Your webservice should correctly set the content type with either `res.type` or `res.json` _before_ outputting any response, and should only set this when necessary (it's common for students to set this multiple times and overwrite content types).
* Decompose the endpoints of your webservice by writing smaller, more generic functions that complete one task rather than a few larger "do-everything" functions - no function should be more than 30 lines of code. Capture common operations as functions to keep code size and complexity from growing. **You are required to define at least one helper function for each of the endpoints** with the exception of the `/credentials` endpoint. These functions must be distinct  (calling the same function from multiple endpoints does not count).
* You must use the ensure that a users can not inject malicious SQL into your database by properly sanitizing any insert, delete and update queries that use POST parameters sent by a client.
* filter informatin from all `POST` requests with `multer` on the server side. 
* Do not define variables, parameters, or functions that are never used.
* Do not pass the `res` or `req` objects as arguments to functions. Prefer pulling out other substantial operations into helper functions
* `app.use(express.static("public"))` should be located at the bottom of your Node app right above the PORT that is being listened to.
* You should always be using a `try`/`catch` block to handle any possible errors that arise with `async`/`await` and pending promises.
* There should be no hanging connections to the database including in the case where an error occurred (whether it's a request error or a server error)
* Similar to client side JS, use `===` over `==` for strict equality checks.
* Your files should demonstrate consistent and readable source code aesthetics as demonstrated in class and detailed in the [CSE 154 Code Quality Guidelines](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/). Part of your grade will come from using consistent indentation, proper naming conventions, curly brace locations, etc.
* In your Node.js file, your file header comment should provide a descriptive summary of the web service and description of all endpoints (endpoint format, parameters, response content type, and possible errors). This file comment should be more descriptive than other JS file comments since you are not providing an APIDOC.
* Each endpoint should also be briefly commented with 1-2 sentences having similar expectations of a function comment (but without `@param` or `@return`)
* Use JSDoc to properly document all of your JS functions with a description of the function as well as `@param` and `@return` where necessary.
* Use consistent spacing and indentation with your SQL code (see [SQL Whitespace and Indentation](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/sql/#new-line) in the Code
  Quality Guide)
* For your database, table, and columns, you must follow the naming conventions specified in the Database Setup part of this spec.
* Do not include any files in your final repository other than those outlined in "Final Deliverables and Provided Files"

## Grading
This assignment will be out of 30 points. The key areas we will be looking at assess directly relate
to the learning objectives, and your matching the specification for the external behavior as well as
the internal correctness of your code. **NOTE:** While we can not guarantee the same distribution of
points, past rubrics have been split with 60% of the points allocated to external correctness and
the 35% for internal. Thus a **potential** rubric **might be** summarized as:

### External Correctness (60-65%)
* Proper database setup
* Web Services
  * player credentials
  * getting pokedex data
  * adding pokedex data
  * removing pokedex data
  * trading pokedex data
  * renaming pokemon
  * error-handling

### Internal Correctness (30-40%)
* Node.js
  * Follows CSE 154 Code Quality Guidelines
  * Avoids redundancy, uses functions to encapsulate functionality, and factors out shared
    behavior using functions
  * All functions are documented well including parameters and return values
  * Sets header types appropriately before output
* `setup.sql` works as expected.
* Otherwise good quality code - a catch all for things like indentation, good identifier names, long lines, etc.

### Documentation (3-7%)
* Descriptive file documentation as demonstrated in course provided materials
  * Server-side JS: name, date, section, descriptive summary of file and description of all endpoints (format, parameters, response content type, and possible errors) in the header comment and comments for each of the endpoints.

## Academic Integrity
All work submitted for your CSE 154 homework assignments must be your own and should not be shared with other students. This includes but is not limited to:
* You may not use code directly from any external sources (no copying and pasting from external sites), other than templates that are explicitly given to students for use in class.
* We expect that the homework you submit is your own work and that you do not receive any inappropriate help from other people or provide inappropriate help to others.
* You must not place your solution to a publicly-accessible web site, neither during nor after the school quarter is over.

Doing any of the above is considered a violation of our course [academic integrity](https://courses.cs.washington.edu/courses/cse154/19au/syllabus/syllabus.html#academic-conduct)
policy. As a reminder, this page states:

  The Paul G Allen School has an entire page on
  [Academic Misconduct](https://www.cs.washington.edu/academics/misconduct) within the context of
  Computer Science, and the University of Washington has an entire page on how
  [Academic Misconduct](https://www.washington.edu/cssc/for-students/academic-misconduct/) is
  handled on their
  [Community Standards and Student Conduct](https://www.washington.edu/cssc/) Page. Please acquaint
  yourself with both of those pages, and in particular how academic misconduct will be reported to
  the University.
