import "../styles/_Board-Details.scss";
import { GroupPreview } from "./GroupPreview";
import { useState, useEffect, useRef } from "react";
import {
  removeTasks,
  replaceLabels,
  setFilteredColumns,
  updateTask,
  closeModal,
  handleCloseSelectedModal,
  removeTask,
} from "../store/actions/boards.actions";
import { SelectedTasksModal } from "./dynamicCmps/modals/SelectedTasksModal";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { addGroup } from "../store/actions/boards.actions";
import { addItem } from "../store/actions/boards.actions";
import { updateGroup } from "../store/actions/boards.actions";
import { removeGroup, replaceGroups } from "../store/actions/boards.actions";
import { BoardDetailsHeader } from "./BoardDetailsHeader";
import { boardService } from "../services/board";
import { utilService } from "../services/util.service";
import { setCheckBox } from "../store/actions/boards.actions";
import { setMasterCheckbox } from "../store/actions/boards.actions";
import { LabelsGrid } from "./LabelsGrid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DeleteTaskConfirmation } from "./dynamicCmps/modals/DeleteTaskConfirmation";
import ReactDOM from "react-dom";
import { getSvg } from "../services/svg.service";
import { SomedayKanbanIndex } from "./MondayKanban/SomedayKanbanIndex";

const BoardDetails = ({ isKanban = false }) => {
  const loggedInUser = useSelector((state) => state.userModule.user);
  const { boardId } = useParams();
  const navigate = useNavigate();
  const checkedBoxes = useSelector((state) => state.boardModule.checkedBoxes);
  const checkedGroups = useSelector((state) => state.boardModule.checkedGroups);
  const boards = useSelector((state) => state.boardModule.boards);
  const filteredColumns = useSelector(
    (state) => state.boardModule.filteredColumns
  );
  const [boardColumnsFilter, setBoardColumnsFilter] = useState({
    id: "",
    labels: [],
  });
  const [currentBoard, setcurrentBoard] = useState(
    boards.find((board) => board._id === boardId)
  );

  const loggedinUser = useSelector((state) => state.userModule.user);
  const users = useSelector((state) => state.userModule.users);
  const filterBy = useSelector((state) => state.boardModule.filterBy);

  const groups = currentBoard?.groups || [];

  const boardDetailsRef = useRef(null);
  const [boardScroll, setBoardScroll] = useState(0);
  const [animationActive, setAnimationActive] = useState(false);
  const [goupTitlesYPosition, setGoupTitlesYPosition] = useState({});
  const [fixedGroup, setFixedGroup] = useState(null);

  const [expandedGroupsId, setExpandedGroupsId] = useState([]);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteConfirmationData, setDeleteConfirmationData] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingTask, setIsDraggingTask] = useState(false);

  const [labelsLength, setLabelsLength] = useState();
  const [zoomLevel, setZoomLevel] = useState(window.devicePixelRatio);
  const confirmationRef = useRef(null);

  useEffect(() => {
    const index = boards.findIndex((board) => board._id === boardId);
    index < 0 &&
      navigate(
        `/${utilService.getNameFromEmail(loggedInUser.email)}s-team.someday.com`
      );
  }, [boards]);

  useEffect(() => {
    if (filteredColumns?.length) {
      setBoardColumnsFilter(
        filteredColumns.find((board) => board.id === boardId)
      );
    }
  }, [filteredColumns, boardId])

  useEffect(() => {
    // if (!currentBoard || currentBoard._id !== boardId)
    setcurrentBoard(boards.find((board) => board._id === boardId));
  }, [boards, boardId]);

  useEffect(() => {
    const board = boards.find((board) => board._id === boardId);
    if (!board) {
      navigate(
        `/${utilService.getNameFromEmail(
          loggedInUser?.email
        )}s-team.someday.com`
      );
    } else if (board.groups.some((group) => group.tasks.length > 0)) {
      if (filterBy.length > 0) {
        const regExp = new RegExp(filterBy, "i");
        const filteredGroups = board.groups
          .map((group) => ({
            ...group,
            tasks: group.tasks.filter((task) => {
              return boardColumnsFilter.labels.some((column) => {
                const index = task.cells.findIndex(
                  (cell) => cell.labelId === column.id
                );
                if (index === -1) return false;
                return column.type === "members"
                  ? task.cells[index].value.some(
                      (member) =>
                        regExp.test(member.fullName) ||
                        regExp.test(member.email)
                    )
                  : regExp.test(
                      column.type === "taskTitle"
                        ? task.cells[index].value.title
                        : column.type === "date"
                        ? task.cells[index].value
                        : task.cells[index].value.text
                    );
              });
            }), // Filter tasks
          }))
          .filter((group) => group.tasks.length > 0); // Keep groups that have tasks
        setcurrentBoard({ ...board, groups: filteredGroups }); // Update currentBoard with filtered groups
      }
      filterBy.length === 0 && setcurrentBoard(board); // Update currentBoard with filtered groups
    }
  }, [filterBy, boardColumnsFilter]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPositionY = boardDetailsRef.current.scrollTop;
      const scrollPositionX = boardDetailsRef.current.scrollLeft;
      setBoardScroll({ x: scrollPositionX, y: scrollPositionY });
    };

    if (boardDetailsRef.current) {
      boardDetailsRef.current.addEventListener("scroll", handleScroll);
      return () => {
        boardDetailsRef.current?.removeEventListener("scroll", handleScroll); // Cleanup listener on unmount
      };
    }
  }, []);

  useEffect(() => {
    if (currentBoard && boardDetailsRef.current) {
      const scrollPositionY = boardDetailsRef.current.scrollTop;
      const scrollPositionX = boardDetailsRef.current.scrollLeft;
      setBoardScroll({ x: scrollPositionX, y: scrollPositionY });
      setLabelsLength(
        currentBoard.labels.reduce((acc, label) => acc + label.width, 0)
      );
    }
  }, [zoomLevel]);

  useEffect(() => {
    if (currentBoard) {
      setLabelsLength(
        currentBoard.labels.reduce((acc, label) => acc + label.width, 0)
      );
    }
  }, [currentBoard]);

  useEffect(() => {
    if (groups.length) {
      if (!fixedGroup) {
        setFixedGroup(groups[0]);
        setGoupTitlesYPosition({});
      } else if (!groups.find((group) => group.id === fixedGroup.id)) {
        setFixedGroup(groups[0]);
        setGoupTitlesYPosition({});
      }
    } else setFixedGroup(null);
  }, [groups]);

  useEffect(() => {
    function handleResize() {
      setZoomLevel(window.devicePixelRatio);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //...............................

  function handleAddGroup() {
    addGroup(boardId);
  }

  function chatTempInfoUpdate(cellId, width, scroll, newComment) {
    boardService.saveTempChatInfo(cellId, width, scroll, newComment);
  }

  function openChat(id) {
    boardService.openChat(id);
  }

  // function that set groups with each task update
  const onTaskUpdate = async (newCell) => {
    await updateTask(currentBoard._id, loggedInUser._id, newCell);
  };

  const progress = ["priority", "status", "members", "date"];

  function handleCheckBoxClick(props) {
    if (props.groupId) {
      const { groupId, taskId } = props;
      setCheckBox(groupId, taskId);
    } else {
      const { group } = props;
      setMasterCheckbox(group);
    }
  }

  async function handleDeleteTasks() {
    await removeTasks(currentBoard._id, checkedBoxes);
  }

  async function handleDeleteTask(boardId, groupId, taskId) {
    await removeTask(boardId, groupId, taskId);
  }

  function handleAddTask(group = null, taskTitle = "New Task") {
    addItem(
      boardId,
      group ? group.id : currentBoard.groups[0].id,
      taskTitle,
      !group && true,
      loggedInUser._id
    );
  }

  async function handleGroupNameChange(groupTitle, group) {
    const updatedTask = { title: groupTitle };

    try {
      await updateGroup(boardId, group.id, updatedTask);
    } catch (error) {
      console.error("Error updating group", error);
    }
  }

  function handleDeleteGroup(groupId, boardId) {
    removeGroup(boardId, groupId);
  }

  if (!currentBoard || currentBoard?._id !== boardId)
    return <div>Loading...</div>;

  function handleFilteredLabel(label) {
    boardColumnsFilter.labels.some((column) => column.id === label.id)
      ? setFilteredColumns({
          id: currentBoard._id,
          labels: boardColumnsFilter.labels.filter(
            (column) => column.id !== label.id
          ),
        })
      : setFilteredColumns({
          id: boardId,
          labels: [...boardColumnsFilter.labels, label],
        });
  }

  const handleDragStart = (start) => {
    if (start.type === "group") {
      setIsDragging(true);
    }
    setIsDraggingTask(true);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, type } = result;
    setIsDragging(false);
    setIsDraggingTask(false);

    if (!destination) return;

    if (type === "group") {
      const reorderedGroups = Array.from(groups);
      const [movedGroup] = reorderedGroups.splice(source.index, 1);
      reorderedGroups.splice(destination.index, 0, movedGroup);
      await replaceGroups(boardId, reorderedGroups);
    } else if (type === "task") {
      const sourceGroup = groups.find((g) => g.id === source.droppableId);
      const destGroup = groups.find((g) => g.id === destination.droppableId);

      if (!sourceGroup || !destGroup) return;

      const sourceTasks = Array.from(sourceGroup.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);

      if (sourceGroup.id === destGroup.id) {
        sourceTasks.splice(destination.index, 0, movedTask);
        sourceGroup.tasks = sourceTasks;
      } else {
        const destTasks = Array.from(destGroup.tasks);
        movedTask.cells[0].value.activities =
          movedTask.cells[0].value.activities.map((e) => ({
            ...e,
            activity: {
              ...e.activity,
              groupId: destGroup.id,
            },
          }));
        destTasks.splice(destination.index, 0, movedTask);
        sourceGroup.tasks = sourceTasks;
        destGroup.tasks = destTasks;
      }

      await replaceGroups(boardId, groups);
    } else if (type === "label") {
      const reorderedLabels = Array.from(currentBoard.labels);
      const [movedLabel] = reorderedLabels.splice(source.index, 1);
      reorderedLabels.splice(destination.index, 0, movedLabel);
      await replaceLabels(boardId, reorderedLabels);
    }
  };

  function confirmationAnimation(isEnter, duration) {
    if (!confirmationRef.current) return;
    const animation = isEnter ? "fadeInDown" : "fadeOutUp";
    utilService.animateCSS(confirmationRef.current, animation, duration);
  }

  function updateFixedGroup(groupId, yPos) {
    setGoupTitlesYPosition((prev) => ({ ...prev, [groupId]: yPos }));
    let groupIdToFixed = "";
    let highestFixedHeight = -Infinity;
    for (const groupId in goupTitlesYPosition) {
      if (
        goupTitlesYPosition[groupId] < 260 &&
        goupTitlesYPosition[groupId] >= highestFixedHeight
      ) {
        highestFixedHeight = goupTitlesYPosition[groupId];
        groupIdToFixed = groupId;
      }
    }

    setFixedGroup(groups.find((group) => group.id === groupIdToFixed));
  }

  function updateExpandedGroups(groupId, expanded) {
    setExpandedGroupsId((prev) => {
      if (expanded) return prev.includes(groupId) ? prev : [...prev, groupId];
      else return prev.filter((id) => id !== groupId);
    });
  }

  function isFixedGroupExpanded() {
    return (
      fixedGroup &&
      expandedGroupsId &&
      expandedGroupsId.some((groupId) => groupId === fixedGroup.id)
    );
  }

  function toggleConfirmationModal(
    modalId = null,
    type = null,
    boardId = null,
    groupId = null,
    taskId = null
  ) {
    const animationDuration = 0.2;
    if (modalId) closeModal(modalId);
    if (deleteConfirmationModal) {
      confirmationAnimation(false, animationDuration);
      setTimeout(() => {
        setDeleteConfirmationModal((prev) => !prev);
      }, animationDuration * 500);
    } else {
      setAnimationActive(true);
      if (type === "task" || type === "group") {
        setDeleteConfirmationData({ type: type, boardId, groupId, taskId });
      } else if (type === "tasks") {
        setDeleteConfirmationData({ type: type });
      }
      setDeleteConfirmationModal((prev) => !prev);
      setTimeout(() => {
        confirmationAnimation(true, animationDuration);
        setAnimationActive(false);
      }, 10);
    }
  }

  return !isKanban ? (
    <div className="board-details" ref={boardDetailsRef}>
      <BoardDetailsHeader
        handleAddTask={handleAddTask}
        boardTitle={currentBoard.title}
        boardId={currentBoard._id}
        boardColumnsFilter={boardColumnsFilter}
        handleFilteredLabel={handleFilteredLabel}
      />

      {!isDragging && isFixedGroupExpanded() && (
        <div
          className="sticky-labels"
          style={{
            width:
              labelsLength < window.innerWidth - 320
                ? "calc(100vw - 320px)"
                : `${labelsLength + 150}px`,
          }}
        >
          <LabelsGrid
            boardId={boardId}
            group={fixedGroup}
            labels={currentBoard.labels}
            handleMasterCheckboxClick={handleCheckBoxClick}
            checkedGroups={checkedGroups}
            isFixed={true}
            isBordScrollOnZero={boardScroll.y <= 0}
          />
        </div>
      )}

      {currentBoard.groups.length > 0 ? (
        <section
          className="group-list"
          style={{ marginTop: `${isFixedGroupExpanded() ? "-37px" : "0px"}` }}
        >
          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <Droppable droppableId="groups" type="group">
              {(provided) => (
                <section
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="group-list"
                  style={{
                    width:
                      labelsLength < window.innerWidth - 320
                        ? "calc(100vw - 320px)"
                        : `${labelsLength + 150}px`,
                  }}
                >
                  {groups.map((group, index) => (
                    <Draggable
                      key={group.id}
                      draggableId={group.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <GroupPreview
                            id={group.id}
                            group={group}
                            labels={currentBoard.labels}
                            loggedinUser={loggedinUser}
                            progress={progress}
                            key={group.id}
                            onTaskUpdate={onTaskUpdate}
                            checkedBoxes={checkedBoxes}
                            checkedGroups={checkedGroups}
                            handleMasterCheckboxClick={handleCheckBoxClick}
                            handleCheckBoxClick={handleCheckBoxClick}
                            handleAddTask={handleAddTask}
                            handleGroupNameChange={handleGroupNameChange}
                            toggleConfirmationModal={toggleConfirmationModal}
                            boardId={boardId}
                            users={users}
                            chatTempInfoUpdate={chatTempInfoUpdate}
                            openChat={openChat}
                            boardScroll={boardScroll}
                            updateFixedGroup={updateFixedGroup}
                            fixedGroup={fixedGroup}
                            updateExpandedGroups={updateExpandedGroups}
                            isDragging={isDragging}
                            isDraggingTask={isDraggingTask}
                            labelsLength={labelsLength}
                            provided={provided} // ✅ Pass full provided object instead
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </section>
              )}
            </Droppable>
          </DragDropContext>

          <button className="modal-save-btn" onClick={handleAddGroup}>
            {getSvg("thin-plus-bold")}
            Add new group
          </button>
          {checkedBoxes.length > 0 && (
            <SelectedTasksModal
              boardId={boardId}
              checkedTasks={checkedBoxes}
              toggleConfirmationModal={() =>
                toggleConfirmationModal(null, "tasks")
              }
              handleClose={handleCloseSelectedModal}
            />
          )}
        </section>
      ) : (
        boards.find((board) => board._id === boardId) &&
        (boards.find((board) => board._id === boardId).groups.length === 0 ? (
          <section className="no-groups-result">
            <img
              className="search-empty-board-image"
              src="https://cdn.monday.com/images/search_empty_state.svg"
            ></img>
            <h1>No groups here yet, add your first!</h1>
            <button className="modal-save-btn" onClick={handleAddGroup}>
              +Add a new group
            </button>
          </section>
        ) : (
          <section className="no-groups-result">
            <img
              className="search-empty-board-image"
              src="https://cdn.monday.com/images/search_empty_state.svg"
            ></img>
            <h1>No tasks match this filter</h1>
          </section>
        ))
      )}
      {deleteConfirmationModal &&
        ReactDOM.createPortal(
          <DeleteTaskConfirmation
            onDelete={() => {
              deleteConfirmationData.type === "tasks"
                ? handleDeleteTasks()
                : deleteConfirmationData.type === "task"
                ? handleDeleteTask(
                    deleteConfirmationData.boardId,
                    deleteConfirmationData.groupId,
                    deleteConfirmationData.taskId
                  )
                : deleteConfirmationData.type === "group"
                ? handleDeleteGroup(
                    deleteConfirmationData.groupId,
                    deleteConfirmationData.boardId
                  )
                : null;
              toggleConfirmationModal();
            }}
            toggleConfirmationModal={toggleConfirmationModal}
            confirmationRef={confirmationRef}
            animationActive={animationActive}
            type={deleteConfirmationData.type}
          />,

          document.body // Appends the modal properly
        )}
    </div>
  ) : (
    <SomedayKanbanIndex
      boardColumnsFilter={boardColumnsFilter}
      handleFilteredLabel={handleFilteredLabel}
      currentBoard={currentBoard}
      chatTempInfoUpdate={chatTempInfoUpdate}
      openChat={openChat}
      onTaskUpdate={onTaskUpdate}
    />
  );
};

export default BoardDetails;
