import { KanbanTask } from "./KanbanTask";



export function KanbanGroup({ group, onTaskUpdate, users }) {

    const tasks = group.tasks;

    return (
        <div className="kanban-group-card">

            <h2>{group.title} / {group.tasks.length}</h2>


            <div className="kanban-tasks-container">

                {tasks.map((task) => {
                    return (
                        <KanbanTask key={task.id} task={task} onTaskUpdate={onTaskUpdate} users={users} />
                    )
                })}
            </div>
        </div>
    )

}