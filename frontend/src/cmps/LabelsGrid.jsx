import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { LabelTitle } from "./LabelTitle.jsx";
import { Label } from "./Label.jsx";
import { AddLabel } from "./AddLabel.jsx";
import { getSvg } from '../services/svg.service.jsx'

export function LabelsGrid({
    boardId,
    group,
    labels,
    handleMasterCheckboxClick,
    checkedGroups,
    isFixed,
}){

    const isChecked = checkedGroups.includes(group.id)

    return(
        <section
            className="labels-grid"
            style={{
                borderTopLeftRadius: 5,
                gridTemplateColumns: `10px ${labels.map(label => `${label.width}px`).join(' ')} auto`
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
                            style={{backgroundColor: isChecked ? `#0073EA` : 'white',
                                border: isChecked && 'none',
                              }}

                        />
                        <div className="check-icon"
                        onClick={() => handleMasterCheckboxClick(group)}>
                        {
                            isChecked && getSvg('check')
                        }
                        </div>
                    </section>
                    <LabelTitle key={label.id} label={label} boardId={boardId} />
                </div >
                :
                <Label key={label.id} 
                id={label.id} 
                label={label} 
                boardId={boardId} 
                groupId={group.id} 
                isFixed={isFixed}
                isLast={labels[labels.length - 1]?.id === label.id}/>
            ))}
            </SortableContext >

            <AddLabel groupId={group.id} boardId={boardId} isFixed={isFixed} labels={labels}/>
        </section>
    )
}