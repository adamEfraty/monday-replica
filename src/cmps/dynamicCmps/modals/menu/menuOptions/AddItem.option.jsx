export function AddItem({ handleAddBoard }) {
    return (
        <div >
            <p>Add new</p>
            <h5 onClick={handleAddBoard}>Board</h5>
        </div>
    )
}