
import { GroupTitle } from "./GroupTitle"
import { ArrowRightIcon } from "@mui/x-date-pickers/icons"
export function MiniGroup({ titleRef,
    boardId,
    group,
    groupTitle,
    expanded,
    handleClick2,
    id2,
    open2,
    anchorE2,
    handleClose2,
    titleHead,
    handleGroupNameChange,
    handelExpandedChange,
    handelGroupTitleChange,
    attributes,
    listeners,
    handleDelete,

}) {


    return (
        <div className="minigroup-container" style={{ borderLeft: `8px solid ${group.color}` }
        }>
            <div className="minigroup-inner-flex">
                <div className="title-arrow-flex" style={{ color: `${group.color}` }}>
                    <span><ArrowRightIcon onClick={() => handelExpandedChange((prev) => !prev)} /></span>
                    <h2 >{groupTitle}</h2>
                </div>
                <div style={{ marginLeft: '10px' }}>{group.tasks.length} tasks</div>
            </div>
            <div {...listeners} {...attributes} style={{ cursor: "grab", width: '100%', padding: '1rem' }}  ></div>
        </div >
    )
}