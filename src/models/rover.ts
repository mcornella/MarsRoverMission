import { GridType } from "./grid"

export enum Direction {
  N = 0,
  E = 90,
  S = 180,
  W = 270,
}

export type RoverPosition = {
  x: number
  y: number
  direction: Direction
}

export const runCommand = (grid: GridType, rover: RoverPosition, command: string): { position: RoverPosition; error?: Error } => {
  if (command.length === 0) return {
    position: rover,
    error: new Error(`Empty command!`)
  }

  if (/[^FRL]/.test(command)) return {
    position: rover,
    error: new Error(`Invalid sequence: ${command}`)
  }

  let position = rover
  let sequence = command.split("")
  for (let i = 0; i < sequence.length; i++) {
    let result = move(grid, position, sequence[i] as 'F' | 'L' | 'R')

    if (result.error) return result
    else position = { ...result.position }
  }

  return { position }
}

const move = (grid: GridType, rover: RoverPosition, cmd: 'F' | 'L' | 'R'): { position: RoverPosition; error?: Error } => {
  let { x, y, direction } = rover

  switch (cmd) {
    case "F":
      break
    case "L":
      direction = direction - 90
      if (direction < 0) direction += 360
      break
    case "R":
      direction = (direction + 90) % 360
      if (direction >= 360) direction -= 360
      break
  }

  switch (direction) {
    case Direction.N:
      x--
      break
    case Direction.S:
      x++
      break
    case Direction.W:
      y--
      break
    case Direction.E:
      y++
      break
  }

  if (x < 0 || x >= grid.length || y < 0 || y >= grid.length) {
    return {
      position: { ...rover, direction },
      error: new Error(`Out of bounds at (${x}, ${y})`),
    }
  }

  if (grid[x][y]) {
    return {
      position: { ...rover, direction },
      error: new Error(`Obstacle encountered at (${x}, ${y})!`),
    }
  }

  return {
    position: { x, y, direction },
  }
}
