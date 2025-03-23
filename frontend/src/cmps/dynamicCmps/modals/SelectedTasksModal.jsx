import DuplicateIcon from "@mui/icons-material/ContentCopyOutlined";
import GarbageIcon from "@mui/icons-material/DeleteOutlineOutlined";
import XIcon from "@mui/icons-material/Clear";

import { duplicateTasks } from "../../../store/actions/boards.actions";

export function SelectedTasksModal({
  boardId,
  checkedTasks,
  toggleConfirmationModal,
  handleClose,
}) {
  const handleDuplicate = () => duplicateTasks(boardId, checkedTasks);

  return (
    <footer className="selected-tasks-modal">
      <section className="selected-tasks-modal-header">
        <div className="selected-tasks-modal-header-blur">
          <h2>{checkedTasks.length}</h2>
        </div>
        <h4>Task{checkedTasks.length > 1 && "s"} selected</h4>
      </section>
      <section className="selected-tasks-modal-icons">
        <div onClick={handleDuplicate}>
          <DuplicateIcon />
          <h4>Duplicate</h4>
        </div>
        <div onClick={toggleConfirmationModal}>
          <GarbageIcon />
          <h4>Delete</h4>
        </div>
        <div className="close-btn">
          <XIcon className="x-icon" onClick={handleClose} />
        </div>
      </section>
    </footer>
  );
}
