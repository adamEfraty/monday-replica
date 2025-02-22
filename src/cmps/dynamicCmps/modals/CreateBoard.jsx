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
    console.log(boardName);
  }
  return (
    <section className="create-board">
      <h1>Create Board</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="boardName">Board name:</label>
        <input type="text" id="boardName" name="boardName" required />
        <section>
          <button type="submit">Create</button>
          <button type="button">Cancel</button>
        </section>
      </form>
      <h6 onClick={closeModal}>X</h6>
    </section>
  );
}
