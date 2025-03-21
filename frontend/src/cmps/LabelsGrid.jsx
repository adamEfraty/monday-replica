import { LabelTitle } from "./LabelTitle.jsx";
import { Label } from "./Label.jsx";
import { AddLabel } from "./AddLabel.jsx";
import { getSvg } from "../services/svg.service.jsx";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { replaceLabels } from "../store/actions/boards.actions.js";
import { useState } from "react";
export function LabelsGrid({
    boardId,
    group,
    labels,
    handleMasterCheckboxClick,
    checkedGroups,
    isFixed,
    isBordScrollOnZero,
}) {
    const isChecked = checkedGroups.includes(group.id);

    const myLabels = labels



    function getLabelPos(id, labels) {
        return myLabels.findIndex(label => label.id === id);
    }

    function handleDragEnd(e) {
        const { active, over } = e;

        if (!over || active.id === over.id) return;

        const originalPos = getLabelPos(active.id, myLabels);
        const newPos = getLabelPos(over.id, myLabels);

        if (originalPos === -1 || newPos === -1) return;

        const reordered = arrayMove(myLabels, originalPos, newPos);

        replaceLabels(boardId, reordered); // Update global/store
    }



    return (
        <section
            className="labels-grid"
            style={{
                borderTopLeftRadius: 5,
                gridTemplateColumns: `10px ${labels.map(label => `${label.width}px`).join(" ")} auto`,
                boxShadow: isFixed ? (isBordScrollOnZero ? "" : "8px 12px 8px -12px #D0D4E4") : "",
            }}
        >
            <section className="ghost"></section>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <SortableContext items={labels} strategy={horizontalListSortingStrategy}>
                    {labels.map((label) => (
                        label.type === "taskTitle" ? (
                            <div
                                style={{
                                    borderLeft: `7px solid ${group?.color}`,
                                    borderTopLeftRadius: 5,
                                    borderBottom: isFixed ? (isBordScrollOnZero ? "" : "solid 2px #D0D4E4") : "",
                                }}
                                key={`label-${label.id}`}
                                className="label-title"
                            >
                                <div className="white-cover" />
                                <section className="main-checkbox">
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        onChange={() => { }}
                                        onClick={() => handleMasterCheckboxClick({ group })}
                                        checked={checkedGroups.includes(group.id)}
                                        style={{
                                            backgroundColor: isChecked ? `#0073EA` : "white",
                                            border: isChecked && "none",
                                        }}
                                    />
                                    <div
                                        className="check-icon"
                                        onClick={() => handleMasterCheckboxClick({ group })}
                                    >
                                        {isChecked && getSvg("check")}
                                    </div>
                                </section>
                                <LabelTitle key={label.id} label={label} boardId={boardId} />
                            </div>
                        ) : (
                            <Label
                                key={label.id}
                                id={label.id}
                                label={label}
                                boardId={boardId}
                                groupId={group.id}
                                isFixed={isFixed}
                                isLast={labels[labels.length - 1]?.id === label.id}
                                isBordScrollOnZero={isBordScrollOnZero}
                            />
                        )
                    ))}
                </SortableContext>
            </DndContext>
            <AddLabel groupId={group.id} boardId={boardId} isFixed={isFixed} labels={labels} />
        </section>
    );
}
