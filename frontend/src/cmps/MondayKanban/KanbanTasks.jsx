import { useRef, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getSvg } from "../../services/svg.service";
import { Popover, MenuItem, Typography } from "@mui/material";

export function KanbanTasks({ title, task, onUpdateTaskTitle, onRemove, groupId }) {
    const [inputValue, setInputValue] = useState(title);
    const inputRef = useRef(null);
    const spanRef = useRef(null);

    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (inputRef.current && spanRef.current) {
            spanRef.current.textContent = inputValue || title;
            inputRef.current.style.width = `${spanRef.current.offsetWidth + 5}px`;
        }
    }, [inputValue, title]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };




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
                        onBlur={() => onUpdateTaskTitle(inputValue, task, groupId)}
                    />
                </span>

                <div className="task-icon-box">
                    <IconButton>{getSvg("pen-icon")}</IconButton>

                    <IconButton size="small" className="task-options" onClick={handleClick}>
                        <MoreHorizIcon />
                    </IconButton>

                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                    >
                        <MenuItem onClick={() => onRemove(task, groupId)}>{getSvg('trash2')}<span style={{ marginLeft: '1rem', fontWeight: '100' }}>Delete Task </span></MenuItem>
                    </Popover>
                </div>
            </div>

            <div className="task-footer">
                <div> </div>

                <div className="footer-icon-box">
                    <IconButton size="small" className="task-icon">
                        {getSvg("chat-icon")}
                    </IconButton>

                </div>
            </div>
        </div>
    );
}
