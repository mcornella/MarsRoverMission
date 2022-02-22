import React, { useEffect, useRef } from "react"
import { ObstacleEncounteredError, OutOfBoundsError } from "../models/error"

import "./ErrorPrompt.css"

const ErrorPrompt: React.FC<{ error: Error | null; clear: Function }> = ({
  error,
  clear,
}) => {
  if (!error) return null

  const promptRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    promptRef.current?.focus()
  })

  let message = <p>{error.message}</p>

  if (error instanceof OutOfBoundsError) {
    message = (
      <>
        <p>Rover would move out of bounds at</p>
        <p>
          <strong>
            [{error.position.x}, {error.position.y}]
          </strong>
        </p>
      </>
    )
  } else if (error instanceof ObstacleEncounteredError) {
    message = (
      <>
        <p>Rover encountered an obstacle at</p>
        <p>
          <strong>
            [{error.position.x}, {error.position.y}]
          </strong>
        </p>
      </>
    )
  }

  return (
    <div
      className="App-error"
      ref={promptRef}
      tabIndex={-1}
      onBlur={() => clear()}
    >
      <div className="App-error__border">{message}</div>
    </div>
  )
}

export default ErrorPrompt
