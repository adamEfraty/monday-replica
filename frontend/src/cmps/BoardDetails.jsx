import "../styles/_Board-Details.scss";
import { GroupPreview } from "./GroupPreview";
import { useState, useEffect, useRef } from "react";
import { logout, loadUsers } from "../store/actions/user.actions";
import {
  loadBoards,
  removeTasks,
  replaceLabels,
  setFilteredColumns,
  updateTask,
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
import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LabelsGrid } from "./LabelsGrid";


const BoardDetails = () => {
  const loggedInUser = useSelector((state) => state.userModule.user);
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [checkedGroups, setCheckedGroups] = useState([]);
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

  const boardDetailsRef = useRef(null)
  const [boardScroll, setBoardScroll] = useState(0)
  const [goupTitlesYPosition, setGoupTitlesYPosition] = useState({})
  const [fixedGroup, setFixedGroup] = useState(null)

  const [expandedGroupsId, setExpandedGroupsId] = useState([])

  useEffect(() => {
    const index = boards.findIndex((board) => board._id === boardId);
    index < 0 &&
      navigate(
        `/${utilService.getNameFromEmail(loggedInUser.email)}s-team.someday.com`
      );
  }, [boards]);

  useEffect(() => {
    console.log(filteredColumns);
  }, [filteredColumns]);

  useEffect(() => {
    console.log(
      "filteredColumns csdfsdfsdf ",
      boardColumnsFilter,
      filteredColumns,
      boards
    );
    filteredColumns &&
      setBoardColumnsFilter(
        filteredColumns.find((board) => board._id === boardId)
      );
  }, [filteredColumns, boardId]);

  useEffect(() => {
    // if (!currentBoard || currentBoard._id !== boardId)
    setcurrentBoard(boards.find((board) => board._id === boardId));
  }, [boards, boardId]);

  useEffect(() => {
    const board = boards.find((board) => board._id === boardId);
    if (!board) {
      navigate(
        `/${utilService.getNameFromEmail(loggedInUser?.email)}s-team.someday.com`
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
                  (cell) => cell.type === column.type
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
      const scrollPositionY = boardDetailsRef.current.scrollTop
      const scrollPositionX = boardDetailsRef.current.scrollLeft
      setBoardScroll({ x: scrollPositionX, y: scrollPositionY })
    };

    if (boardDetailsRef.current) {
      boardDetailsRef.current.addEventListener("scroll", handleScroll);
      return () => {
        boardDetailsRef.current?.removeEventListener("scroll", handleScroll); // Cleanup listener on unmount
      }
    }
  }, [])

  useEffect(()=>{
    if(groups.length){
      setFixedGroup(groups[0])
      setGoupTitlesYPosition({})
    }
    else  setFixedGroup(null)
  },[groups])

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
    await updateTask(currentBoard._id, loggedInUser.id, newCell);
  };

  // const cmpOrder = ["taskTitle", "priority", "status", "members", "date"];

  const uid = () => Math.random().toString(36).slice(2);

  const progress = ["priority", "status", "members", "date"];
  const handleCheckBoxClick = (groupId, taskId) => {
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
      await removeTasks(currentBoard._id, groupId, taskId).then(() => {
        setCheckedBoxes((prev) =>
          prev.filter((scdArr) => scdArr[1] !== taskId)
        );
      });
    }
  }
  async function handleDeleteTasks() {
    await removeTasks(currentBoard._id, checkedBoxes).then(() => {
      setCheckedBoxes([]);
    });
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

  function handleDelete(groupId, boardId) {
    removeGroup(boardId, groupId);
  }

  if (!currentBoard || currentBoard?._id !== boardId)
    return <div>Loading...</div>;

  //................ IMPORTANT !!!
  function getGroupPos(id) {
    return groups.findIndex((group) => group.id === id);
  }

  function getTaskPos(taskId) {
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      const taskPos = group.tasks.findIndex((task) => task.id === taskId);

      if (taskPos !== -1) {
        return { groupIndex: i, taskIndex: taskPos };
      }
    }

    return null;
  }

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

  function getLabelPos(id) {
    return currentBoard.labels.findIndex((label) => label.id === id);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;

    if (active === over) return;

    if (active.id[0] === "l") {
      const originalLabelPos = getLabelPos(active.id);
      const moveToLabel = getLabelPos(over.id);
      console.log(originalLabelPos, moveToLabel, "rico poko");
      const newLabelArray = arrayMove(
        currentBoard.labels,
        originalLabelPos,
        moveToLabel
      );

      await replaceLabels(boardId, newLabelArray);

      await replaceLabels(boardId, newLabelArray);
    }

    if (active.id.length === 5) {
      const { groupIndex: originalGroupPos, taskIndex: originalTaskPos } =
        getTaskPos(active.id);
      const { groupIndex: moveToGroupPos, taskIndex: moveToTaskPos } =
        getTaskPos(over.id);

      if (originalGroupPos !== moveToGroupPos) {
        console.log("move to another group");
        const movedTask = groups[originalGroupPos].tasks[originalTaskPos];

        groups[originalGroupPos].tasks.splice(originalTaskPos, 1);

        groups[moveToGroupPos].tasks.splice(moveToTaskPos, 0, movedTask);
      }

      const newTaskOrder = arrayMove(
        groups[originalGroupPos].tasks,
        originalTaskPos,
        moveToTaskPos
      );
      groups[originalGroupPos].tasks = newTaskOrder;

      console.log(newTaskOrder);
    }

    const originalPos = getGroupPos(active.id);
    const moveToPos = getGroupPos(over.id);
    const newGroupsOrder = arrayMove(groups, originalPos, moveToPos);
    console.log(newGroupsOrder);

    await replaceGroups(boardId, newGroupsOrder);
  }

  function updateFixedGroup(groupId, yPos) {
    setGoupTitlesYPosition(prev => ({ ...prev, [groupId]: yPos }))
    let groupIdToFixed = ''
    let highestFixedHeight = -Infinity
    for (const groupId in goupTitlesYPosition) {
      if (goupTitlesYPosition[groupId] < 260 && 
        goupTitlesYPosition[groupId] >= highestFixedHeight) {
          highestFixedHeight = goupTitlesYPosition[groupId]
          groupIdToFixed = groupId
      }
    }

    setFixedGroup(groups.find(group => group.id === groupIdToFixed))
  }
  
  function updateExpandedGroups(groupId, expanded) {
    setExpandedGroupsId(prev => {
        if (expanded) 
            return prev.includes(groupId) ? prev : [...prev, groupId]
         else 
            return prev.filter(id => id !== groupId)
    })
  }

  function isFixedGroupExpanded(){
    return fixedGroup && expandedGroupsId && 
    expandedGroupsId.some(groupId=> groupId === fixedGroup.id)
  }


  return (
    <div className="board-details" ref={boardDetailsRef}>
      <BoardDetailsHeader
        handleAddTask={handleAddTask}
        boardTitle={currentBoard.title}
        boardId={currentBoard._id}
        boardColumnsFilter={boardColumnsFilter}
        handleFilteredLabel={handleFilteredLabel}
      />


      {
          isFixedGroupExpanded() &&
          <div className="sticky-labels">
            <LabelsGrid 
                    boardId={boardId}
                    group={fixedGroup}
                    labels={currentBoard.labels}
                    handleMasterCheckboxClick={handleMasterCheckboxClick}
                    checkedGroups={checkedGroups}
                    isFixed={true}
              />
          </div>

      }

      {currentBoard.groups.length > 0 ? (
        <section className="group-list"
        style={{marginTop:`${isFixedGroupExpanded() ? '-37px' : '0px'}`}}>
          <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={groups.map((group) => group.id)}
              strategy={verticalListSortingStrategy}
            >
              {groups.map((group, index) => (
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
                  handleMasterCheckboxClick={handleMasterCheckboxClick}
                  handleCheckBoxClick={handleCheckBoxClick}
                  handleAddTask={handleAddTask}
                  handleGroupNameChange={handleGroupNameChange}
                  handleDelete={handleDelete}
                  boardId={boardId}
                  users={users}
                  chatTempInfoUpdate={chatTempInfoUpdate}
                  openChat={openChat}
                  boardScroll={boardScroll}
                  updateFixedGroup={updateFixedGroup}
                  fixedGroup={fixedGroup}
                  updateExpandedGroups={updateExpandedGroups}
                />
              ))}
            </SortableContext>
          </DndContext>
          <button className="modal-save-btn" onClick={handleAddGroup}>
            +Add a new group
          </button>
          {checkedBoxes.length > 0 && (
            <SelectedTasksModal
              boardId={boardId}
              checkedTasks={checkedBoxes}
              handleDeleteTasks={handleDeleteTasks}
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
      {/* </section> */}
    </div>
  );
};

export default BoardDetails;
