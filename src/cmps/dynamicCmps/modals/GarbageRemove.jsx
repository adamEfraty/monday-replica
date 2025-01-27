import { getSvg } from "../../../services/svg.service";



export function GarbageRemove({ someName, someFunction }) {
    return (
        <div className="garbage">
            <h4 onClick={someFunction}> {getSvg('trash')} Remove {someName}</h4>

        </div>
    );
};
