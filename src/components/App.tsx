import React, { useState } from "react"

import useRoverPath from "../hooks/useRoverPath"

import { isValidCommandSequence } from "../models/command"
import { GridType, randomGrid } from "../models/grid"
import { Direction, RoverPosition, runCommandSequence } from "../models/rover"

import Controls from "./Controls"
import ErrorPrompt from "./ErrorPrompt"
import Grid from "./Grid"

import "./App.css"

const App: React.FC<{}> = () => {
  const [gridSize, setGridSize] = useState(10)
  const [rover, setRover] = useState<RoverPosition>({
    x: 5,
    y: 5,
    direction: Direction.N,
  })
  const [sequence, setCommandSequence] = useState("")
  const [grid, setGrid] = useState<GridType>(randomGrid({ gridSize, rover }))
  const [error, setError] = useState<Error | undefined>()
  const [futurePath, clearFuturePath] = useRoverPath(rover, grid, sequence)

  function simulate() {
    setCommandSequence("")
    clearFuturePath()

    // Don't run the Command Sequence if it's empty or invalid
    if (sequence.length === 0) return
    if (!isValidCommandSequence(sequence)) return

    // Run command and get position and possible error
    const { position, error } = runCommandSequence(grid, rover, sequence)

    // Update rover position
    setRover(position)

    // If an error was returned, show it after React has finished rendering
    if (error) setError(error)
  }

  return (
    <div className="App">
      <ErrorPrompt error={error} clear={() => setError(undefined)} />
      <Controls
        rover={{ position: rover, set: setRover }}
        sequence={{ value: sequence, set: setCommandSequence, run: simulate }}
        grid={{
          size: gridSize,
          set: setGridSize,
          new: () => setGrid(randomGrid({ gridSize, rover })),
        }}
      />
      <Grid
        grid={grid}
        rover={rover}
        futurePath={futurePath.map(({ position }) => position)}
      />
    </div>
  )
}

export default App
