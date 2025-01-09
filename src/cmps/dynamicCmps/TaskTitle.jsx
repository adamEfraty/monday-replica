import { useState } from "react"
import { showErrorMsg } from '../../services/event-bus.service.js'

const TaskTitle = ({taskId, info, onTaskUpdate }) => {
  const [onEditMode, setOnEditMode] = useState(false)
  const [textToEdit, setTextToEdit] = useState(info)
  const [text, setText] = useState(info)

  // toggel btween spectate and edit mode
  function toggleEditMode() {
    if (onEditMode) {
        // not alowing user insert unvalid title
        if(!checkTitleValidation(textToEdit)) {
            setTextToEdit(text)
            showErrorMsg("Name can't be empty")
        }
        // if everyting ok update title changes
        else {
            setText(textToEdit)
            onTaskUpdate({taskId, type: 'title update', value: textToEdit})
        }
    }
      
    setOnEditMode(prev => !prev)
  }


  function checkTitleValidation(title){
    // not alowing user insert blank title
    if(title === '') return false
    return true
  }

  // if user press enter go to spectate mode
  function handleKeyDown(event) {
    if (event.key === "Enter")
      toggleEditMode()
  }


  return !onEditMode 
    ? <span onClick={toggleEditMode}>{text}</span> 
    : <input
      autoFocus={true}
      value={textToEdit}
      onChange={event => setTextToEdit(event.target.value)}
      // if user out of input focuse OR pressing enter, update title
      onBlur={toggleEditMode}
      onKeyDown={handleKeyDown}
      type="text"
    />
}

export default TaskTitle

