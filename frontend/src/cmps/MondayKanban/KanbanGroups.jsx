import { Droppable, Draggable } from "react-beautiful-dnd";
import { KanbanTasks } from "./KanbanTasks";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export function KanbanGroups({ title, color, tasks }) {
    const displayTitle = title === '' ? 'Blank' : title;
    const droppableId = title === 'Blank' ? 'BlankGroup' : title;

    const tasksToUse = tasks.filter((task) =>
        (task.cells[2].value.text === '' && droppableId === 'BlankGroup') || task.cells[2].value.text === title
    );

    return (
        <div className="kanban-group">
            <div className="group-header" style={{ backgroundColor: color, color: "#fff" }}>
                <h3 className="group-title">
                    {displayTitle} <span className="task-count">{tasksToUse.length}</span>
                </h3>
                <div className="icons-group">
                    <MoreHorizIcon className="icon-hover" style={{ backgroundColor: color }} />
                    <AddIcon className="icon-hover" style={{ backgroundColor: color }} />
                </div>
            </div>

            <Droppable droppableId={droppableId} type="task">
                {(provided) => (
                    <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
                        {tasksToUse.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <KanbanTasks title={task.cells[0].value.title} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <div className="add-new-task">
                <h3>+ Add new task</h3>
            </div>
        </div>
    );
}
