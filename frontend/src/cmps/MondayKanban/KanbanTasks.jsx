import { useRef, useEffect, useState, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { getSvg } from "../../services/svg.service";
import { Popover, MenuItem, Typography } from "@mui/material";
import { openModal, closeModal } from "../../store/actions/boards.actions";
import { useSelector } from "react-redux";
import { boardService } from "../../services/board";
import ReactDOM from "react-dom";
import { ChatModal } from "../dynamicCmps/modals/ChatModal";
import { utilService } from "../../services/util.service";

export function KanbanTasks({
  title,
  task,
  onUpdateTaskTitle,
  onRemove,
  cellId,
  chatTempInfoUpdate,
  openChat,
  onTaskUpdate
}) {
  const openModals = useSelector((state) => state.boardModule.openModals);
  const users = useSelector((state) => state.userModule.users);
  const loggedinUser = useSelector((state) => state.userModule.user);
  const [inputValue, setInputValue] = useState(title);
  const inputRef = useRef(null);
  const spanRef = useRef(null);
  const [openAnimation, setOpenAnimation] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const modalRef = useRef(null);
  const isChatWasOpen = boardService.getOpenChat();

  const chatId = `chat-${task.id}`;

  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      spanRef.current.textContent = inputValue || title;
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 5}px`;
    }
  }, [inputValue, title]);

  useEffect(() => {
    // in this way the modal wont show itself after refresh
    setTimeout(() => setOpenAnimation(false), 50);
    // when user refresh the page while modal was open
    if (isChatWasOpen === chatId) {
      modalToggle(chatId);
    }
  }, []);

  function chatAnimation(isEnter) {
    if (!modalRef.current) return;

    const missingStyle = {
      position: "fixed",
      top: "0px",
      right: "0px",
      opacity: 1,
      zIndex: 100,
    };

    if (isEnter) {
      utilService.animateCSS(
        modalRef.current,
        "fadeInRightBig",
        0.3,
        missingStyle
      );
      setOpenAnimation(false);
    } else
      utilService.animateCSS(
        modalRef.current,
        "fadeOutRightBig",
        0.3,
        missingStyle
      );
  }

  const miniLabels = useMemo(
    () => ({
      data: [
        task.cells.find((cell) => cell.labelId === cellId),
        task.cells.find((cell) => cell.type === "priority"),
        task.cells.find((cell) => cell.type === "date"),
      ],
      members: task.cells.find((cell) => cell.type === "members"),
    }),
    [task, cellId]
  );

  const chatPrevInfo = boardService.getChatTempInfo(chatId);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function modalToggle(modalId) {
    if (modalId === chatId) {
      if (openModals.some((modId) => modId === modalId)) {
        closeModal(modalId);
      } else {
        openModal(modalId);
      }
    } else {
      if (openModals.some((modId) => modId === modalId)) {
        // Close modal
        chatAnimation(false);
        setTimeout(() => closeModal(chatId), 275);
      } else {
        // Open modal
        setOpenAnimation(true);
        openModal(chatId);
        setTimeout(() => chatAnimation(true), 10); // Wait for ref to exists
      }
    }
  }

  function onStatusChange(status) {
    onTaskUpdate({ ...miniLabels.data[0], value: status });
    modalToggle();
  }

  function onPriorityChange(priority) {
    onTaskUpdate({ ...miniLabels.data[1], value: priority });
    modalToggle();
  }

  function onAddReply(commentSentTime, replyTxt) {
    const newReply = {
      userId: loggedinUser._id,
      sentAt: new Date().getTime(),
      text: replyTxt,
    };
    const updatedChat = task.cells[0].value.chat.map((comment) => {
      return comment.sentAt === commentSentTime
        ? { ...comment, replies: [newReply, ...comment.replies] }
        : comment;
    });
    onTaskUpdate({
      ...task.cells[0],
      value: { ...task.cells[0].value, chat: updatedChat },
    });
  }

  function onAddComment(comment, sentAt) {
    const newComment = {
      userId: loggedinUser._id,
      sentAt,
      text: comment,
      replies: [],
    };
    onTaskUpdate({
      ...task.cells[0],
      value: {
        ...task.cells[0].value,
        chat: [newComment, ...task.cells[0].value.chat],
      },
    });
  }

  function onUpdateTitleInChat(text) {
    onTaskUpdate({
      ...task.cells[0],
      value: { ...task.cells[0].value, title: text },
    });
  }

  return (
    <div className="kanban-task">
      <div className="task-header">
        <span className="task-title">
          <span ref={spanRef} className="hidden-input"></span>

          <input
            ref={inputRef}
            className="name-change-input"
            type="text"
            placeholder={inputValue}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => onUpdateTaskTitle(inputValue, task)}
          />
        </span>

        <div className="task-icon-box">
          <IconButton>{getSvg("pen-icon")}</IconButton>

          <IconButton
            size="small"
            className="task-options"
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </IconButton>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={() => onRemove(task)}>
              {getSvg("trash2")}
              <span style={{ marginLeft: "1rem", fontWeight: "100" }}>
                Delete Task{" "}
              </span>
            </MenuItem>
          </Popover>
        </div>
      </div>

      <section>
        <div className="task-mini-labels">
          {miniLabels.data
            .filter((label) => label.value)
            .map((label, idx) => {
              if (!label) return null;
              return (
                <div
                  key={idx}
                  className={`mini-label ${
                    typeof label.value.text === "string"
                      ? label.value.text === ""
                        ? "blank-label"
                        : ""
                      : ""
                  }`}
                  style={{
                    backgroundColor: label.value.color,
                  }}
                >
                  <span>
                    {label.text
                      ? label.text
                      : typeof label.value.text === "string"
                      ? label.value.text
                      : label.value}
                  </span>
                </div>
              );
            })}
        </div>
      </section>

      <div className="task-footer">
        {miniLabels.members ? (
          <div className="members-cell">
            {miniLabels.members.value.slice(0, 4).map((member, idx) => (
              <img key={idx} src={member.imgUrl} alt={member.name} />
            ))}
          </div>
        ) : null}

        <div className="footer-icon-box" onClick={() => modalToggle(chatId)}>
          <IconButton size="small" className="task-icon">
            {getSvg("chat-icon")}
          </IconButton>
        </div>
      </div>
      {openModals.some((mdlId) => mdlId === chatId) &&
        ReactDOM.createPortal(
          <div
            ref={modalRef}
            style={{
              visibility: openAnimation ? "hidden" : "visible",
            }}
          >
            <ChatModal
              onAddReply={onAddReply}
              onAddComment={onAddComment}
              chatId={chatId}
              cellInfo={task.cells[0]}
              users={[...users]}
              loggedinUser={loggedinUser}
              onUpdateTitleInChat={onUpdateTitleInChat}
              modalToggle={() => modalToggle(chatId)}
              chatTempInfoUpdate={chatTempInfoUpdate}
              chatPrevInfo={chatPrevInfo}
              openChat={openChat}
            />
          </div>,
          document.body // Appends the modal properly
        )}
    </div>
  );
}
