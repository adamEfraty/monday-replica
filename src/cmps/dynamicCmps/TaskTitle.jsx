import { useState, useRef, useEffect } from "react"
import { showErrorMsg } from '../../services/event-bus.service.js'
import { ChatModal } from "./modals/ChatModal.jsx"
import ChatIcon from '@mui/icons-material/MapsUgcOutlined';
import { openModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { utilService } from "../../services/util.service.js";

export function TaskTitle({ cellId,
  users,
  loggedinUser,
  chat,
  group,
  task,
  text,
  onTaskUpdate,
  chatTempInfoUpdate,
  chatInfo,
  checkedBoxes,
  handleCheckBoxClick
}) {
  const [onEditMode, setOnEditMode] = useState(false)
  const [textToEdit, setTextToEdit] = useState(text)

  const openModalId = useSelector(state => state.boardModule.openModal)
  const modal = (openModalId === cellId)

  const modalRef = useRef(null)
  const ChatButtonRef = useRef(null)

  useEffect(() => {
    if (modalRef.current && modal) {
      chatAnimation(true)
    }
  }, [modal])

  function chatAnimation(isEnter) {
    isEnter
      ? utilService.animateCSS(modalRef.current, 'fadeInRightBig', 0.3,
        {
          position: 'fixed',
          top: '0px',
          right: '0px',
          opacity: 1,
          zIndex: 100,
        })
      : utilService.animateCSS(modalRef.current, 'fadeOutRightBig', 0.3)

  }

  // close and open modal as needed
  function modalToggle() {
    if (modal) {
      chatAnimation(false)
      setTimeout(() => openModal(null), 275)
      chatTempInfoUpdate(null, chatInfo.width)
    } else openModal(cellId)
  }

  function onAddComment(comment) {
    const newComment = {
      userId: loggedinUser.id,
      sentAt: new Date().getTime(),
      text: comment,
      replies: []
    }
    onTaskUpdate({ group, task, type: 'chat', value: [newComment, ...chat] })
  }

  function onAddReply(commentSentTime, replyTxt) {
    const newReply = { userId: loggedinUser.id, sentAt: new Date().getTime(), text: replyTxt }
    const updatedChat = chat.map(comment => {
      return comment.sentAt === commentSentTime
        ? { ...comment, replies: [newReply, ...comment.replies] }
        : comment
    })
    onTaskUpdate({ group, task, type: 'chat', value: updatedChat })
  }


  function toggleEditMode() {
    if (onEditMode) {

      if (!checkTitleValidation(textToEdit)) {
        setTextToEdit(text)
        showErrorMsg("Name can't be empty")
      }

      else {
        onTaskUpdate({ group, task, type: 'taskTitle', value: textToEdit })
      }
    }

    setOnEditMode(prev => !prev)
  }


  function checkTitleValidation(title) {
    // not alowing user insert blank title
    if (title === '') return false
    return true
  }

  // if user press enter go to spectate mode
  function handleKeyDown(event) {
    if (event.key === "Enter")
      toggleEditMode()
  }

  function handleLongText(text, maxLetters = 30) {
    if (text.length < maxLetters) return text
    else {
      const shortenText = `${text.slice(0, maxLetters)}...`
      return shortenText
    }
  }

  function onUpdateTitleInChat(text) {
    onTaskUpdate({ group, task, type: 'taskTitle', value: text })
  }

  return (
    <>
      <section className="task-title">
        <div className="checkbox-taskName">
          <div className="input-styles">
            <input
              type="checkbox"
              checked={checkedBoxes.some((subArr) => subArr[1] == task.id)}
              onChange={() => handleCheckBoxClick(group.id, task.id)}
            />
          </div>
          <div className="title-part ">
            {
              !onEditMode
                ? <span onClick={toggleEditMode}>{handleLongText(text, 12)}</span>
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
        <div className="chat-icon">
          <ChatIcon onClick={modalToggle} ref={ChatButtonRef} />
        </div>
      </section >

      {/*chat modal*/}
      {
        modal &&
        <div ref={modalRef}>
          <ChatModal
            onAddReply={onAddReply}
            onAddComment={onAddComment}
            chat={chat}
            users={[...users]}
            loggedinUser={loggedinUser}
            text={text}
            onUpdateTitleInChat={onUpdateTitleInChat}
            modalToggle={modalToggle}
            chatTempInfoUpdate={chatTempInfoUpdate}
            cellId={cellId}
            chatInfo={chatInfo} />
        </div>
      }

    </>
  )
}

