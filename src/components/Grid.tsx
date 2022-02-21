import React from "react"

import { GridType } from "../models/grid"
import { RoverPosition } from "../models/rover"

import "./Grid.css"

const GridCell: React.FC<{ isObstacle: boolean }> = ({ isObstacle }) => {
  return isObstacle ? <span>⬛</span> : <span>⬜</span>
}

const RoverCell: React.FC<RoverPosition> = ({ x, y, direction }) => {
  return (
    <span
      data-rover
      style={{
        transform: `rotate(${direction}deg)`,
      }}
    >
      🤖
    </span>
  )
}

const Grid: React.FC<{ grid: GridType; rover: RoverPosition }> = ({
  grid,
  rover,
}) => {
  const isRover = (x: number, y: number) => x === rover.x && y === rover.y
  return (
    <pre className="App-grid">
      <code>
        {grid.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((isObstacle, j) =>
              isRover(i, j) ? (
                <RoverCell key={`${i}-${j}`} {...rover} />
              ) : (
                <GridCell key={`${i}-${j}`} isObstacle={isObstacle} />
              )
            )}
            <br />
          </React.Fragment>
        ))}
      </code>
    </pre>
  )
}

export default Grid
