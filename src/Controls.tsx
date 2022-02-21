import React from 'react'
import { Direction, RoverPosition } from "./App"
import './Controls.css'

const Controls: React.FC<{
  rover: { position: RoverPosition; set: Function };
  grid: {
    size: number;
    new: Function;
  };
  command: { set: Function; run: Function };
}> = ({ rover, grid, command }) => {
  // onChange event
  function onRoverChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target

    switch (name) {
      case "direction":
        if (!Object.keys(Direction).includes(value)) return
        rover.set({ ...rover.position, direction: Direction[value as keyof typeof Direction] })
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
        let cmd = value.toUpperCase().replaceAll(/[^FRL]/g, "")
        event.target.value = cmd
        command.set(cmd)
        break
    }
  }

  // Transform rover direction to a valid value for the <select>
  // - rover.direction: 0, 90, 180, 270
  // - <select> value: N, E, S, W
  const direction = Object.entries(Direction).filter(([, val]) => val === rover.position.direction)[0][0]

  return (
    <div className="App-controls">
      <div className="App-controls__buttons">
        <button onClick={() => grid.new()}>New grid</button>
        <button onClick={() => command.run()}>Simulate</button>
        </div>
      <form className="App-controls__rover">
        <fieldset>
          <legend>Rover</legend>
          <label>X: <input name="x" type="number" min={0} max={grid.size - 1} value={rover.position.x} onChange={onRoverChange} /></label>
          <label>Y: <input name="y" type="number" min={0} max={grid.size - 1} value={rover.position.y} onChange={onRoverChange} /></label>
          <br />
          <label>Direction</label>
          <select name="direction" value={direction} onChange={onRoverChange}>
            <option value="N">North</option>
            <option value="E">East</option>
            <option value="S">South</option>
            <option value="W">West</option>
          </select>
        </fieldset>
        <fieldset>
          <legend>Command</legend>
          <input type="text" name="command" autoComplete="off" placeholder="Valid instructions: F, R or L" onChange={onRoverChange} />
        </fieldset>
      </form>
    </div>
  )
}

export default Controls
