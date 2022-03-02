import React from "react"

import { GridType, hasObstacle } from "../models/grid"
import { RoverPosition } from "../models/rover"

import "./Grid.css"

const GridCell: React.FC<{ isObstacle: boolean; visited: number }> = ({
  isObstacle,
  visited,
}) => {
  const style = {
    ["--brightness" as any]: 0.95 ** visited,
  }
  return isObstacle ? (
    <span data-obstacle data-visited={visited > 0 ? visited : undefined}>
      🪨
    </span>
  ) : (
    <span
      data-visited={visited > 0 ? visited : undefined}
      style={visited > 0 ? style : undefined}
    >
      ⬜
    </span>
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
  const visits = (x: number, y: number) =>
    futurePath.filter((path) => path.x === x && path.y === y).length
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
                  visited={visits(x, y)}
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
