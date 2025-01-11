
export function ChatModal({chat}){

    return (
        <section className="chat-modal">
            {/* list of task's comments */}
            <ul className="comments-list">
                {
                    chat.map(commend => <li key={commend}>
                        <h4>{commend.text}</h4>
                        {/* list of comments' replys */}
                        <ul className="replys-list">
                            {
                                commend.replys.map(replay=><li key={replay}>
                                    <p>{replay.text}</p>
                                </li>)
                            }
                        </ul>
                    </li>)
                }
            </ul>
            
        </section>
    )
}