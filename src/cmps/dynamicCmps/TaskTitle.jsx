import { useState, useRef, useEffect } from "react"
import { showErrorMsg } from '../../services/event-bus.service.js'
import { ChatModal } from "./modals/ChatModal.jsx"

export function TaskTitle ({loggedinUser, usersInBoard, chat, group, task, text, onTaskUpdate }) {
  const [onEditMode, setOnEditMode] = useState(false)
  const [textToEdit, setTextToEdit] = useState(text)

  const [modal, setModal] = useState(false)
  const modalRef = useRef(null)
  const ChatButtonRef = useRef(null)

  // clase and open modal as needed
  function modalToggle() {
    setModal(prev => !prev)
  }

  //if user click outside modal close it
  function handleClickOutsideModal(event) {
    if (!modalRef.current.contains(event.target)
        && !ChatButtonRef.current.contains(event.target))
        modalToggle()
  }
  
      // open listener to handleClickOutsideModal only when modal open
  useEffect(() => {
      if (modal) document.addEventListener
          ('mousedown', handleClickOutsideModal)
        else document.removeEventListener
          ('mousedown', handleClickOutsideModal)
      return () => document.removeEventListener
          ('mousedown', handleClickOutsideModal)
  
  }, [modal])

  function onAddComment(comment){
    const newComment = {userId: loggedinUser.id, // temporary defult user
      sentAt: new Date(), 
      text: comment, 
      replies:[]
  }
    onTaskUpdate({group, task, type:'add comment', value: [newComment, ...chat]})
  }

  function onAddReply(commentSentTime, replyTxt){
    const newReply = {userId: loggedinUser.id, sentAt: new Date(), text: replyTxt}
    const updatedChat = chat.map(comment => {
      return comment.sentAt === commentSentTime
      ? {...comment, replies: [newReply, ...comment.replies]}
      : comment
  })
   
    console.log(updatedChat[0].replies) // reply not here
    onTaskUpdate({group, task, type:'add comment', value: updatedChat})
  }

  // toggel btween spectate and edit mode
  function toggleEditMode() {
    if (onEditMode) {
        // not alowing user insert unvalid title
        if(!checkTitleValidation(textToEdit)) {
            setTextToEdit(text)
            showErrorMsg("Name can't be empty")
        }
        // if everyting ok update title changes
        else {
            onTaskUpdate({group, task, type: 'title update', value: textToEdit})
        }
    }
      
    setOnEditMode(prev => !prev)
  }


  function checkTitleValidation(title){
    // not alowing user insert blank title
    if(title === '') return false
    return true
  }

  // if user press enter go to spectate mode
  function handleKeyDown(event) {
    if (event.key === "Enter")
      toggleEditMode()
  }

  function handleLongText(text, maxLetters = 30){
      if(text.length < maxLetters) return text
      else{
        const shortenText = `${text.slice(0, maxLetters)}...`
        return shortenText
      }
  }

  return ( 
    <>
      <section className="task-title">
        <div className="title-part">
          {
            !onEditMode
            ? <span onClick={toggleEditMode}>{handleLongText(text)}</span> 
            : <input
              autoFocus={true}
              value={textToEdit}
              onChange={event => setTextToEdit(event.target.value)}
              // if user out of input focuse OR pressing enter, update title
              onBlur={toggleEditMode}
              onKeyDown={handleKeyDown}
              type="text"
            />
          }
        </div>

        
        <button 
        ref={ChatButtonRef} 
        onClick={modalToggle}
        >💬</button>

      </section>

      {/*chat modal*/}
      {modal && 
          <div ref={modalRef}>
            <ChatModal 
              onAddReply={onAddReply} 
              onAddComment={onAddComment} 
              usersInBoard={usersInBoard} 
              chat={chat}/>
          </div>
        }

    </>
  )
}

