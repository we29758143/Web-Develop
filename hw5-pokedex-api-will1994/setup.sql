/* This is a sql file that create a Pokedex table
 * Pokedex table includes three columns: name, nickname and datafound.
 */

DROP DATABASE IF EXISTS hw5db;

CREATE DATABASE hw5db;
USE hw5db;

DROP TABLE IF EXISTS Pokedex;

CREATE TABLE Pokedex(
  name VARCHAR(30) NOT NULL PRIMARY KEY,
  nickname VARCHAR(30),
  datefound DATETIME DEFAULT NULL
);
