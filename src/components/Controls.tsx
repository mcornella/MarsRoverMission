import React from "react"

import { Command, createCommandSequence } from "../models/command"
import { Direction, RoverPosition } from "../models/rover"

import "./Controls.css"

const Controls: React.FC<{
  rover: { position: RoverPosition; set: Function }
  grid: {
    size: number
    set: Function
    new: Function
  }
  sequence: { value: string; set: Function; run: Function }
}> = ({ rover, grid, sequence }) => {
  // Common onChange event handler for form inputs
  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    event.preventDefault()

    const { name, value } = event.target

    const handler: Record<string, Function> = {
      "grid-size": () => {
        const size = parseInt(value, 10)
        if (size < 1 || size > 300) return
        grid.set(size)
      },
      direction: () => {
        // Only continue on valid values for direction
        if (!(value in Direction)) return
        rover.set({
          ...rover.position,
          direction: Direction[value as keyof typeof Direction],
        })
      },
      x: () => {
        const x = parseInt(value, 10)
        if (x < 0 || x >= grid.size) return
        rover.set({ ...rover.position, x })
      },
      y: () => {
        const y = parseInt(value, 10)
        if (y < 0 || y >= grid.size) return
        rover.set({ ...rover.position, y })
      },
      sequence: () => {
        // Remove invalid characters from input value
        const cmd = createCommandSequence(value)
        // Rewrite input value with valid command
        event.target.value = cmd
        sequence.set(cmd)
      },
    }

    if (handler.hasOwnProperty(name)) handler[name]()
  }

  // Convert Arrow key presses to valid commands and react run sequence on Enter
  const onCommandSequenceKeyDown: React.KeyboardEventHandler<
    HTMLInputElement
  > = (event) => {
    const keyHandler: Record<typeof event.key, Function> = {
      Enter() {
        sequence.run()
      },
      ArrowUp() {
        sequence.set(sequence.value + Command.Forward)
      },
      ArrowLeft() {
        sequence.set(sequence.value + Command.Left)
      },
      ArrowRight() {
        sequence.set(sequence.value + Command.Right)
      },
    }

    if (!keyHandler.hasOwnProperty(event.key)) return

    keyHandler[event.key]()

    // Scroll input content to last character
    const input = event.target as HTMLInputElement
    input.scrollLeft = input.scrollWidth

    event.preventDefault()
  }

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
          <button type="button" onClick={() => grid.new()}>
            New
          </button>
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
          <label>Direction</label>
          <select
            name="direction"
            value={rover.position.direction}
            onChange={onChange}
          >
            {Object.entries(Direction).map(([key, val]) => (
              <option key={key} value={val}>
                {key}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <legend>Command sequence</legend>
          <input
            type="text"
            name="sequence"
            autoComplete="off"
            placeholder="Valid instructions: F, R or L"
            value={sequence.value}
            onChange={onChange}
            onKeyDown={onCommandSequenceKeyDown}
          />
          <button type="button" onClick={() => sequence.run()}>
            Run
          </button>
        </fieldset>
      </form>
    </div>
  )
}

export default Controls
