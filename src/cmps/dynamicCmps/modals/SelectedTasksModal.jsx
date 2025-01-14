import DuplicateIcon from "@mui/icons-material/ContentCopyOutlined";
import ExportIcon from "@mui/icons-material/FileUploadOutlined";
import ArchiveIcon from "@mui/icons-material/Inventory2Outlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MoveToIcon from "@mui/icons-material/ArrowForwardOutlined";
import AppsIcon from "@mui/icons-material/ExtensionOutlined";
import { removeTask } from "../../../store/actions/boards.actions";

export function SelectedTasksModal({ checkedTasks, handleDeleteTasks }) {
  function onDuplicate(){

  }

  return (
    <footer className="selected-tasks-modal">
      <section className="selected-tasks-modal-header">
        <div className="selected-tasks-modal-header-blur">
          <h2>{checkedTasks.length}</h2>
        </div>
        <h4>Task{checkedTasks.length > 1 && "'s"} selected</h4>
      </section>
      <section className="selected-tasks-modal-icons">
        <div>
          <DuplicateIcon />
          <h4>Duplicate</h4>
        </div>
        <div>
          <ExportIcon />
          <h4>Export</h4>
        </div>
        <div>
          <ArchiveIcon />
          <h4>Archive</h4>
        </div>
        <div onClick={handleDeleteTasks}>
          <DeleteIcon />
          <h4>Delete</h4>
        </div>
        <div>
          <MoveToIcon />
          <h4>Move to</h4>
        </div>
        <div>
          <AppsIcon />
          <h4>Apps</h4>
        </div>
      </section>
    </footer>
  );
}