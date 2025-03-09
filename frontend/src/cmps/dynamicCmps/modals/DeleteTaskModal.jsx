import { getSvg } from '../../../services/svg.service.jsx'

export function DeleteTaskModal({removeTask, boardId, groupId, taskId}){

    // style={{top: `${taskIndex < 2 ? 30 : -45}px`}}
    return(
        <section className="delete-task-modal">
            <button onClick={()=>
                {removeTask(boardId, groupId, taskId)}}>
                {getSvg('trash2')}
                Delete
            </button>
        </section>
    )
}