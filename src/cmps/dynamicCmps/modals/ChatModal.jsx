import { simplifyTimeToStr } from "../../../services/util.service.js"
export function ChatModal({usersInBoard, chat}){
    
    
    function getUserById(userId){
        return usersInBoard.find(memebr=>memebr.id === userId)
    }

    return (
        <section className="chat-modal">
            {/* list of task's comments */}
            <ul className="comments-list">
                {
                    chat.map(comment => {
                        const commenter = getUserById(comment.userId)
                        return <li key={comment} className="comment">
                            <div className="comment-info">
                                <img src={commenter.image}/>
                                <p>{commenter.name}</p>
                                <p>{simplifyTimeToStr(comment.sentAt)}</p>
                            </div>

                            <p>{comment.text}</p>
                            {/* list of comments' replys */}
                            <ul className="replies-list">
                                {
                                    comment.replys.map(reply=>{
                                        const replier = getUserById(reply.userId)
                                        return <li 
                                        key={reply}
                                        className="reply">
                                            <img src={replier.image}/>
                                            <div className="replay-container">
                                                <p>{replier.name}</p>
                                                <p className="reply-text">{reply.text}</p>

                                            </div>
                                            <p className="reply-time">
                                                {simplifyTimeToStr(reply.sentAt)}
                                            </p>
                                            
                                    
                                    </li>})
                                }
                            </ul>
                        </li>})
                }
            </ul>
            
        </section>
    )
}