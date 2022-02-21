import React from "react"
import { Direction, RoverPosition } from "./App"
import "./Controls.css"

const Controls: React.FC<{
  rover: { position: RoverPosition; set: Function }
  grid: {
    size: number
    set: Function
    new: Function
  }
  command: { set: Function; run: Function }
}> = ({ rover, grid, command }) => {
  // Common onChange event handler
  function onChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    event.preventDefault()

    const { name, value } = event.target

    switch (name) {
      case "grid-size":
        let size = parseInt(value, 10)
        if (size < 1 || size > 300) return
        grid.set(size)
        break
      case "direction":
        // Only continue on valid values for direction
        if (!Object.keys(Direction).includes(value)) return
        rover.set({
          ...rover.position,
          direction: Direction[value as keyof typeof Direction],
        })
        break
      case "x":
        let x = parseInt(value, 10)
        if (x < 0 || x >= grid.size) return
        rover.set({ ...rover.position, x })
        break
      case "y":
        let y = parseInt(value, 10)
        if (y < 0 || y >= grid.size) return
        rover.set({ ...rover.position, y })
        break
      case "command":
        // Remove invalid characters from input value
        let cmd = value.toUpperCase().replaceAll(/[^FRL]/g, "")
        // Rewrite input value with valid command
        event.target.value = cmd
        command.set(cmd)
        break
    }

    return false
  }

  // Transform rover direction to a valid value for the <select>
  // - rover.direction: 0, 90, 180, 270
  // - <select> value: N, E, S, W
  const direction = Object.entries(Direction).filter(
    ([, val]) => val === rover.position.direction
  )[0][0]

  return (
    <div className="App-controls">
      <form>
        <fieldset>
          <legend>Grid</legend>
            <input
              name="grid-size"
              type="number"
              min={1}
              max={300}
              value={grid.size}
              onChange={onChange}
            />
          <button type="button" onClick={() => grid.new()}>New ⟳</button>
        </fieldset>
        <fieldset className="App-controls__rover">
          <legend>Rover</legend>
          <label>
            X:{" "}
            <input
              name="x"
              type="number"
              min={0}
              max={grid.size - 1}
              value={rover.position.x}
              onChange={onChange}
            />
          </label>
          <label>
            Y:{" "}
            <input
              name="y"
              type="number"
              min={0}
              max={grid.size - 1}
              value={rover.position.y}
              onChange={onChange}
            />
          </label>
          <br />
          <label>Direction</label>
          <select name="direction" value={direction} onChange={onChange}>
            <option value="N">North</option>
            <option value="E">East</option>
            <option value="S">South</option>
            <option value="W">West</option>
          </select>
        </fieldset>
        <fieldset>
          <legend>Command</legend>
          <input
            type="text"
            name="command"
            autoComplete="off"
            placeholder="Valid instructions: F, R or L"
            onChange={onChange}
          />
          <button type="button" onClick={() => command.run()}>Run</button>
        </fieldset>
      </form>
    </div>
  )
}

export default Controls
