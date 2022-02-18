import React, { useState } from 'react'
import './App.css'

enum Direction {
  N = "N",
  S = "S",
  W = "W",
  E = "E"
}

type RoverType = {
  x: number,
  y: number,
  direction: Direction
}

type GridType = boolean[][]

const newGrid = ({
  gridSize,
  rover,
  obstacleProbability = 0.15
} : {
  gridSize: number,
  rover: RoverType,
  obstacleProbability?: number
}) => {
  if (gridSize < 1) throw new Error('Grid size must be greater than 0')
  if (obstacleProbability < 0 || obstacleProbability >= 1) throw new Error('Obstacle probability must be between 0 and 1')

  const newObstacle = (x: number, y: number) => x != rover.x && y != rover.y && Math.random() < obstacleProbability

  return Array(gridSize).fill([]).map((_, i) => Array(gridSize).fill(false).map((_, j) => newObstacle(i, j)))
}

const GridCell: React.FC<{isObstacle: boolean}> = ({ isObstacle }) => {
  return isObstacle ? <span>⬛</span> : <span>⬜</span>
}

const RoverCell: React.FC<RoverType> = ({ x, y, direction }) => {
  return <span data-rover data-direction={direction}>🤖</span>
}

const Grid: React.FC<{ grid: GridType, rover: RoverType }> = ({ grid, rover }) => {
  const isRover = (x: number, y: number) => x === rover.x && y === rover.y
  return (
    <pre className="App-grid">
      <code>{grid.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((isObstacle, j) => (
            isRover(i, j)
            ? <RoverCell key={j} {...rover} />
            : <GridCell key={j} isObstacle={isObstacle} />
          ))}
          <br />
        </React.Fragment>
      ))}
      </code>
    </pre>
  )
}

const App: React.FC<{}> = () => {
  const [gridSize, setGridSize] = useState(10)
  const [rover, setRover] = useState({
    x: 5,
    y: 0,
    direction: Direction.N
  })
  const [grid, setGrid] = useState(newGrid({ gridSize, rover }))

  function changeRover(event: React.ChangeEvent<HTMLFormElement>) {
    const { name, value } = event.target

    switch (name) {
      case "direction":
        if (!Object.values(Direction).includes(value)) return
        setRover({ ...rover, direction: value as RoverType["direction"] })
        break
      case "x":
        let x = parseInt(value, 10)
        if (x < 0 || x >= gridSize) return
        setRover({ ...rover, x })
        break
      case "y":
        let y = parseInt(value, 10)
        if (y < 0 || y >= gridSize) return
        setRover({ ...rover, y })
        break
    }
  }

  return (
    <div className="App">
      <div className="App-controls">
        <button onClick={() => setGrid(newGrid({ gridSize, rover }))}>New grid</button>
        <form className="App-controls__rover" onChange={changeRover}>
          <fieldset>
            <legend>Rover</legend>
            <label>X: <input name="x" type="number" min={0} max={gridSize - 1} defaultValue={rover.x} /></label>
            <label>Y: <input name="y" type="number" min={0} max={gridSize - 1} defaultValue={rover.y} /></label>
            <br />
            <label>Direction</label>
            <select name="direction">
              <option value="N">North</option>
              <option value="E">East</option>
              <option value="S">South</option>
              <option value="W">West</option>
            </select>
          </fieldset>
        </form>
      </div>
      <Grid grid={grid} rover={rover} />
    </div>
  )
}

export default App
