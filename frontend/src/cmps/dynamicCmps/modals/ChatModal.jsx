import {
  simplifyTimeToStr,
  utilService,
} from "../../../services/util.service.js";
import { useState, useEffect, useRef } from "react";
import "animate.css";
import { getSvg } from "../../../services/svg.service.jsx";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import emptyChatImg from "../../../assets/images/empty-chat.png";
import { ActivityModal } from "./ActivityModal.jsx";

export function ChatModal({
  cellInfo,
  chatId,
  loggedinUser,
  users,
  onAddComment,
  onAddReply,
  onUpdateTitleInChat,
  modalToggle,
  chatTempInfoUpdate,
  chatPrevInfo,
  openChat,
}) {
  const chatBodyRef = useRef(null); // Ref to the chat body element
  const [scroll, setScroll] = useState(
    chatPrevInfo?.scroll ? chatPrevInfo.scroll : 0
  );

  const [onEditMode, setOnEditMode] = useState(false);
  const [component, setComponent] = useState("updates");
  const [textToEdit, setTextToEdit] = useState(cellInfo.value.title);

  const [newComment, setNewComment] = useState(
    chatPrevInfo?.comment ? chatPrevInfo.comment : ""
  );
  const newCommentLatestRef = useRef(newComment);

  const createCommentRef = useRef(null);
  const [editNewComment, setOnEditNewComment] = useState(newComment !== "");

  const [newReplies, setNewReplies] = useState(
    cellInfo.value.chat.map((comment) => ({
      id: comment.sentAt,
      text: "",
      isEditing: false,
    }))
  );
  const replyRefs = useRef({}); // To track reply elements for click outside detection

  const [width, setWidth] = useState(
    chatPrevInfo?.width ? chatPrevInfo.width : 700
  );
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (chatBodyRef) {
      chatTempInfoUpdate(chatId, width, scroll, newComment);
      openChat(chatId);
      chatBodyRef.current.scrollTop = scroll;
    }
  }, []);

  useEffect(() => {
    const handleUpdateScroll = () => {
      if (chatBodyRef.current) {
        setScroll(chatBodyRef.current.scrollTop); // Update scroll position
      }
    };

    const chatElement = chatBodyRef.current;

    if (chatElement) {
      chatElement.addEventListener("scroll", handleUpdateScroll);
    }

    // Cleanup on component unmount
    return () => {
      if (chatElement) {
        chatElement.removeEventListener("scroll", handleUpdateScroll);
      }
    };
  }, []);

  useEffect(() => {
    chatTempInfoUpdate(chatId, width, scroll, newComment);
  }, [newComment]);

  // if user click outside the newcomment without text close it
  useEffect(() => {
    const emptyPossibilities = [
      "",
      "<p><br></p>",
      "<h1><br></h1>",
      "<h2><br></h2>",
      "<h3><br></h3>",
    ];
    const handleClickOutside = (event) => {
      if (
        createCommentRef.current &&
        !createCommentRef.current.contains(event.target)
      ) {
        // Use the latest value of `newComment` from the ref
        if (!emptyPossibilities.includes(newCommentLatestRef.current.trim())) {
          setOnEditNewComment(true);
        } else {
          setOnEditNewComment((prev) => !prev);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect clicks outside the reply input and blur it
  useEffect(() => {
    const emptyPossibilities = [
      "",
      "<p><br></p>",
      "<h1><br></h1>",
      "<h2><br></h2>",
      "<h3><br></h3>",
    ];
    const handleClickOutside = (event) => {
      Object.keys(replyRefs.current).forEach((key) => {
        if (
          replyRefs.current[key] &&
          !replyRefs.current[key].contains(event.target)
        ) {
          setNewReplies((prevReplies) =>
            prevReplies.map((reply) => {
              if (reply.id == key) {
                if (emptyPossibilities.includes(reply.text.trim())) {
                  return { ...reply, isEditing: false };
                } else return reply;
              }
              return reply;
            })
          );
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Attach global mousemove and mouseup listeners when dragging starts
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    // Cleanup listeners when dragging stops
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // toggel btween spectate and edit mode
  function toggleEditMode() {
    if (onEditMode) {
      // not alowing user insert unvalid title
      if (!checkTitleValidation(textToEdit)) {
        setTextToEdit(cellInfo.value.chat.text);
      }
      // if everyting ok update title changes
      else onUpdateTitleInChat(textToEdit);
    }
    setOnEditMode((prev) => !prev);
  }

  const handleCmpChage = (cmp) => { setComponent(cmp) };

  function checkTitleValidation(title) {
    // not alowing user insert blank title
    if (title === "") return false;
    return true;
  }

  // later users going to be the only users in board,
  // therfore im not using getById function in user service
  function getUserById(userId) {
    return users.find((member) => member._id === userId) || {};
  }

  function handleCommentSubmit(event) {
    event.preventDefault();
    const emptyPossibilities = [
      "",
      "<p><br></p>",
      "<h1><br></h1>",
      "<h2><br></h2>",
      "<h3><br></h3>",
    ];
    if (!emptyPossibilities.includes(newComment)) {
      const sentAt = Date.now();
      onAddComment(newComment, sentAt);
      setNewComment("");
      setOnEditNewComment(false);
      setNewReplies((prevNewReplaies) => [
        ...prevNewReplaies,
        { id: sentAt, text: "", isEditing: false },
      ]);
    }
  }

  // if user press enter go to spectate mode
  function handleKeyDown(event) {
    if (event.key === "Enter") toggleEditMode();
  }

  function findNewReplyByComment(comment) {
    return newReplies.find((newReply) => newReply.id === comment.sentAt);
  }

  function handleReplyChange(event, commentId) {
    const replyText = event;
    setNewReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply.id === commentId ? { ...reply, text: replyText } : reply
      )
    );
  }

  function handleReplySubmit(event, commentId) {
    event.preventDefault();
    const emptyPossibilities = [
      "",
      "<p><br></p>",
      "<h1><br></h1>",
      "<h2><br></h2>",
      "<h3><br></h3>",
    ];
    const replyText =
      newReplies.find((reply) => reply.id === commentId)?.text || "";
    if (emptyPossibilities.includes(replyText.trim())) return;

    onAddReply(commentId, replyText);
    chatTempInfoUpdate(chatId, width, scroll, newComment);

    setNewReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply.id === commentId
          ? { ...reply, text: "", isEditing: false }
          : reply
      )
    );
  }

  function handleNewReplyToEdit(commentId) {
    setNewReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply.id === commentId ? { ...reply, isEditing: true } : reply
      )
    );
  }

  const handleMouseDown = () => {
    setIsDragging(true);
  };
  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const modalRect = document
      .querySelector(".chat-modal")
      .getBoundingClientRect();
    const newWidth = modalRect.right - event.clientX; // Calculate width dynamically

    // Set a minimum and maximum width for the modal to prevent it from collapsing or overflowing
    const MIN_WIDTH = 570;
    const MAX_WIDTH = window.innerWidth - 265; // will need to be change later

    setWidth(Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    chatTempInfoUpdate(chatId, width, scroll, newComment);
  };

  function closeChat() {
    chatTempInfoUpdate(chatId, width, 0, newComment);
    openChat(null);
    modalToggle();
  }

  return (
    <section
      className="chat-modal"
      style={{ width: `${width}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="expand-line" onMouseDown={handleMouseDown}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </div>

      <div className="chat-header">
        <button className="exis-button" onClick={closeChat}>
          <i className="fa-solid fa-x"></i>
        </button>

        {/* Edit Task Title */}
        <div className="chat-edit-title">
          {!onEditMode ? (
            <span onClick={toggleEditMode}>{textToEdit}</span>
          ) : (
            <textarea
              value={textToEdit}
              onChange={(event) => setTextToEdit(event.target.value)}
              onBlur={toggleEditMode}
              onKeyDown={handleKeyDown}
              autoFocus={true}
              rows={1} // at defult
              ref={(textarea) => {
                if (textarea) {
                  // Moves the cursor to the end of the text
                  textarea.selectionStart = textToEdit.length;
                  // Reset height to calculate scrollHeight properly
                  textarea.style.height = "auto";
                  // Adjust height based on scrollHeight
                  textarea.style.height = `${textarea.scrollHeight + 2}px`;
                }
              }}
            />
          )}
        </div>

        <section className="navigation">
          <div onClick={() => handleCmpChage("updates")}>
            {getSvg("home-icon")}
            <h5>Updates</h5>
            {component === "updates" && <hr className="highlight" />}
          </div>
          <div onClick={() => handleCmpChage("activityLog")}>
            <h5>Activity Log</h5>
            {component === "activityLog" && <hr className="highlight" />}
          </div>
        </section>
      </div>
      {
        component === "updates" ? (
          <div className="chat-body" ref={chatBodyRef}>
            <div className="chat-inner-body">
              {/* Create Comment */}
              {editNewComment ? (
                <form
                  ref={createCommentRef}
                  onSubmit={handleCommentSubmit}
                  className="create-comment"
                >
                  <ReactQuill
                    className="textarea-quill"
                    value={newComment}
                    onChange={setNewComment}
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline"], // Inline styles
                        [{ header: [1, 2, 3, false] }], // Headers
                        [{ list: "ordered" }], // Lists
                        ["clean"], // Remove formatting
                      ],
                    }}
                  />
                  <button className="update-button" type="submit">
                    Update
                  </button>
                </form>
              ) : (
                <div
                  className="create-comment-blur"
                  onClick={() => setOnEditNewComment(true)}
                >
                  <p className="placeholder">
                    Write an update and mention others with @
                  </p>
                </div>
              )}

              {/* Comment List */}
              <ul className="comments-list">
                {cellInfo.value.chat.map((comment) => {
                  const commenter = getUserById(comment.userId);
                  return (
                    <li key={comment.sentAt} className="comment">
                      <div className="comment-info">
                        <img src={commenter.imgUrl} alt={commenter.name} />
                        <p className="username">{commenter.fullName}</p>
                        <p className="time">{simplifyTimeToStr(comment.sentAt)}</p>
                      </div>

                      <div
                        className="comment-text"
                        dangerouslySetInnerHTML={{ __html: comment.text }}
                      />

                      {/* Replaies List to The Comment */}
                      <ul className="replies-list">
                        {comment.replies.map((reply) => {
                          const replier = getUserById(reply.userId);
                          return (
                            <li
                              key={`${reply.sentAt}-${reply.userId}`}
                              className="reply"
                            >
                              <img src={replier.imgUrl} alt={replier.fullName} />
                              <div className="replay-container">
                                <p className="reply-username">{replier.fullName}</p>
                                <div
                                  className="reply-text"
                                  dangerouslySetInnerHTML={{ __html: reply.text }}
                                />
                              </div>
                              <p className="reply-time">
                                {simplifyTimeToStr(reply.sentAt)}
                              </p>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Create New Reply to Comment */}
                      <div
                        className="create-reply"
                        ref={(el) => (replyRefs.current[comment.sentAt] = el)}
                      >
                        <img src={loggedinUser.imgUrl} />
                        {findNewReplyByComment(comment)?.isEditing ? (
                          <form
                            onSubmit={(event) =>
                              handleReplySubmit(event, comment.sentAt)
                            }
                          >
                            <ReactQuill
                              className="textarea-quill"
                              value={findNewReplyByComment(comment)?.text}
                              onChange={(event) =>
                                handleReplyChange(event, comment.sentAt)
                              }
                              modules={{
                                toolbar: [
                                  ["bold", "italic", "underline"], // Inline styles
                                  [{ header: [1, 2, 3, false] }], // Headers
                                  [{ list: "ordered" }], // Lists
                                  ["clean"], // Remove formatting
                                ],
                              }}
                            />
                            <button className="reply-button" type="submit">
                              Reply
                            </button>
                          </form>
                        ) : (
                          <div
                            className="create-reply-blur"
                            onClick={() => handleNewReplyToEdit(comment.sentAt)}
                          >
                            <p className="placeholder">
                              Write a reply and mention others with @
                            </p>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {cellInfo.value.chat.length === 0 ? (
                <div className="empty-chat">
                  <img src={emptyChatImg} />
                  <p className="bold-text">No updates yet for this item</p>
                  <p className="text">
                    Be the first one to update about progress, mention someone or
                    upload files to share with your team members
                  </p>
                </div>
              ) : null}
              {/* to have some distance to the bottom*/}
              <div className="white-block" />
            </div>
          </div>
        ) : (
          <ActivityModal activities={cellInfo.value.activities} taskTitle={textToEdit} width={width} />
        )
      }
    </section>
  );
}
