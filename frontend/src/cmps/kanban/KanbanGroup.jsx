import { KanbanTask } from "./KanbanTask";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { addItem } from "../../store/actions/boards.actions";

export function KanbanGroup({ group, onTaskUpdate, users, boardId, user }) {
    const tasks = group.tasks;

    function addTask() {
        addItem(boardId, group.id, 'new item', !group && true, user._id);
    }

    return (
        <div className="kanban-group-card" style={{ borderLeft: `8px solid ${group.color}` }}>
            <h2 className="group-title" style={{ backgroundColor: group.color || "#b0b0b0" }}>
                {group.title} / {group.tasks.length}
            </h2>

            {/* Droppable area for tasks */}
            <Droppable droppableId={group.id} type="task">
                {(provided) => (
                    <div
                        className="kanban-tasks-container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={`t-${task.id}`} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <KanbanTask
                                            task={task}
                                            onTaskUpdate={onTaskUpdate}
                                            users={users}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <button className="add-item-button" onClick={addTask}>+ Add Item</button>
        </div>
    );
}
