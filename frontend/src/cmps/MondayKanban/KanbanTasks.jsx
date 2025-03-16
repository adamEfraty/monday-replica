import { useRef, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getSvg } from "../../services/svg.service";

export function KanbanTasks({ title, task, onUpdateTaskTitle }) {
    const [inputValue, setInputValue] = useState(title);
    const inputRef = useRef(null);
    const spanRef = useRef(null);

    console.log(task, 'kanban task')

    useEffect(() => {
        if (inputRef.current && spanRef.current) {
            spanRef.current.textContent = inputValue || title;
            inputRef.current.style.width = `${spanRef.current.offsetWidth + 5}px`;
        }
    }, [inputValue, title]);

    return (
        <div className="kanban-task">
            <div className="task-header">
                <span className="task-title">
                    <span ref={spanRef} className="hidden-input"></span>

                    <input
                        ref={inputRef}
                        className="name-change-input"
                        type="text"
                        placeholder={inputValue}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => onUpdateTaskTitle(inputValue, task)}
                    />
                </span>

                <div className="task-icon-box">
                    <IconButton>{getSvg("pen-icon")}</IconButton>

                    <IconButton size="small" className="task-options">
                        <MoreHorizIcon />
                    </IconButton>
                </div>
            </div>

            <div className="task-footer">
                <div> </div>

                <div className="footer-icon-box">
                    <IconButton size="small" className="task-icon">
                        {getSvg("chat-icon")}
                    </IconButton>
                    <IconButton size="small" className="task-icon">
                        {getSvg("drag-handle")}
                    </IconButton>
                </div>
            </div>
        </div>
    );
}
