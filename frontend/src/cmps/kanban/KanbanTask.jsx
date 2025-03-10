import { Priority } from "../dynamicCmps/Priority";
import { Status } from "../dynamicCmps/Status";
import { Date } from "../dynamicCmps/Date";
import { Members } from "../dynamicCmps/Members";

export function KanbanTask({ task, onTaskUpdate, users }) {
    return (
        <div className="task-card">
            {/* Task Content */}
            <h3 className="task-title">{task.cells[0]?.value?.title || "Untitled Task"}</h3>
            <div className="task-card-flex">
                <div className="grid-item status">
                    <Status
                        cellInfo={task.cells[1]}
                        onTaskUpdate={onTaskUpdate}
                        labelWidth={400}
                    />
                </div>
                <div className="grid-item priority">
                    <Priority
                        cellInfo={task.cells[2]}
                        onTaskUpdate={onTaskUpdate}
                        labelWidth={400}
                    />
                </div>
                <div className="grid-item members">
                    <Members
                        cellInfo={task.cells[3]}
                        users={users}
                        onTaskUpdate={onTaskUpdate}
                        labelWidth={400}
                    />
                </div>
                <div className="grid-item date">
                    <Date
                        cellInfo={task.cells[4]}
                        onTaskUpdate={onTaskUpdate}
                        labelWidth={400}
                    />
                </div>
            </div>
        </div>
    );
}
