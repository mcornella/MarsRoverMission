# Mars Rover Mission

## The task

You’re part of the team that explores Mars by sending remotely controlled vehicles to the surface
of the planet. Develop a software that translates the commands sent from earth to instructions
that are understood by the rover.

### Requirements

- You are given the initial starting point (x,y) of a rover and the direction (N,S,E,W) it is facing.
- The rover receives a collection of commands, e.g. `FFRRFFFRL`
- The rover can move forward (F).
- The rover can move left/right (L,R).
- Suppose we are on a really weird planet that is square. 200x200 for example :)
- Implement obstacle detection before each move to a new square. If a given
  sequence of commands encounters an obstacle, the rover moves up to the last
  possible point, aborts the sequence and reports the obstacle.

## Take into account

Rovers are expensive, make sure the software works as expected.

---------------------------------------------------------------------------------------------------

## Stack

- vite
- React
- TypeScript
- vitest for testing

## Getting started

First, run `npm install` to install all the dependencies.

Then:

- Run `npm run dev` to start the development server in watch mode
- Run `npm run build` to build the production version
- Run `npm run test` to run the tests in watch mode
