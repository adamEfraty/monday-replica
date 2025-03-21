import { getSvg } from "../services/svg.service";
import { ProgressCmd } from "./ProgressCmd";

export function MiniGroup({
    labels,
    group,
    groupTitle,
    handelExpandedChange,
    dragHandleProps,
    isDragging,
}) {


    return (
        <div className="minigroup"
            style={{ gridTemplateColumns: `${labels.map(label => `${label.width}px`).join(' ')} auto` }}>
            <div className="minigroup-title-part" {...dragHandleProps}
                style={{ borderLeft: `8px solid ${group.color}` }}>
                <div className="minigroup-title-top-part" style={{ color: `${group.color}` }}>
                    <div className="minigroup-arrow"
                        onClick={() => handelExpandedChange((prev) => !prev)}>
                        {getSvg('group-title-arrow')}
                    </div>
                    <h2 className="minigroup-title">{groupTitle}</h2>
                </div>
                <div className="task-counter">{group.tasks.length} Tasks</div>

                {!isDragging && <div className="white-cover" />}
            </div>

            {labels.slice(1).map((lable, index) =>
                <div className="minigroup-progress-cell">
                    <p>{lable.name}</p>
                    <div className={`prog-box with-${lable.type}`} key={`progress-${lable.id}`}>
                        <ProgressCmd
                            label={lable}
                            tasks={group.tasks}
                            index={index}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}