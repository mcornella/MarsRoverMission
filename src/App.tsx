import React, { useState } from 'react'
import './App.css'

enum Direction {
  N = 0,
  E = 90,
  S = 180,
  W = 270
}

type RoverType = {
  x: number,
  y: number,
  direction: Direction
}

type GridType = boolean[][]

const GridCell: React.FC<{isObstacle: boolean}> = ({ isObstacle }) => {
  return isObstacle ? <span>⬛</span> : <span>⬜</span>
}

const RoverCell: React.FC<RoverType> = ({ x, y, direction }) => {
  return <span data-rover style={{
    transform: `rotate(${direction}deg)`
  }}>🤖</span>
}

const Grid: React.FC<{ grid: GridType, rover: RoverType }> = ({ grid, rover }) => {
  const isRover = (x: number, y: number) => x === rover.x && y === rover.y
  return (
    <pre className="App-grid">
      <code>{grid.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((isObstacle, j) => (
            isRover(i, j)
            ? <RoverCell key={`${i}-${j}`} {...rover} />
            : <GridCell key={`${i}-${j}`} isObstacle={isObstacle} />
          ))}
          <br />
        </React.Fragment>
      ))}
      </code>
    </pre>
  )
}

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

const App: React.FC<{}> = () => {
  const [gridSize, setGridSize] = useState(10)
  const [rover, setRover] = useState({
    x: 5,
    y: 0,
    direction: Direction.N
  })
  const direction = Object.entries(Direction).reduce((res, [key, val]) => val === rover.direction ? key : res, '')

  const [command, setCommand] = useState("")

  const [grid, setGrid] = useState(newGrid({ gridSize, rover }))

  function changeRover(event: React.ChangeEvent<HTMLFormElement>) {
    const { name, value } = event.target

    switch (name) {
      case "direction":
        if (!Object.keys(Direction).includes(value)) return
        setRover({ ...rover, direction: Direction[value as keyof typeof Direction] })
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
      case "command":
        let command = value.toUpperCase().replaceAll(/[^FRL]/g, "")
        event.target.value = command
        setCommand(command)
        break
    }
  }

  function simulate() {
    if (command.length === 0) return

    let { x, y, direction } = rover
    let sequence = command.split('')

    for (let i = 0; i < sequence.length; i++) {
      switch (sequence[i]) {
        case 'F': break
        case 'L':
          direction = direction - 90
          if (direction < 0) direction += 360
          break
        case 'R':
          direction = (direction + 90) % 360
          if (direction >= 360) direction -= 360
          break
      }

      setRover({ ...rover, direction })

      switch (direction) {
        case Direction.N: x--; break
        case Direction.S: x++; break
        case Direction.W: y--; break
        case Direction.E: y++; break
      }

      if (grid[x][y]) {
        setTimeout(() => alert('Obstacle encountered!', 0))
        return
      }

      setRover({ x, y, direction })
    }
  }

  return (
    <div className="App">
      <div className="App-controls">
        <div className="App-controls__buttons">
          <button onClick={() => setGrid(newGrid({ gridSize, rover }))}>New grid</button>
          <button onClick={() => simulate()}>Simulate</button>
        </div>
        <form className="App-controls__rover" onChange={changeRover}>
          <fieldset>
            <legend>Rover</legend>
            <label>X: <input name="x" type="number" min={0} max={gridSize - 1} defaultValue={rover.x} /></label>
            <label>Y: <input name="y" type="number" min={0} max={gridSize - 1} defaultValue={rover.y} /></label>
            <br />
            <label>Direction</label>
            <select name="direction" value={direction}>
              <option value="N">North</option>
              <option value="E">East</option>
              <option value="S">South</option>
              <option value="W">West</option>
            </select>
            <br />
            <label>Command<br /><input type="text" name="command" autoComplete="off" placeholder="Valid instructions: F, R or L" /></label>
          </fieldset>
        </form>
      </div>
      <Grid grid={grid} rover={rover} />
    </div>
  )
}

export default App
