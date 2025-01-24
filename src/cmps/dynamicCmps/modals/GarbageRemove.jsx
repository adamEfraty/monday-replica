export function GarbageRemove({ someName, someFunction }) {
    return (
        <div className="garbage">
            <h4 onClick={someFunction}> 🪣Remove {someName}</h4>

        </div>
    );
};
