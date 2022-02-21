import React from 'react'
import { RoverPosition } from "./App"
import './Grid.css'

export type GridType = boolean[][]

export const newGrid = ({
  gridSize,
  rover,
  obstacleProbability = 0.15
} : {
  gridSize: number,
  rover: RoverPosition,
  obstacleProbability?: number
}): GridType => {
  if (gridSize < 1) throw new Error('Grid size must be greater than 0')
  if (obstacleProbability < 0 || obstacleProbability >= 1) throw new Error('Obstacle probability must be between 0 and 1')

  const newObstacle = (x: number, y: number) => x != rover.x && y != rover.y && Math.random() < obstacleProbability

  return Array(gridSize).fill([]).map((_, i) => Array(gridSize).fill(false).map((_, j) => newObstacle(i, j)))
}

const GridCell: React.FC<{isObstacle: boolean}> = ({ isObstacle }) => {
  return isObstacle ? <span>⬛</span> : <span>⬜</span>
}

const RoverCell: React.FC<RoverPosition> = ({ x, y, direction }) => {
  return <span data-rover style={{
    transform: `rotate(${direction}deg)`
  }}>🤖</span>
}

const Grid: React.FC<{ grid: GridType, rover: RoverPosition }> = ({ grid, rover }) => {
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

export default Grid
