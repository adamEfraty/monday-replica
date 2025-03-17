import { getSvg } from "../../../services/svg.service"

export function EditGroupTitleModal({
    editModal, 
    editModalRef, 
    onDelete, 
    onOpenColorModal, 
    onRenameGroup}){

    return(
        <section className="edit-group-title-modal"
        ref={editModalRef} 
        style={{visibility: editModal ? 'visible'  : 'hidden'}}
        >
            <button className="rename-button" onClick={onRenameGroup}>
                {getSvg('pencil')}
                Rename group
            </button>

            <button className="change-color-button" onClick={onOpenColorModal}>
                {getSvg('color-bucket')}
                Change group color
            </button>

            <button className="delete-button" onClick={onDelete}>
                {getSvg('trash2')}
                Delete group
            </button>

        </section>
    )
}