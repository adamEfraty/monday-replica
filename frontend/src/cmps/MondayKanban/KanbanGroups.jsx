import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { KanbanTasks } from "./KanbanTasks";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Popover from "@mui/material/Popover";
import ButtonBase from "@mui/material/ButtonBase";
import MenuItem from "@mui/material/MenuItem";

export function KanbanGroups({ color, tasks, addItem, onUpdateTaskTitle, onRemove, group }) {



    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="kanban-group">
            <div className="group-header" style={{ backgroundColor: color, color: "#fff" }}>
                <h3 className="group-title">
                    {group.title} <span className="task-count">{tasks.length}</span>
                </h3>
                <div className="icons-group">
                    {/* More Options Popover */}
                    <ButtonBase onClick={handleOpen}>
                        <MoreHorizIcon className="icon-hover" style={{ backgroundColor: color }} />
                    </ButtonBase>

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
                        <MenuItem onClick={() => addItem(group.id)}>+ Add new task</MenuItem>
                    </Popover>

                    <AddIcon className="icon-hover" style={{ backgroundColor: color }} onClick={() => addItem(group.id)} />
                </div>
            </div>

            <Droppable droppableId={group.id} type="task">
                {(provided) => (
                    <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <KanbanTasks groupId={group.id} onRemove={onRemove} title={task.cells[0].value.title} task={task} onUpdateTaskTitle={onUpdateTaskTitle} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <div className="add-new-task">
                <h3 onClick={() => addItem(group.id)}>+ Add new task</h3>
            </div>
        </div>
    );
}
