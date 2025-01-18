import { simplifyTimeToStr } from "../../../services/util.service.js";
import { useState } from "react";
import { showErrorMsg } from '../../../services/event-bus.service.js'

export function ChatModal({ 
    loggedinUser, 
    users, 
    chat = [], 
    onAddComment, 
    onAddReply,
    text, 
    onUpdateTitleInChat,
    modalToggle}) 
    
    {
    const [onEditMode, setOnEditMode] = useState(false)
    const [textToEdit, setTextToEdit] = useState(text)

    const [newComment, setNewComment] = useState("");
    const [newReplies, setNewReplies] = useState(
        chat.map(comment => ({ id: comment.sentAt, text: "" })))

    console.log(users)

    // toggel btween spectate and edit mode
    function toggleEditMode() {
        if (onEditMode) {
            // not alowing user insert unvalid title
            if (!checkTitleValidation(textToEdit)) {
                setTextToEdit(text)
                showErrorMsg("Name can't be empty")
            }
            // if everyting ok update title changes
            else onUpdateTitleInChat(textToEdit)
        }
        setOnEditMode(prev => !prev)
    }

      function checkTitleValidation(title) {
        // not alowing user insert blank title
        if (title === '') return false
        return true
      }

    // later users going to be the only users in board,
    // therfore im not using getById function in user service
    function getUserById(userId) {
        return users.find(member => member.id === userId) || {}
    }

    function handleCommentSubmit(event) {
        event.preventDefault()
        if (newComment !== "") {
            onAddComment(newComment)
            setNewComment("")
        }
    }

    // if user press enter go to spectate mode
    function handleKeyDown(event) {
    if (event.key === "Enter")
      toggleEditMode()
    }

    function findNewReplyByComment(comment) {
        return newReplies.find(newReply => newReply.id === comment.sentAt) 
    }

    function handleReplyChange(event, toWhichComment) {
        const reply = event.target.value
        setNewReplies(newReplies.map(newReply =>
            newReply.id === toWhichComment.sentAt
                ? { ...newReply, text: reply }
                : newReply
        ))
    }

    function handleReplySubmit(event, toWhichComment) {
        event.preventDefault()
        const newReplyText = findNewReplyByComment(toWhichComment).text

        if (newReplyText !== "") 
            onAddReply(toWhichComment.sentAt, newReplyText)

        setNewReplies(newReplies.map(newReply =>
            newReply.id === toWhichComment.sentAt
                ? { ...newReply, text: "" }
                : newReply
        ))
    }

    return (
        <section className="chat-modal">
            
            <button className="exis-button" onClick={modalToggle}>X</button>

            {/* Edit Task Title */}
            <div className="chat-edit-title">
                {
                    !onEditMode 
                    ? 
                    <span onClick={toggleEditMode}>{text}</span>
                    : 
                    <textarea
                        value={textToEdit}
                        onChange={event => setTextToEdit(event.target.value)}
                        onBlur={toggleEditMode}
                        onKeyDown={handleKeyDown}/>
                }
            </div>
            

            {/* Create Comment */}
            <form onSubmit={handleCommentSubmit} className="create-comment">
                <textarea
                    value={newComment}
                    onChange={event => setNewComment(event.target.value)}
                    placeholder="Write an update"
                    type="textarea"
                />
                <button type="submit">Update</button>
            </form>

            {/* Comment List */}
            <ul className="comments-list">
                {chat.map(comment => {
                    const commenter = getUserById(comment.userId);
                    return (
                        <li key={comment.sentAt} className="comment">
                            <div className="comment-info">
                                <img src={commenter.imgUrl} alt={commenter.name} />
                                <p>{commenter.fullName}</p>
                                <p>{simplifyTimeToStr(comment.sentAt)}</p>
                            </div>
                            <p>{comment.text}</p>

                            {/* Replaies List to The Comment */}
                            <ul className="replies-list">
                                {comment.replies.map(reply => {
                                    const replier = getUserById(reply.userId);
                                    return (
                                        <li key={`${reply.sentAt}-${reply.userId}`} className="reply">
                                            <img src={replier.imgUrl} alt={replier.fullName} />
                                            <div className="replay-container">
                                                <p>{replier.fullName}</p>
                                                <p className="reply-text">{reply.text}</p>
                                            </div>
                                            <p className="reply-time">{simplifyTimeToStr(reply.sentAt)}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                            
                            {/* Create New Reply to Comment */}
                            <div className="create-reply">
                                <img src={loggedinUser.imgUrl}/>
                                <form 
                                onSubmit={event => handleReplySubmit(event, comment)}>
                                    <textarea
                                        value={findNewReplyByComment(comment)?.text || ""}
                                        onChange={event => handleReplyChange(event, comment)}
                                        placeholder="Write a reply"
                                    />
                                    <button type="submit">Reply</button>
                                </form>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
