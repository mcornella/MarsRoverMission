import { assert, describe, expect, it } from "vitest"
import { GridType, hasObstacle, isOutOfBounds, randomGrid } from "./grid"
import { Direction, RoverPosition } from "./rover"

describe("Grid checks", () => {
  it("Returns out of bounds on an empty grid", () => {
    const grid = [[]]
    const outOfBounds = isOutOfBounds(grid, { x: 0, y: 0 })
    expect(outOfBounds).toBe(true)
  })

  it("Returns out of bounds in all directions", () => {
    const grid = [[false]]

    assert(grid.length === 1)
    assert(grid[0].length === 1)

    for (const point of [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ]) {
      const outOfBounds = isOutOfBounds(grid, point)
      expect(outOfBounds).toBe(true)
    }
  })

  it("Doesn't show there's an obstacle in an empty grid", () => {
    const grid = [[]]
    const obstacleFound = hasObstacle(grid, { x: 0, y: 0 })
    expect(obstacleFound).toBe(false)
  })

  it("Shows there's an obstacle correctly", () => {
    const grid = [[true]]
    const obstacleFound = hasObstacle(grid, { x: 0, y: 0 })
    expect(obstacleFound).toBe(true)
  })
})

describe("Random grid creation", () => {
  it("Returns an error creating a grid of invalid size", () => {
    const rover: RoverPosition = { x: 0, y: 0, direction: Direction.North }

    expect(() => randomGrid({ rover, gridSize: 0 })).toThrowError()
    expect(() => randomGrid({ rover, gridSize: -1 })).toThrowError()
  })

  it("Returns an error creating a grid with invalid obstacle probability", () => {
    const args = {
      gridSize: 1,
      rover: { x: 0, y: 0, direction: Direction.North },
    }

    for (const obstacleProbability of [-1, 1.000001, 2]) {
      expect(() => randomGrid({ ...args, obstacleProbability })).toThrowError()
    }
  })

  it("Does not return an error creating a grid with valid obstacle probability", () => {
    const args = {
      gridSize: 1,
      rover: { x: 0, y: 0, direction: Direction.North },
    }

    for (const obstacleProbability of [0, 1]) {
      expect(() =>
        randomGrid({ ...args, obstacleProbability })
      ).not.toThrowError()
    }
  })

  it("Returns a grid of specified size", () => {
    const gridSize = 3
    const grid = randomGrid({
      gridSize,
      rover: { x: 0, y: 0, direction: Direction.North },
    })
    expect(grid.length).toBe(gridSize)
    expect(grid.every((row) => row.length === gridSize)).toBe(true)
  })

  it("Returns a grid with no obstacles on probability = 0", () => {
    const expectedGrid: GridType = [[false]]
    const grid = randomGrid({
      gridSize: 1,
      rover: { x: -1, y: -1, direction: Direction.North },
      obstacleProbability: 0,
    })
    expect(grid).toMatchObject(expectedGrid)
  })

  it("Returns a grid with only obstacles on probability = 1", () => {
    const expectedGrid: GridType = [[true]]
    const grid = randomGrid({
      gridSize: 1,
      rover: { x: -1, y: -1, direction: Direction.North },
      obstacleProbability: 1,
    })
    expect(grid).toMatchObject(expectedGrid)
  })

  it("Returns a grid with no obstacle on rover position", () => {
    const expectedGrid: GridType = [[false]]
    const grid = randomGrid({
      gridSize: 1,
      rover: { x: 0, y: 0, direction: Direction.North },
      obstacleProbability: 1,
    })
    expect(grid).toMatchObject(expectedGrid)
  })
})
