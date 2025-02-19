import { useState, useRef } from "react"
import { useSelector } from "react-redux"
import { showErrorMsg } from '../services/event-bus.service.js'


export function AddTask({ group, handleAddTask }) {

    const [newTaskTitle, setNewTaskTitle] = useState("")
    const inputRef = useRef(null)

    function onAddTask() {
        if (newTaskTitle !== ''){
            handleAddTask(group, newTaskTitle)
            setNewTaskTitle('')
        } 
    }

    function handleKeyDown(event) {
        if (event.key === "Enter"){
            onAddTask()
        }
            
    }

    return (
        <section 
        style={{ borderLeft: `5px solid ${group?.color}`, borderBottomLeftRadius: 5}}
        className="add-task">
            <input
                ref={inputRef}
                className="add-input"
                onBlur={onAddTask}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="+Add Task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
            />
        </section>
    )
}