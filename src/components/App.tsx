import React, { useState } from "react"

import {
  createCommandSequence,
  isValidCommandSequence,
} from "../models/command"
import { randomGrid } from "../models/grid"
import { Direction, runCommandSequence } from "../models/rover"

import Controls from "./Controls"
import Grid from "./Grid"
import "./App.css"

const App: React.FC<{}> = () => {
  const [gridSize, setGridSize] = useState(10)
  const [rover, setRover] = useState({ x: 5, y: 5, direction: Direction.N })
  const [sequence, setCommandSequence] = useState("")
  const [grid, setGrid] = useState(randomGrid({ gridSize, rover }))

  function simulate() {
    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Run command and get position and possible error
    const { position, error } = runCommandSequence(grid, rover, sequence)

    // Update rover position
    setRover(position)

    // If an error was returned, show it after React has finished rendering
    if (error) {
      setTimeout(() => alert(error.message), 0)
    }
  }

  return (
    <div className="App">
      <Controls
        rover={{ position: rover, set: setRover }}
        sequence={{ value: sequence, set: setCommandSequence, run: simulate }}
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
