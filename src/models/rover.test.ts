import { assert, describe, expect, it } from "vitest"

import { Command } from "./command"
import { hasObstacle } from "./grid"
import { Direction, runCommandSequence } from "./rover"

describe("Command runner", () => {
  const grid = [[false]]
  const rover = {
    x: 0,
    y: 0,
    direction: Direction.E,
  }

  it("Shows error on empty command", () => {
    const command = ""
    const { error } = runCommandSequence(grid, rover, command)
    expect(error).not.toBeUndefined()
  })

  it("Shows error on invalid command", () => {
    const command = "ABCD"
    const { error } = runCommandSequence(grid, rover, command)
    expect(error).not.toBeUndefined()
  })

  it("Shows error on moving outside grid", () => {
    const command = Command.Forward

    // Assert that a Forward command will move outside the grid
    assert(grid.length === 1)

    // Moving in any direction outside the grid should result in an error
    for (const direction of [
      Direction.N,
      Direction.S,
      Direction.W,
      Direction.E,
    ]) {
      const { error } = runCommandSequence(
        grid,
        {
          x: 0,
          y: 0,
          direction,
        },
        command
      )
      expect(error).not.toBeUndefined()
    }
  })

  it("Shows error on moving to a cell with an obstacle", () => {
    const grid = [
      [false, true],
      [false, false],
    ]

    const rover = {
      x: 0,
      y: 0,
      direction: Direction.E,
    }

    const command = Command.Forward

    // Assert that a Forward command will move to an obstacle
    assert(rover.x === 0)
    assert(rover.y === 0)
    assert(rover.direction === Direction.E)
    assert(hasObstacle(grid, { x: 0, y: 1 }))

    const { error } = runCommandSequence(grid, rover, command)
    expect(error).not.toBeUndefined()
  })

  it("Shows error on moving to a cell with an obstacle with updated direction", () => {
    const grid = [
      [false, true],
      [false, false],
    ]

    const rover = {
      x: 0,
      y: 0,
      direction: Direction.N,
    }

    const command = Command.Right

    // Assert that a Right command will move to an obstacle
    assert(rover.x === 0)
    assert(rover.y === 0)
    assert(rover.direction === Direction.N)
    assert(hasObstacle(grid, { x: 0, y: 1 }))

    const { position, error } = runCommandSequence(grid, rover, command)
    expect(error).not.toBeUndefined()
    expect(position.direction).toBe(Direction.E)
  })

  it("Moves forward 1 cell on Forward", () => {
    const grid = [
      [false, true],
      [false, false],
    ]

    const rover = {
      x: 0,
      y: 0,
      direction: Direction.S,
    }

    const command = Command.Forward

    const { position, error } = runCommandSequence(grid, rover, command)
    expect(error).toBeUndefined()
    expect(position).toMatchObject({
      ...rover,
      x: rover.x + 1,
    })
  })

  it("Moves right 1 cell on Right", () => {
    const grid = [
      [false, true],
      [false, false],
    ]

    const rover = {
      x: 0,
      y: 0,
      direction: Direction.E,
    }

    const command = Command.Right

    const { position, error } = runCommandSequence(grid, rover, command)
    expect(error).toBeUndefined()
    expect(position).toMatchObject({
      ...rover,
      x: rover.x + 1,
      direction: Direction.S,
    })
  })

  it("Moves left 1 cell on Left", () => {
    const grid = [
      [false, true],
      [false, false],
    ]

    const rover = {
      x: 1,
      y: 0,
      direction: Direction.E,
    }

    const command = Command.Left

    const { position, error } = runCommandSequence(grid, rover, command)
    expect(error).toBeUndefined()
    expect(position).toMatchObject({
      ...rover,
      x: rover.x - 1,
      direction: Direction.N,
    })
  })
})
