import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";

export function KanbanTasks({ title }) {
    return (
        <div className="kanban-task">
            <div className="task-header">
                <span className="task-title">{title}</span>
                <IconButton size="small" className="task-options">
                    <MoreHorizIcon />
                </IconButton>
            </div>

            <div className="task-footer">
                <IconButton size="small" className="task-icon">
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton size="small" className="task-icon">
                    <DragIndicatorIcon />
                </IconButton>
            </div>
        </div>
    );
}
