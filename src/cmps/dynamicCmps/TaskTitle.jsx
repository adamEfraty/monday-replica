import { useState, useRef, useEffect } from "react"
import { showErrorMsg } from '../../services/event-bus.service.js'
import { ChatModal } from "./modals/ChatModal.jsx"
import ChatIcon from '@mui/icons-material/MapsUgcOutlined';
import { openModal, closeModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";
import { utilService } from "../../services/util.service.js";
import { boardService } from "../../services/board.service.js";

export function TaskTitle({ cellInfo,
  users,
  loggedinUser,
  chat,
  group,
  task,
  text,
  onTaskUpdate,
  chatTempInfoUpdate,
  openChat,
  checkedBoxes,
  handleCheckBoxClick
}) {

  const [onEditMode, setOnEditMode] = useState(false)
  const [textToEdit, setTextToEdit] = useState(text)

  // so we won't see the chat before the animation
  const [openAnimation, setOpenAnimation] = useState(false)

  const openModals = useSelector(state => state.boardModule.openModals)
  const modal = openModals.some(modalId => modalId === (cellInfo.taskId + cellInfo.labelId))

  const modalRef = useRef(null)
  const ChatButtonRef = useRef(null)

  const chatPrevInfo = boardService.getChatTempInfo(cellInfo.taskId + cellInfo.labelId)
  const isChatWasOpen = boardService.getOpenChat()

  useEffect(()=>{
    // when user refresh the page while modal was open
    if(!modal && isChatWasOpen === (cellInfo.taskId + cellInfo.labelId)){
      modalToggle()
    }
  },[])


  function chatAnimation(isEnter) {
    if (!modalRef.current) return

    const missingStyle = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      opacity: 1,
      zIndex: 100,
    }

    if (isEnter) {
      utilService.animateCSS(modalRef.current, 'fadeInRightBig', 0.3, missingStyle)
      setOpenAnimation(false)
    } 
    else utilService.animateCSS(modalRef.current, 'fadeOutRightBig', 0.3, missingStyle)
  }

  function modalToggle() {
    if (modal) {
      // Close modal
      chatAnimation(false)
      setTimeout(() => closeModal(cellInfo.taskId + cellInfo.labelId), 275)
    } else {
      // Open modal
      setOpenAnimation(true)
      openModal(cellInfo.taskId + cellInfo.labelId)
      setTimeout(() => chatAnimation(true), 10) // Wait for ref to exists

    }
  }

  function onAddComment(comment) {
    const newComment = {
      userId: loggedinUser.id,
      sentAt: new Date().getTime(),
      text: comment,
      replies: []
    }
    onTaskUpdate({...cellInfo, value: {...cellInfo.value, chat: [newComment, ...chat]}})
  }

  function onAddReply(commentSentTime, replyTxt) {
    const newReply = { userId: loggedinUser.id, sentAt: new Date().getTime(), text: replyTxt }
    const updatedChat = chat.map(comment => {
      return comment.sentAt === commentSentTime
        ? { ...comment, replies: [newReply, ...comment.replies] }
        : comment
    })
    onTaskUpdate({...cellInfo, value: {...cellInfo.value, chat: updatedChat}})  }


  function toggleEditMode() {
    if (onEditMode) {

      if (!checkTitleValidation(textToEdit)) {
        setTextToEdit(text)
        showErrorMsg("Name can't be empty")
      }

      else {
        onTaskUpdate({...cellInfo, value: {...cellInfo.value, title: textToEdit}})
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
    onTaskUpdate({...cellInfo, value: {...cellInfo.value, title: text}})
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
        <div ref={modalRef} style={openAnimation?{visibility: 'hidden'}: {visibility: 'visible'}}>
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
            chatPrevInfo={chatPrevInfo} 
            openChat={openChat}/>
        </div>
      }

    </>
  )
}
