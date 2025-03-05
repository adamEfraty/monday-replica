import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { LabelTitle } from "./LabelTitle.jsx";
import { Label } from "./Label.jsx";
import { AddLabel } from "./AddLabel.jsx";

export function LabelsGrid({
    boardId,
    group,
    labels,
    handleMasterCheckboxClick,
    checkedGroups,
    isFixed,
}){
    return(
        <section
            className="labels-grid"
            style={{
            borderTopLeftRadius: 5,
            gridTemplateColumns: `10px ${labels.map(label => `${label.width}px`).join(' ')} 100px`
            }}
        >
            <section className="ghost "></section>

            <SortableContext items={labels.map(label => label.id)} strategy={horizontalListSortingStrategy}>
            {labels.map(label => (
                label.type === 'taskTitle' ?
                <div style={{ borderLeft: `5px solid ${group?.color}`, borderTopLeftRadius: 5 }} key={`label-${label.id}`} className="label-title">
                    <div className="white-cover"/>
                    <section className="main-checkbox">
                    <input
                        type="checkbox"
                        className="checkbox"
                        onChange={() => { }}
                        onClick={() => handleMasterCheckboxClick(group)}
                        checked={checkedGroups.includes(group.id)}

                    />
                    </section>
                    <LabelTitle key={label.id} label={label} boardId={boardId} />
                </div >
                :
                <Label key={label.id} 
                id={label.id} 
                label={label} 
                boardId={boardId} 
                groupId={group.id} 
                isFixed={isFixed}/>
            ))}
            </SortableContext >

            <AddLabel groupId={group.id} boardId={boardId} isFixed={isFixed}/>
        </section>
    )
}