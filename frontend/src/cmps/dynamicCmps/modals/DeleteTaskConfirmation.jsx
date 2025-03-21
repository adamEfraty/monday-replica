
export function DeleteTaskConfirmation({
  onDelete,
  toggleConfirmationModal,
  confirmationRef,
  animationActive,
  type,
}) {
  return (
    <div
      className="delete-task-confirmation-background"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <section
        style={{ visibility: animationActive ? "hidden" : "visible" }}
        className="delete-task-confirmation"
        ref={confirmationRef}
      >
        <div className="upper-modal">
          <button onClick={toggleConfirmationModal}>×</button>
          <h4>{`Delete ${type === "tasks" ? "these" : "this"} ${type}?`}</h4>
          <p>
            We'll keep it in your trash for 30 days, and then permanently delete
            it.
          </p>
        </div>

        <div className="lower-modal">
          <button onClick={toggleConfirmationModal} className="cancel">
            Cancel
          </button>
          <button onClick={onDelete} className="delete">
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
