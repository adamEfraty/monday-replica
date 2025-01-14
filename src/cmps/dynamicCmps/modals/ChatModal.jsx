import { simplifyTimeToStr } from "../../../services/util.service.js";
import { useState } from "react";

export function ChatModal({ usersInBoard, chat = [], onAddComment, onAddReply }) {
    const [newComment, setNewComment] = useState("");
    const [newReplies, setNewReplies] = useState(
        chat.map(comment => ({ id: comment.sentAt, text: "" }))
    );

    function getUserById(userId) {
        return usersInBoard.find(member => member.id === userId) || {};
    }

    function handleCommentSubmit(event) {
        event.preventDefault();
        if (newComment !== "") {
            onAddComment(newComment);
            setNewComment("");
        }
    }

    function findNewReplyByComment(comment) {
        return newReplies.find(newReply => newReply.id === comment.sentAt) || { text: "" };
    }

    function handleReplyChange(event, toWhichComment) {
        const reply = event.target.value;
        setNewReplies(newReplies.map(newReply =>
            newReply.id === toWhichComment.sentAt
                ? { ...newReply, text: reply }
                : newReply
        ));
    }

    function handleReplySubmit(event, toWhichComment) {
        event.preventDefault();
        const newReplyText = findNewReplyByComment(toWhichComment).text;

        if (newReplyText !== "") {
            onAddReply(toWhichComment.sentAt, newReplyText);
        }

        setNewReplies(newReplies.map(newReply =>
            newReply.id === toWhichComment.sentAt
                ? { ...newReply, text: "" }
                : newReply
        ));
    }

    return (
        <section className="chat-modal">
            <form onSubmit={handleCommentSubmit} className="create-comment">
                <textarea
                    value={newComment}
                    onChange={event => setNewComment(event.target.value)}
                    placeholder="Write an update"
                    type="textarea"
                />
                <button type="submit">Update</button>
            </form>

            <ul className="comments-list">
                {chat.map(comment => {
                    const commenter = getUserById(comment.userId);
                    return (
                        <li key={comment.sentAt} className="comment">
                            <div className="comment-info">
                                <img src={commenter.image} alt={commenter.name} />
                                <p>{commenter.name}</p>
                                <p>{simplifyTimeToStr(comment.sentAt)}</p>
                            </div>
                            <p>{comment.text}</p>
                            <ul className="replies-list">
                                {comment.replies.map(reply => {
                                    const replier = getUserById(reply.userId);
                                    return (
                                        <li key={`${reply.sentAt}-${reply.userId}`} className="reply">
                                            <img src={replier.image} alt={replier.name} />
                                            <div className="replay-container">
                                                <p>{replier.name}</p>
                                                <p className="reply-text">{reply.text}</p>
                                            </div>
                                            <p className="reply-time">{simplifyTimeToStr(reply.sentAt)}</p>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="create-reply">
                                <form onSubmit={event => handleReplySubmit(event, comment)}>
                                    <textarea
                                        value={findNewReplyByComment(comment)?.text || ""}
                                        onChange={event => handleReplyChange(event, comment)}
                                        placeholder="Write a reply"
                                    />
                                    <button type="submit">Reply</button>
                                </form>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
