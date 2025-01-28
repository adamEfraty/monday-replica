export function SideBarBoard({ board, onRemoveBoard }) {
    return (
        <div className="board-preview">
            <div className="board-preview-header">
                <h3>{board.title}</h3>
                <button onClick={() => onRemoveBoard(board.id)}>X</button>
            </div>
            <div className="board-preview-content">
                <p>{board.description}</p>
            </div>
        </div>
    );
}