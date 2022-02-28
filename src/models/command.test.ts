import { describe, expect, it } from "vitest"
import { createCommandSequence, isValidCommandSequence } from "./command"

describe("Command checks", () => {
  it("Shows that an empty command is valid", () => {
    const command = ""
    const isValid = isValidCommandSequence(command)
    expect(isValid).toBe(true)
  })

  it("Shows that a valid command is valid", () => {
    const command = "FRL"
    const isValid = isValidCommandSequence(command)
    expect(isValid).toBe(true)
  })

  it("Shows that an invalid command is invalid", () => {
    const command = "ABCD"
    const isValid = isValidCommandSequence(command)
    expect(isValid).toBe(false)
  })

  it("Doesn't transform a command correctly formatted", () => {
    const command = "FRL"
    const sequence = createCommandSequence(command)
    expect(sequence).toBe(command)
  })

  it("Transforms to uppercase a lowercase command", () => {
    const command = "frl"
    const sequence = createCommandSequence(command)
    expect(sequence).toBe(command.toUpperCase())
  })

  it("Removes invalid commands from a command sequence", () => {
    const command = "FRLBB"
    const sequence = createCommandSequence(command)
    expect(sequence).toBe(command.replace(/[^FRL]/g, ""))
  })
})
