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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


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

  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingTask, setIsDraggingTask] = useState(false)
  const [allTasks, setAllTasks] = useState(
    groups.flatMap(group => group.tasks.map(task => ({ ...task, groupId: group.id })))
  );


  const [labelsLength, setLabelsLength] = useState()
  const [zoomLevel, setZoomLevel] = useState(window.devicePixelRatio);

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
      boards,
      boardId
    );
    filteredColumns &&
      setBoardColumnsFilter(
        filteredColumns.find((board) => board.id === boardId)
      );
    console.log(boardColumnsFilter)
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
        console.log('im here rick', boardColumnsFilter)
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

  useEffect(() => {
    if (currentBoard && boardDetailsRef.current) {
      const scrollPositionY = boardDetailsRef.current.scrollTop
      const scrollPositionX = boardDetailsRef.current.scrollLeft
      setBoardScroll({ x: scrollPositionX, y: scrollPositionY })
      setLabelsLength(currentBoard.labels.reduce((acc, label) => acc + label.width, 0))
    }
  }, [zoomLevel])

  useEffect(() => {
    if (currentBoard) {
      setLabelsLength(currentBoard.labels.reduce((acc, label) => acc + label.width, 0))
    }
  }, [currentBoard])



  useEffect(() => {
    if (groups.length) {
      setFixedGroup(groups[0])
      setGoupTitlesYPosition({})
    }
    else setFixedGroup(null)
  }, [groups])

  useEffect(() => {
    function handleResize() {
      setZoomLevel(window.devicePixelRatio)
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

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



  const handleDragStart = (start) => {
    if (start.type === "group") {
      setIsDragging(true);
    }
    setIsDraggingTask(true)

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

    }

    else if (type === "task") {
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
        movedTask.cells[0].value.activities = movedTask.cells[0].value.activities.map(e => ({
          ...e,
          activity: {
            ...e.activity,
            groupId: destGroup.id
          }
        }))
        destTasks.splice(destination.index, 0, movedTask);
        sourceGroup.tasks = sourceTasks;
        destGroup.tasks = destTasks;
      }

      await replaceGroups(boardId, groups);
    }

    else if (type === "label") {
      const reorderedLabels = Array.from(currentBoard.labels);
      const [movedLabel] = reorderedLabels.splice(source.index, 1);
      reorderedLabels.splice(destination.index, 0, movedLabel);
      await replaceLabels(boardId, reorderedLabels);
    }
  };


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

  function isFixedGroupExpanded() {
    return fixedGroup && expandedGroupsId &&
      expandedGroupsId.some(groupId => groupId === fixedGroup.id)
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
        !isDragging && isFixedGroupExpanded() &&
        <div className="sticky-labels"
          style={{ width: (labelsLength < window.innerWidth - 320) ? 'calc(100vw - 320px)' : `${labelsLength + 150}px` }}>
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
          style={{ marginTop: `${isFixedGroupExpanded() ? '-37px' : '0px'}` }}>
          <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <Droppable droppableId="groups" type="group">
              {(provided) => (
                <section ref={provided.innerRef} {...provided.droppableProps} className="group-list"
                  style={{ width: (labelsLength < window.innerWidth - 320) ? 'calc(100vw - 320px)' : `${labelsLength + 150}px` }}>
                  {groups.map((group, index) => (
                    <Draggable key={group.id} draggableId={group.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
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
