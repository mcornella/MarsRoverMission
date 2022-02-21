import React, { useState } from "react"

import Controls from "./Controls"
import Grid, { newGrid } from "./Grid"
import "./App.css"

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

const App: React.FC<{}> = () => {
  const [gridSize, setGridSize] = useState(10)
  const [rover, setRover] = useState({
    x: 5,
    y: 5,
    direction: Direction.N,
  })
  const [command, setCommand] = useState("")
  const [grid, setGrid] = useState(newGrid({ gridSize, rover }))

  function simulate() {
    if (command.length === 0) return

    let { x, y, direction } = rover
    let sequence = command.split("")

    for (let i = 0; i < sequence.length; i++) {
      switch (sequence[i]) {
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

      setRover({ ...rover, direction })

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

      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
        setTimeout(() => alert(`Out of bounds at (${x}, ${y})`), 0)
        return
      }

      if (grid[x][y]) {
        setTimeout(() => alert(`Obstacle encountered at (${x}, ${y})!`), 0)
        return
      }

      setRover({ x, y, direction })
    }
  }

  return (
    <div className="App">
      <Controls
        rover={{ position: rover, set: setRover }}
        command={{ set: setCommand, run: simulate }}
        grid={{
          size: gridSize,
          set: setGridSize,
          new: () => setGrid(newGrid({ gridSize, rover })),
        }}
      />
      <Grid grid={grid} rover={rover} />
    </div>
  )
}

export default App
