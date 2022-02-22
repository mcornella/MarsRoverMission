import React from "react"

import { GridType, hasObstacle } from "../models/grid"
import { RoverPosition } from "../models/rover"

import "./Grid.css"

const GridCell: React.FC<{ isObstacle: boolean; willBeVisited: boolean }> = ({
  isObstacle,
  willBeVisited,
}) => {
  return isObstacle ? (
    <span data-obstacle data-future-visit={willBeVisited || null}>
      🪨
    </span>
  ) : (
    <span data-future-visit={willBeVisited || null}>⬜</span>
  )
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

const Grid: React.FC<{
  grid: GridType
  rover: RoverPosition
  futurePath: RoverPosition[]
}> = ({ grid, rover, futurePath }) => {
  const isRover = (x: number, y: number) => x === rover.x && y === rover.y
  const willBeVisited = (x: number, y: number) =>
    futurePath.some((f) => f.x === x && f.y === y)
  return (
    <pre className="App-grid">
      <code>
        {grid.map((row, x) => (
          <React.Fragment key={x}>
            {row.map((_, y) =>
              isRover(x, y) ? (
                <RoverCell key={`${x}-${y}`} {...rover} />
              ) : (
                <GridCell
                  key={`${x}-${y}`}
                  isObstacle={hasObstacle(grid, { x, y })}
                  willBeVisited={willBeVisited(x, y)}
                />
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
