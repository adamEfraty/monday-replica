import { DateCell } from "./dynamicCmps/DateCell.jsx";
import { Members } from "./dynamicCmps/Members.jsx";
import { Status } from "./dynamicCmps/Status.jsx";
import { TaskTitle } from "./dynamicCmps/TaskTitle.jsx";
import { Priority } from "./dynamicCmps/Priority.jsx";
import { AddTask } from "./AddTask.jsx";
import { P_Priority } from "./dynamicCmps/progressCmps/P_Priority.jsx";
import { P_Status } from "./dynamicCmps/progressCmps/P_Status.jsx";
import { P_Date } from "./dynamicCmps/progressCmps/P_Date.jsx";
import { P_Members } from "./dynamicCmps/progressCmps/P_Members.jsx";
import { AddLabel } from "./AddLabel.jsx";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { removeTask } from "../store/actions/boards.actions.js";
import { horizontalListSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskPreview } from "./TaskPreview.jsx";
import { Label } from "./Label.jsx";
import { LabelTitle } from "./LabelTitle.jsx";
import { MiniGroup } from "./MiniGroup.jsx";
import { GroupTitle } from "./GroupTitle.jsx";
import { LabelsGrid } from "./LabelsGrid.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const GroupPreview = ({
  labels,
  group,
  loggedinUser,
  progress,
  onTaskUpdate,
  checkedBoxes,
  checkedGroups,
  handleCheckBoxClick,
  handleMasterCheckboxClick,
  handleAddTask,
  handleGroupNameChange,
  handleDelete,
  boardId,
  users,
  chatTempInfoUpdate,
  openChat,
  id,
  boardScroll,
  updateFixedGroup,
  fixedGroup,
  updateExpandedGroups,
  isDragging,
  isDraggingTask,
  labelsLength,
  provided,

}) => {
  const [expanded, setExpanded] = useState(true);
  const [groupTitle, setGroupTitle] = useState(group.title);
  const filterBy = useSelector((state) => state.boardModule.filterBy);


  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);

  const id1 = open ? 'simple-popover' : undefined;
  const id2 = open2 ? 'simple-popover' : undefined;




  const titleHead = { color: group.color };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,

  };


  const titleRef = useRef(null)
  const [titlePositionY, setTitlePositionY] = useState(0)

  useEffect(() => {

    if (titleRef.current) {
      const yPosition = titleRef.current.getBoundingClientRect().y
      setTitlePositionY(yPosition)
      updateFixedGroup(group.id, yPosition)
    }

  }, [boardScroll])

  useEffect(() => {
    updateExpandedGroups(group.id, expanded)
  }, [expanded])


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorE2(null);
  };

  function handelExpandedChange(newExpantion) {
    setExpanded(newExpantion)
  }

  function handelGroupTitleChange(newGroupTitle) {
    setGroupTitle(newGroupTitle)
  }

  return (
    <div style={style} ref={setNodeRef} className="group-preview">


      {
        !isDragging && expanded && fixedGroup && fixedGroup.id === group.id &&
        <>
          <div className="fixed-area">
            <GroupTitle
              boardId={boardId}
              group={group}
              groupTitle={groupTitle}
              handleClick2={handleClick2}
              id2={id2}
              open2={open2}
              anchorE2={anchorE2}
              handleClose2={handleClose2}
              titleHead={titleHead}
              expanded={expanded}
              attributes={attributes}
              listeners={listeners}
              handleGroupNameChange={handleGroupNameChange}
              handelExpandedChange={handelExpandedChange}
              handelGroupTitleChange={handelGroupTitleChange}
              handleDelete={handleDelete}
              isMiniGroup={false}
              isFixed={true}
              dragHandleProps={provided.dragHandleProps}

            />
          </div>
        </>
      }


      {!isDragging && expanded && <GroupTitle
        titleRef={titleRef}
        boardId={boardId}
        group={group}
        groupTitle={groupTitle}
        handleClick2={handleClick2}
        id2={id2}
        open2={open2}
        anchorE2={anchorE2}
        handleClose2={handleClose2}
        titleHead={titleHead}
        expanded={expanded}
        attributes={attributes}
        listeners={listeners}
        handleGroupNameChange={handleGroupNameChange}
        handelExpandedChange={handelExpandedChange}
        handelGroupTitleChange={handelGroupTitleChange}
        handleDelete={handleDelete}
        isMiniGroup={false}
        isFixed={false}
        dragHandleProps={provided.dragHandleProps}

      />
      }


      <section className="task-list">
        {/* Render group labels by labels array */}

        {!isDragging && expanded ? (
          <div>

            <LabelsGrid
              boardId={boardId}
              group={group}
              labels={labels}
              handleMasterCheckboxClick={handleMasterCheckboxClick}
              checkedGroups={checkedGroups}
              isFixed={false}
              expanded={expanded}
              labelsLength={labelsLength}
            />

            {/* Render tasks by cmp order */}
            <Droppable droppableId={group.id} type="task">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
                  {group.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskPreview
                            id={task?.id}
                            key={task.id}
                            task={task}
                            group={group}
                            labels={labels}
                            loggedinUser={loggedinUser}
                            onTaskUpdate={onTaskUpdate}
                            removeTask={removeTask}
                            boardId={boardId}
                            users={users}
                            chatTempInfoUpdate={chatTempInfoUpdate}
                            openChat={openChat}
                            checkedBoxes={checkedBoxes}
                            handleCheckBoxClick={handleCheckBoxClick}
                            boardScroll={boardScroll}
                            labelsLength={labelsLength}
                            isDragging={isDragging}
                            isDraggingTask={isDraggingTask}
                          />                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <AddTask group={group}
              handleAddTask={handleAddTask}
              TaskTitleLength={labels[0].width}
              labelsLength={labelsLength} />

            {/* Render progress by progress array */}
            <section
              className="progress-grid"
              style={{
                gridTemplateColumns: `10px ${labels.map(label => `${label.width}px`).join(' ')} auto`
              }}
            >
              <div className="invisible">
                <div className="white-cover" />
              </div>

              {labels.map((lable, index) =>
                progress.includes(lable.type) ? (
                  <div className={`prog-box with-${lable.type}`} key={`progress-${lable.id}`}>
                    <ProgressCmd
                      label={lable}
                      tasks={group.tasks}
                      index={index}

                    />
                  </div>
                ) : (
                  <div className={lable.type} key={`progress-${index} `}>
                    {lable.type === 'taskTitle' && <div className="round-corner" />}
                  </div>
                )
              )}
              <div className="empty-space" />
            </section>
          </div >
        ) : <MiniGroup boardId={boardId}
          group={group}
          groupTitle={groupTitle}
          handleClick2={handleClick2}
          id2={id2}
          open2={open2}
          anchorE2={anchorE2}
          handleClose2={handleClose2}
          titleHead={titleHead}
          expanded={expanded}
          attributes={attributes}
          listeners={listeners}
          handleGroupNameChange={handleGroupNameChange}
          handelExpandedChange={handelExpandedChange}
          handelGroupTitleChange={handelGroupTitleChange}
          handleDelete={handleDelete}
          dragHandleProps={provided.dragHandleProps} />}

      </section >
    </div >
  );
};



const ProgressCmd = ({
  label,
  tasks,
  index,

}) => {

  switch (label.type) {
    case "priority":
      return (
        <P_Priority
          tasks={tasks}
          labelId={label.id}
          index={index}
        />
      )

    case "status":
      return (
        <P_Status
          tasks={tasks}
          labelId={label.id}
          index={index}
        />
      )

    case "date":
      return (
        <P_Date
          tasks={tasks}
          labelId={label.id}
          index={index}
        />
      )

    case "members":
      return (
        <P_Members
          tasks={tasks}
          labelId={label.id}
          labelWidth={label.width}
          index={index}
        />
      )

    default:
      console.error(`Unknown progress component type: ${progressType}`)
      return <div>Unknown component: {progressType}</div>
  }
}


