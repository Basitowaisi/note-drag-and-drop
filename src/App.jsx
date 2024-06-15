import { useState } from "react"
import "./App.css"
import Notes from "./Notes"

function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "This is a note",
    },
    {
      id: 2,
      text: "This is another note",
    },
  ])

  return (
    <div>
      <Notes notes={notes} setNotes={setNotes} />
    </div>
  )
}

export default App
