export enum Command {
  Forward = "F",
  Right = "R",
  Left = "L",
}

type Opaque<K, T> = T & { __TYPE__: K }
export type CommandSequence = Opaque<"CommandSequence", "string">

const regexInvalidCommandSequence = new RegExp(
  `[^${Object.values(Command).join("")}]`
)

export const isValidCommandSequence = (command: string): boolean => {
  return !regexInvalidCommandSequence.test(command)
}

export const createCommandSequence = (str: string): CommandSequence => {
  return str.toUpperCase().replaceAll(/[^FRL]/g, "") as CommandSequence
}
