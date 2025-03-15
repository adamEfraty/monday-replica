import { KanbanTasks } from "./KanbanTasks";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export function KanbanGroups({ title, color, tasks }) {
    const tasksToUse = tasks.filter((task) => task.cells[2].value.text === title);

    return (
        <div className="kanban-group">
            <div className="group-header" style={{ backgroundColor: `${color}`, color: '#fff' }}>
                <h3 className="group-title">{title} <span className="task-count">{tasksToUse.length}</span></h3>
                <div className="icons-group">
                    <MoreHorizIcon className="icon-hover" style={{ backgroundColor: `${color}` }} />
                    <AddIcon className="icon-hover" style={{ backgroundColor: `${color}` }} />

                </div>
            </div>

            <div className="task-list">
                {tasksToUse.map((task) => (
                    <KanbanTasks key={task.id} title={task.cells[0].value.title} />
                ))}

            </div>

            <div className="add-new-task"> <h3>+ Add new task </h3></div>

        </div>
    );
}
