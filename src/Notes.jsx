import { createRef, useEffect, useRef, useState } from "react"
import Note from "./Note"

function generateNewPosition() {
  // total width - note width
  const maxX = window.innerWidth - 250
  const maxY = window.innerHeight - 250

  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  }
}

function Notes({ notes = [], setNotes }) {
  const noteRefs = useRef([])
  const [note, setNote] = useState("")

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) ?? []
    const updatedNotes = notes.map((note) => {
      const savedNote = savedNotes.find((savedNote) => savedNote.id === note.id)
      if (savedNote) {
        return {
          ...note,
          position: savedNote.position,
        }
      } else {
        const position = generateNewPosition()
        return { ...note, position }
      }
    })
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }, [notes.length])

  function handleDragStart(e, note) {
    const noteRef = noteRefs.current[note.id].current
    const boundingRect = noteRef.getBoundingClientRect()
    const offsetX = e.clientX - boundingRect.left
    const offsetY = e.clientY - boundingRect.top

    const startPosition = note.position

    noteRef.style.zIndex = 100

    const handleMouseUp = (e) => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
      const finalRect = noteRef.getBoundingClientRect()
      const newPositon = { x: finalRect.left, y: finalRect.top }

      if (checkForOverlap(note.id)) {
        noteRef.style.left = `${startPosition.x}px`
        noteRef.style.top = `${startPosition.y}px`
      } else {
        updateNotePosition(note.id, newPositon)
      }

      noteRef.style.zIndex = "auto"
      noteRef.style.cursor = "move"
      noteRef.style.backgroundColor = "lightyellow"
    }

    const handleMouseMove = (e) => {
      const newX = e.clientX - offsetX
      const newY = e.clientY - offsetY
      noteRef.style.left = `${newX}px`
      noteRef.style.top = `${newY}px`

      if (checkForOverlap(note.id)) {
        noteRef.style.backgroundColor = "lightpink"
        noteRef.style.cursor = "not-allowed"
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    console.log({
      offsetX,
      offsetY,
    })
  }

  const updateNotePosition = (id, newPosition) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, position: newPosition }
      }
      return note
    })
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const checkForOverlap = (id) => {
    const currentNoteRef = noteRefs.current[id].current
    const boundingRect = currentNoteRef.getBoundingClientRect()

    return notes.some((note) => {
      if (note.id === id) return false
      const otherNoteRef = noteRefs.current[note.id].current
      const otherNoteBoundingRect = otherNoteRef.getBoundingClientRect()

      const overlap = !(
        boundingRect.right < otherNoteBoundingRect.left ||
        boundingRect.left > otherNoteBoundingRect.right ||
        boundingRect.bottom < otherNoteBoundingRect.top ||
        boundingRect.top > otherNoteBoundingRect.bottom
      )

      return overlap
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newNote = {
      id: notes.length + 1,
      text: note,
      position: generateNewPosition(),
    }

    localStorage.setItem("notes", JSON.stringify([...notes, newNote]))
    setNotes([...notes, newNote])
    setNote("")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>
      {notes.map((note) => (
        <Note
          ref={
            noteRefs?.current?.[note.id] ??
            (noteRefs.current[note.id] = createRef())
          }
          key={note.id}
          initialPosition={note.position}
          content={note.text}
          onMouseDown={(e) => handleDragStart(e, note)}
        />
      ))}
    </div>
  )
}

export default Notes
