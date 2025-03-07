import { useDispatch } from "react-redux";

export function CreateBoard({ handleAddBoard }) {
  const dispatch = useDispatch();
  function closeModal() {
    dispatch({ type: "SET_MODAL", value: false });
  }
  function handleSubmit(ev) {
    ev.preventDefault();
    const boardName = ev.target.boardName.value;
    handleAddBoard(boardName);
    closeModal()
  }
  return (
    <section className="create-board">
      <h1>Create Board</h1>
      <form onSubmit={handleSubmit} className="create-board-form">
        <label htmlFor="boardName">Board name:</label>
        <input type="text" id="boardName" name="boardName" required />
        <section className="create-board-buttons">
          <button onClick={() => closeModal()} type="button" className="cancel-button">Cancel</button>
          <button type="submit">Create</button>
        </section>
      </form>
      <h6 className="x-btn" style={{ cursor: 'pointer' }} onClick={closeModal}>X</h6>
    </section>
  );
}
