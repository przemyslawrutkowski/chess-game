# Just Chess

## Introduction

Just Chess is an online chess game that allows you to play chess against opponents from around the world.

## What Is Implemented

* Chess Mechanics
    * Movement Rules
    * Special Moves
        * Pawn Promotion
        * Castling
        * En Passant
    * Game State Checks:
        * Check
        * Checkmate
        * Stalemate
        * Insufficient Material
    * Turn Management
* Multiplayer Features
    * Matchmaking
    * Skipping Opponents
    * Disconnecting
* Responsive Design

## Technologies

* Node.js
* TypeScript
* Socket.IO
* HTML/CSS

## How To Run

1. Clone the repository: `git clone https://github.com/przemyslawrutkowski/chess-game.git`
2. Navigate into the project directory: `cd chess-game`
3. Install required dependencies in each part of the project (backend, frontend, shared):
    1. `cd project_part`
    2. `npm install`
4. Run the Typescript compiler in each part of the project (backend, frontend, shared):
    1. `npx tsc`
5. Run the main script (from root directory): `node ./backend/dist/backend/src/server.js`
6. Open `localhost:5000` in a browser.
