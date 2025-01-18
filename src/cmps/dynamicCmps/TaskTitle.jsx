import {useState, useRef, useEffect } from "react"
import { showErrorMsg } from '../../services/event-bus.service.js'
import { ChatModal } from "./modals/ChatModal.jsx"
import ChatIcon from '@mui/icons-material/MapsUgcOutlined';
import { openModal } from '../../store/actions/boards.actions.js'
import { useSelector } from "react-redux";

export function TaskTitle ({cellId, 
  users, 
  loggedinUser, 
  chat, 
  group, 
  task, 
  text, 
  onTaskUpdate }) 

  {
  const [onEditMode, setOnEditMode] = useState(false)
  const [textToEdit, setTextToEdit] = useState(text)

  const openModalId = useSelector(state => state.boardModule.openModal)
  const modal = (openModalId === cellId)

  const modalRef = useRef(null)
  const ChatButtonRef = useRef(null)

    // close and open modal as needed
    function modalToggle() {
        modal
        ? openModal(null)
        : openModal(cellId)
    }

  function handleClickOutsideModal(event) {
    if (!modalRef.current.contains(event.target)
      && !ChatButtonRef.current.contains(event.target))
      modalToggle()
  }

  useEffect(() => {
    if (modal) document.addEventListener
      ('mousedown', handleClickOutsideModal)
    else document.removeEventListener
      ('mousedown', handleClickOutsideModal)
    return () => document.removeEventListener
      ('mousedown', handleClickOutsideModal)

  }, [modal])

  function onAddComment(comment){
    const newComment = {userId: loggedinUser.id,
      sentAt: new Date().getTime(), 
      text: comment, 
      replies:[]
    }
    onTaskUpdate({group, task, type:'chat', value: [newComment, ...chat]})
  }

  function onAddReply(commentSentTime, replyTxt){
    const newReply = {userId: loggedinUser.id, sentAt: new Date().getTime(), text: replyTxt}
    const updatedChat = chat.map(comment => {
      return comment.sentAt === commentSentTime
        ? { ...comment, replies: [newReply, ...comment.replies] }
        : comment
    })

    console.log(updatedChat[0].replies) // reply not here
    onTaskUpdate({ group, task, type: 'chat', value: updatedChat })
  }

  // toggel btween spectate and edit mode
  function toggleEditMode() {
    if (onEditMode) {
      // not alowing user insert unvalid title
      if (!checkTitleValidation(textToEdit)) {
        setTextToEdit(text)
        showErrorMsg("Name can't be empty")
      }
      // if everyting ok update title changes
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

  function onUpdateTitleInChat(text){
    onTaskUpdate({ group, task, type: 'taskTitle', value: text })
  }

  return (
    <>
      <section className="task-title">
        <div className="title-part">
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
        <div style={{ borderLeft: '1px solid rgb(232, 232, 232)', padding: '.8rem', color: 'rgb(128, 128, 128)', cursor: 'pointer' }}>
          <ChatIcon onClick={modalToggle} ref={ChatButtonRef} />
        </div>
      </section >

      {/*chat modal*/}
      {modal && 
          <div ref={modalRef}>
            <ChatModal 
              onAddReply={onAddReply} 
              onAddComment={onAddComment} 
              chat={chat}
              users={[...users]}
              loggedinUser={loggedinUser}
              text={text}
              onUpdateTitleInChat={onUpdateTitleInChat}
              modalToggle={modalToggle}/>
          </div>
        }

    </>
  )
}

