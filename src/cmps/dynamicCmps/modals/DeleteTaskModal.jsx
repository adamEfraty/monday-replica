

export function DeleteTaskModal({removeTask, boardId, groupId, taskId}){


    return(
        <section className="delete-task-modal">
            <button onClick={()=>
                {removeTask(boardId, groupId, taskId)}}>Delete</button>
        </section>
    )
}