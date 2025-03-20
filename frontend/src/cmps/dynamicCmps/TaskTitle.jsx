import { useState, useRef, useEffect } from "react"
import { ChatModal } from "./modals/ChatModal.jsx"
import ChatIcon from "@mui/icons-material/MapsUgcOutlined"
import { openModal, closeModal } from "../../store/actions/boards.actions.js"
import { useSelector } from "react-redux"
import { utilService } from "../../services/util.service.js"
import { boardService } from "../../services/board"
import ReactDOM from 'react-dom'
import { getSvg } from "../../services/svg.service.jsx"


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
  isHover,
  deleteModalToggle,
  dotsRef,
  isDraggingTask,
  setIsSelect,
  isSelect,
}) {

  //edit task title
  const [onEditMode, setOnEditMode] = useState(false)
  const [textToEdit, setTextToEdit] = useState(cellInfo.value.title)

  const inputRef = useRef(null)

  // so we won't see the chat before the animation
  const [openAnimation, setOpenAnimation] = useState(true)

  const chatId = `chat-${cellInfo.taskId}`

  const openModals = useSelector((state) => state.boardModule.openModals)
  const modal = openModals.some((modalId) => modalId === chatId)

  const modalRef = useRef(null)
  const ChatButtonRef = useRef(null)

  const chatPrevInfo = boardService.getChatTempInfo(chatId)
  const isChatWasOpen = boardService.getOpenChat()

  const deleteTaskModal = openModals.some((modalId) => modalId === 'delete-' + cellInfo.taskId)

  const isChecked = checkedBoxes.some((subArr) => subArr[1] == cellInfo.taskId)

  function handleClickOutsideInput(event) {
    if (inputRef.current &&!inputRef.current.contains(event.target))
      toggleEditMode()
}

useEffect(() => {
    if (onEditMode) {
        document.addEventListener('mousedown', handleClickOutsideInput)
    } else {
        document.removeEventListener('mousedown', handleClickOutsideInput)
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutsideInput)
    }
}, [onEditMode]);


  useEffect(() => {
    // in this way the modal wont show itself after refresh
    setTimeout(() => setOpenAnimation(false), 50);
    // when user refresh the page while modal was open
    if (isChatWasOpen === chatId) {
      modalToggle()
    }
  }, [])

  useEffect(()=>{
    if(isChecked || modal) setIsSelect(true)
    else setIsSelect(onEditMode)
  }, [isChecked, onEditMode, modal])


  function chatAnimation(isEnter) {
    if (!modalRef.current) return

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
      chatAnimation(false)
      setTimeout(() => closeModal(chatId), 275)
    } else {
      // Open modal
      setOpenAnimation(true)
      openModal(chatId)
      setTimeout(() => chatAnimation(true), 10) // Wait for ref to exists
    }
  }

  function onAddComment(comment, sentAt) {
    const newComment = {
      userId: loggedinUser._id,
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
      userId: loggedinUser._id,
      sentAt: new Date().getTime(),
      text: replyTxt,
    };
    const updatedChat = cellInfo.value.chat.map((comment) => {
      return comment.sentAt === commentSentTime
        ? { ...comment, replies: [newReply, ...comment.replies] }
        : comment
    });
    onTaskUpdate({
      ...cellInfo,
      value: { ...cellInfo.value, chat: updatedChat },
    })
  }

  function toggleEditMode() {
    if (onEditMode) {
      if (checkTitleValidation(textToEdit)){
        onTaskUpdate({
          ...cellInfo,
          value: { ...cellInfo.value, title: textToEdit },
        })
      }
    }

    setOnEditMode((prev) => !prev)
  }

  function checkTitleValidation(title) {
    // not alowing user insert blank title
    if (title === "") return false;
    return true
  }

  // if user press enter go to spectate mode
  function handleKeyDown(event) {
    if (event.key === "Enter") toggleEditMode()
  }

  function handleLongText(text) {
    const maxLetters = Math.floor(labelWidth / 7) - 25
    if (text.length < maxLetters) return text
    else {
      const shortenText = `${text.slice(0, maxLetters)}...`
      return shortenText
    }
  }

  function onUpdateTitleInChat(text) {
    onTaskUpdate({ ...cellInfo, value: { ...cellInfo.value, title: text } })
  }


  return (
    <>
      <section className="task-title" 
      style={{backgroundColor: isSelect ? '#CCE5FF' : (isHover ? '#F4F5F8' : 'white'),
        outline: (modal || onEditMode) ? 'solid 1px #0073EA' : 'none',
        outlineOffset: (modal || onEditMode) ? '-1px' : ''
      }}>

        {!isDraggingTask &&
          <div className="white-cover">
            <div ref={dotsRef} className="dots"
              style={{
                visibility: deleteTaskModal || isHover ? 'visible' : 'hidden',
                backgroundColor: deleteTaskModal && '#CAE3FD'
              }}
              onClick={deleteModalToggle}>
              {getSvg('horizontal-dots')}
            </div>
          </div>
        }


        <div className="checkbox-taskName">
          <div className="input-styles">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleCheckBoxClick(group.id, cellInfo.taskId)}
              style={{backgroundColor: isChecked ? `#0073EA` : 'white',
                border: isChecked && 'none',
              }}
            />
            <div className="check-icon"
            onClick={() => handleCheckBoxClick(group.id, cellInfo.taskId)}>
              {
                isChecked && getSvg('check')
              }
            </div>
          </div>
          <div className="drag-part" style={{ cursor: "grab" }} {...listeners} {...attributes}/>
          <div className="text-part">
          {
              !onEditMode
                ? <p onClick={toggleEditMode}>{handleLongText(cellInfo.value.title)}</p>
                : <input
                  ref={inputRef}
                  style={{width: `${labelWidth - 140}px`}}
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
        <div className="chat-icon"  onClick={modalToggle} ref={ChatButtonRef}
        style={{color: cellInfo.value?.chat?.length > 0 && '#0073EA'}}>
          { cellInfo.value?.chat?.length === 0 ?
            getSvg('chat-icon-empty')
            :
            <div>
              {getSvg('chat-icon')}
              <div className="circle">{cellInfo.value?.chat?.length}</div>
            </div>
          }
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
  )
}

          