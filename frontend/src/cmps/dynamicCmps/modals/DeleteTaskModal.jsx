import { getSvg } from '../../../services/svg.service.jsx'

export function DeleteTaskModal({toggleConfirmationModal, boardId, groupId, taskId, boardScroll}){

    // style={{top: `${taskIndex < 2 ? 30 : -45}px`}}
    return(
        <section className="delete-task-modal"
        style={{left: boardScroll.x -17}}>
            <button onClick={() =>
                // {removeTask(boardId, groupId, taskId)}}>
                toggleConfirmationModal()}>
                {getSvg('trash2')}
                Delete
            </button>
        </section>
    )
}