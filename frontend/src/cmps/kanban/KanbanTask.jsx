import { Priority } from "../dynamicCmps/Priority";
import { Status } from "../dynamicCmps/Status";
import { DateCell } from "../dynamicCmps/DateCell";
import { Members } from "../dynamicCmps/Members";
import HorizontalSplitOutlinedIcon from '@mui/icons-material/HorizontalSplitOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';


export function KanbanTask({ task, onTaskUpdate, users }) {
    return (
        <div className="task-card">
            {/* Task Content */}
            <h3 className="task-title">{task.cells[0]?.value?.title || "Untitled Task"}</h3>
            <div className="task-card-flex">

                <div className="inner-flex-bars">
                    <div className="flex-name-bar">
                        <HorizontalSplitOutlinedIcon />
                        status

                    </div>
                    <div style={{ width: '50%' }} className="grid-item status">

                        <Status
                            cellInfo={task.cells[2]}
                            onTaskUpdate={onTaskUpdate}
                            labelWidth={20}
                        />
                    </div>
                </div>

                <div className="inner-flex-bars">
                    <div className="flex-name-bar">
                        <HorizontalSplitOutlinedIcon />
                        priority

                    </div>
                    <div style={{ width: '50%' }} className="grid-item priority">
                        <Priority
                            cellInfo={task.cells[1]}
                            onTaskUpdate={onTaskUpdate}
                            labelWidth={20}
                        />
                    </div>

                </div>

                <div className="inner-flex-bars">
                    <div className="flex-name-bar">
                        <PersonAddAlt1OutlinedIcon />
                        members

                    </div>
                    <div style={{ width: '50%' }} className="grid-item members">
                        <Members
                            cellInfo={task.cells[3]}
                            users={users}
                            onTaskUpdate={onTaskUpdate}
                            labelWidth={200}
                        />
                    </div>
                </div>

                <div className="inner-flex-bars">

                    <div className="flex-name-bar">
                        <EditCalendarOutlinedIcon />
                        date

                    </div>

                    <div style={{ width: '50%' }} className="grid-item date">
                        <DateCell
                            cellInfo={task.cells[4]}
                            onTaskUpdate={onTaskUpdate}
                            labelWidth={20}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
}
