import { KanbanTask } from "./KanbanTask";

export function KanbanGroup({ group, onTaskUpdate, users }) {
    const tasks = group.tasks;

    return (
        <div className="kanban-group-card" style={{ borderLeft: `8px solid ${group.color}` }}>
            {/* Fixed Header */}
            <h2
                className="group-title"
                style={{ backgroundColor: group.color || "#b0b0b0" }}
            >
                {group.title} / {group.tasks.length}
            </h2>

            {/* Scrollable Tasks Container */}
            <div className="kanban-tasks-container">
                {tasks.map((task) => (
                    <KanbanTask
                        key={task.id}
                        task={task}
                        onTaskUpdate={onTaskUpdate}
                        users={users}
                    />
                ))}
            </div>

            {/* Fixed Footer */}
            <button className="add-item-button">+ Add Item</button>
        </div>
    );
}
