import { Priority } from "../dynamicCmps/Priority";
import { updateTask } from "../../store/actions/boards.actions";
import { Status } from "../dynamicCmps/Status";
import { Date } from "../dynamicCmps/Date";
import { Members } from "../dynamicCmps/Members";

export function KanbanTask({ task, onTaskUpdate, users }) {



    return (
        <div className="task-card">
            <div className="task-card-flex">

                <div>
                    <h2>{task.cells[0].value.title}</h2>
                </div>


                <div className="grid-item priority">
                    <Priority cellInfo={task.cells[2]} onTaskUpdate={onTaskUpdate} />
                </div>


                <div className="grid-item status">
                    <Status cellInfo={task.cells[1]} onTaskUpdate={onTaskUpdate} />

                </div>

                <div className="grid-item members">
                    <Members cellInfo={task.cells[3]} users={users} onTaskUpdate={onTaskUpdate} />
                </div>
                <div className="grid-item date">
                    <Date cellInfo={task.cells[4]} onTaskUpdate={onTaskUpdate} />
                </div>
            </div>
        </div>
    )
}