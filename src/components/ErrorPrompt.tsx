import React, { useEffect, useRef } from "react"
import { ObstacleFoundError, OutOfBoundsError } from "../models/error"

import "./ErrorPrompt.css"

const ErrorMessage: React.FC<{ error: Error }> = ({ error }) => {
  return error instanceof OutOfBoundsError ? (
    <>
      <p>Rover move out of bounds at</p>
      <p>
        <strong>
          [{error.position.x}, {error.position.y}]
        </strong>
      </p>
    </>
  ) : error instanceof ObstacleFoundError ? (
    <>
      <p>Rover found an obstacle at</p>
      <p>
        <strong>
          [{error.position.x}, {error.position.y}]
        </strong>
      </p>
    </>
  ) : (
    <p>{error.message}</p>
  )
}

const ErrorPrompt: React.FC<{ error?: Error; clear: Function }> = ({
  error,
  clear,
}) => {
  if (!error) return null

  const promptRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    promptRef.current?.focus()
  })

  return (
    <div
      className="App-error"
      ref={promptRef}
      tabIndex={-1}
      onBlur={() => clear()}
    >
      <div className="App-error__border">
        <ErrorMessage error={error} />
      </div>
    </div>
  )
}

export default ErrorPrompt
