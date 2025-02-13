import { useState, useRef, useEffect } from "react";
import { showErrorMsg } from "../../services/event-bus.service.js";
import { ChatModal } from "./modals/ChatModal.jsx";
import ChatIcon from "@mui/icons-material/MapsUgcOutlined";
import { openModal, closeModal } from "../../store/actions/boards.actions.js";
import { useSelector } from "react-redux";
import { utilService } from "../../services/util.service.js";
import { boardService } from "../../services/board.service.js";
import ReactDOM from "react-dom";

export function TaskTitle({
  cellInfo,
  users,
  loggedinUser,
  group,
  onTaskUpdate,
  chatTempInfoUpdate,
  openChat,
  checkedBoxes,
  handleCheckBoxClick,
  listeners,
  attributes,
  labelWidth,
}) {
  const [onEditMode, setOnEditMode] = useState(false);
  const [textToEdit, setTextToEdit] = useState(cellInfo.value.title);

  // so we won't see the chat before the animation
  const [openAnimation, setOpenAnimation] = useState(true);

  const chatId = `chat-${cellInfo.taskId}`;

  const openModals = useSelector((state) => state.boardModule.openModals);
  const modal = openModals.some((modalId) => modalId === chatId);

  const modalRef = useRef(null);
  const ChatButtonRef = useRef(null);

  const chatPrevInfo = boardService.getChatTempInfo(chatId);
  const isChatWasOpen = boardService.getOpenChat();

  useEffect(() => {
    // in this way the modal wont show itself after refresh
    setTimeout(() => setOpenAnimation(false), 50);
    // when user refresh the page while modal was open
    if (isChatWasOpen === chatId) {
      modalToggle();
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

  function modalToggle() {
    if (modal) {
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

  function onAddComment(comment, sentAt) {
    const newComment = {
      userId: loggedinUser.id,
      sentAt,
      text: comment,
      replies: [],
    };
    onTaskUpdate({
      ...cellInfo,
      value: { ...cellInfo.value, chat: [newComment, ...cellInfo.value.chat] },
    });
  }

  function onAddReply(commentSentTime, replyTxt) {
    const newReply = {
      userId: loggedinUser.id,
      sentAt: new Date().getTime(),
      text: replyTxt,
    };
    const updatedChat = cellInfo.value.chat.map((comment) => {
      return comment.sentAt === commentSentTime
        ? { ...comment, replies: [newReply, ...comment.replies] }
        : comment;
    });
    onTaskUpdate({
      ...cellInfo,
      value: { ...cellInfo.value, chat: updatedChat },
    });
  }

  function toggleEditMode() {
    if (onEditMode) {
      if (!checkTitleValidation(textToEdit)) {
        showErrorMsg("Name can't be empty");
      } else {
        onTaskUpdate({
          ...cellInfo,
          value: { ...cellInfo.value, title: textToEdit },
        });
      }
    }

    setOnEditMode((prev) => !prev);
  }

  function checkTitleValidation(title) {
    // not alowing user insert blank title
    if (title === "") return false;
    return true;
  }

  // if user press enter go to spectate mode
  function handleKeyDown(event) {
    if (event.key === "Enter") toggleEditMode();
  }

  function handleLongText(text) {
    const maxLetters = Math.floor(labelWidth / 7) - 32
    if (text.length < maxLetters) return text
    else {
      const shortenText = `${text.slice(0, maxLetters)}...`;
      return shortenText;
    }
  }

  function onUpdateTitleInChat(text) {
    onTaskUpdate({ ...cellInfo, value: { ...cellInfo.value, title: text } });
  }

  return (
    <>
      <section className="task-title">
        <div className="checkbox-taskName">
          <div className="input-styles">
            <input
              type="checkbox"
              checked={checkedBoxes.some(
                (subArr) => subArr[1] == cellInfo.taskId
              )}
              onChange={() => handleCheckBoxClick(group.id, cellInfo.taskId)}
            />
          </div>
          <div className="title-part ">
            {
              !onEditMode
                ? <span onClick={toggleEditMode}>{handleLongText(cellInfo.value.title)}</span>
                : <input
                  autoFocus={true}
                  value={textToEdit}
                  onChange={event => setTextToEdit(event.target.value)}
                  onBlur={toggleEditMode}
                  onKeyDown={handleKeyDown}
                  type="text"
                />
            }

          </div>
        </div>
        <div style={{ cursor: "grab" }} {...listeners} {...attributes}></div>
        <div className="chat-icon">
          <ChatIcon onClick={modalToggle} ref={ChatButtonRef} />
        </div>
      </section>

      {/*chat modal*/}
      {modal &&
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
              cellInfo={cellInfo}
              users={[...users]}
              loggedinUser={loggedinUser}
              onUpdateTitleInChat={onUpdateTitleInChat}
              modalToggle={modalToggle}
              chatTempInfoUpdate={chatTempInfoUpdate}
              chatPrevInfo={chatPrevInfo}
              openChat={openChat}
            />
          </div>,
          document.body // Appends the modal properly
        )}
    </>
  );
}
