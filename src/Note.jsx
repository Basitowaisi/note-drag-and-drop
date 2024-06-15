import { forwardRef } from "react"

function Note({ content, initialPosition, ...rest }, ref) {
  return (
    <div
      ref={ref}
      {...rest}
      style={{
        position: "absolute",
        left: `${initialPosition?.x}px`,
        top: `${initialPosition?.y}px`,
        border: "1px solid whitesomke",
        userSelect: "none",
        padding: "1rem 2rem",
        maxWidth: "200px",
        cursor: "move",
        backgroundColor: "lightyellow",
      }}
    >
      📌 {content}
    </div>
  )
}

export default forwardRef(Note)
