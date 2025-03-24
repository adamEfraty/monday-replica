import { useState, useEffect } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { KanbanTasks } from "./KanbanTasks";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Popover from "@mui/material/Popover";
import ButtonBase from "@mui/material/ButtonBase";
import MenuItem from "@mui/material/MenuItem";

export function KanbanGroups({
  title,
  color,
  tasks,
  addItem,
  onUpdateTaskTitle,
  onRemove,
}) {
  const [tasksToUse, setTasksToUse] = useState([]);
  const [cells, setCells] = useState({});

  const displayTitle = title === "" ? "Blank" : title;
  const droppableId = title === "Blank" ? "BlankGroup" : title;

  useEffect(() => {
    const hMap = {};
    const filteredTasks =
      tasks[0] && tasks[0].cells.some((cell) => cell.type === "status")
        ? tasks.filter((task) =>
            task.cells.some(
              (cell) => {
                if (cell.type === "status" && (cell.value.text === title || cell.value.text + "Blank" === title)) {
                  hMap[task.id] = cell.labelId
                  return true;
                }
                return false;
              }
            )
          )
        : [];
    setTasksToUse(filteredTasks);
    setCells(hMap);
    console.log(filteredTasks, tasks);
  }, [tasks, title]);

  console.log(tasksToUse);

  // Popover state
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="kanban-group">
      <div
        className="group-header"
        style={{ backgroundColor: color, color: "#fff" }}
      >
        <h3 className="group-title">
          {displayTitle} <span className="task-count">{tasksToUse.length}</span>
        </h3>
        <div className="icons-group">
          {/* More Options Popover */}
          <ButtonBase onClick={handleOpen}>
            <MoreHorizIcon
              className="icon-hover"
              style={{ backgroundColor: color }}
            />
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
            <MenuItem onClick={() => addItem(title)}>+ Add new task</MenuItem>
          </Popover>

          <AddIcon
            className="icon-hover"
            style={{ backgroundColor: color }}
            onClick={() => addItem(title)}
          />
        </div>
      </div>

      <Droppable
        droppableId={droppableId}
        type="task"
        style={{ height: "100%" }}
      >
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasksToUse.map((task, index) => (
              <Draggable
                key={task.id + " " + cells[task.id]}
                draggableId={task.id + " " + cells[task.id]}
                index={index}
              >
                {(provided) => {
                    console.log(provided, cells)
                    return (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KanbanTasks
                      onRemove={onRemove}
                      cellId={cells[task.id]}
                      title={task.cells[0].value.title}
                      task={task}
                      onUpdateTaskTitle={onUpdateTaskTitle}
                    />
                  </div>
                )}}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="add-new-task">
        <h3 onClick={() => addItem(title)}>+ Add new task</h3>
      </div>
    </div>
  );
}
