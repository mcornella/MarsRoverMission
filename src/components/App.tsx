import React, { useState } from "react"

import { Direction, runCommand } from "../models/rover"
import { randomGrid } from "../models/grid"

import Controls from "./Controls"
import Grid from "./Grid"
import "./App.css"

const App: React.FC<{}> = () => {
  const [gridSize, setGridSize] = useState(10)
  const [rover, setRover] = useState({
    x: 5,
    y: 5,
    direction: Direction.N,
  })
  const [command, setCommand] = useState("")
  const [grid, setGrid] = useState(randomGrid({ gridSize, rover }))

  function simulate() {
    if (command.length === 0) return
    if (/[^FRL]/.test(command)) return

    // Run command and get position and possible error
    let { position, error } = runCommand(grid, rover, command)

    // Update rover position
    setRover(position)

    // If an error was returned, show it after React has finished rendering
    if (typeof error !== 'undefined') {
      setTimeout(() => alert(error?.message), 0)
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
          new: () => setGrid(randomGrid({ gridSize, rover })),
        }}
      />
      <Grid grid={grid} rover={rover} />
    </div>
  )
}

export default App
