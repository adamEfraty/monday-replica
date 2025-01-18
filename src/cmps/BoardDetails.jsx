import "../styles/_Board-Details.scss";
import { GroupPreview } from "./GroupPreview";
import { useState, useEffect } from "react";
import { logout, loadUsers } from "../store/actions/user.actions";
import {
  loadBoards,
  removeTasks,
  updateTask,
} from "../store/actions/boards.actions";
import { SelectedTasksModal } from "./dynamicCmps/modals/SelectedTasksModal";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { addGroup } from "../store/actions/boards.actions";
import { addItem } from "../store/actions/boards.actions";
import { updateGroup } from "../store/actions/boards.actions";
import { removeGroup } from "../store/actions/boards.actions";
import { BoardDetailsHeader } from "./BoardDetailsHeader";

const BoardDetails = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [checkedGroups, setCheckedGroups] = useState([]);
  const boards = useSelector((state) => state.boardModule.boards);
  const loggedinUser = useSelector((state) => state.userModule.user);
  const users = useSelector((state) => state.userModule.users);

  const currentBoard = boards.find((board) => board.id === boardId);

  const groups = currentBoard?.groups || [];

  //.........................
  useEffect(() => {
    onLoadBoards();
  }, [boards.groups]);

  async function onLoadBoards() {
    await loadBoards();
    await loadUsers();
  }

  //...............................

  function handleAddGroup() {
    addGroup(boardId);
  }

  // function that set groups with each task update
  const onTaskUpdate = async (changeInfo) =>
    await updateTask(currentBoard.id, changeInfo);

  const cmpOrder = ["taskTitle", "priority", "status", "members", "date", "+"];

  const uid = () => Math.random().toString(36).slice(2);
  const labels = ["item", "priority", "status", "members", "date", "+"];

  const progress = [null, null, "priority", "status", 'nothing', 'nothing', 'nothing'];

  const handleCheckBoxClick = (groupId, taskId) => {
    console.log(groupId, taskId);
    console.log(checkedBoxes);
    setCheckedBoxes((prev) => {
      if (prev.some((scdArr) => scdArr[1] == taskId)) {
        setCheckedGroups((prev) => prev.filter((id) => id !== groupId));
        return prev.filter((scdArr) => scdArr[1] !== taskId);
      } else {
        return [...prev, [groupId, taskId]];
      }
    });
  };

  const handleMasterCheckboxClick = (group) => {
    setCheckedGroups((prev) => {
      if (prev.includes(group.id)) {
        setCheckedBoxes((prev) =>
          prev.filter((scdArr) => scdArr[0] !== group.id)
        );
        return prev.filter((id) => id !== group.id);
      } else {
        const newData = group.tasks.map((task) => [group.id, task.id]);
        setCheckedBoxes((prev) => [...prev, ...newData]);
        return [...prev, group.id];
      }
    });
  };
  async function handleDeleteTasks() {
    for (const [groupId, taskId] of checkedBoxes) {
      await removeTasks(currentBoard.id, groupId, taskId).then(() => {
        setCheckedBoxes((prev) =>
          prev.filter((scdArr) => scdArr[1] !== taskId)
        );
      });
    }
  }
  async function handleDeleteTasks() {
    await removeTasks(currentBoard.id, checkedBoxes).then(() => {
      setCheckedBoxes([]);
    });
  }

  function handleAddTask(group, taskTitle) {
    addItem(boardId, group.id, taskTitle);
  }

  async function handleGroupNameChange(groupTitle, group) {
    const updatedTask = { title: groupTitle };

    try {
      await updateGroup(boardId, group.id, updatedTask);
    } catch (error) {
      console.error("Error updating group", error);
    }
  }

  function handleDelete(groupId, boardId) {
    removeGroup(boardId, groupId);
  }

  if (!currentBoard) return <div>Loading...</div>;

  return (
    <div className="board-details">
      <BoardDetailsHeader boardTitle={currentBoard.title} />
      <section className="group-list">
        {groups.map((group) => (
          <GroupPreview
            group={group}
            labels={labels}
            loggedinUser={loggedinUser}
            cmpOrder={cmpOrder}
            progress={progress}
            key={uid()}
            onTaskUpdate={onTaskUpdate}
            checkedBoxes={checkedBoxes}
            checkedGroups={checkedGroups}
            handleMasterCheckboxClick={handleMasterCheckboxClick}
            handleCheckBoxClick={handleCheckBoxClick}
            handleAddTask={handleAddTask}
            handleGroupNameChange={handleGroupNameChange}
            handleDelete={handleDelete}
            boardId={boardId}
            users={users}
          />
        ))}
        <button className="modal-save-btn" onClick={handleAddGroup}>
          +Add a new group
        </button>
        {checkedBoxes.length > 0 && (
          <SelectedTasksModal
            checkedTasks={checkedBoxes}
            handleDeleteTasks={handleDeleteTasks}
          />
        )}
      </section>
    </div>
  );
};

export default BoardDetails;
