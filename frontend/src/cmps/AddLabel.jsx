import { addLable } from "../store/actions/boards.actions.js";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { openModal, closeModal } from "../store/actions/boards.actions.js";
import { getSvg } from "../services/svg.service.jsx";

export function AddLabel({ groupId, boardId, isFixed, labels }) {
  const modalId = `addlabel-${groupId}${isFixed ? "fix" : ""}`;
  const openModals = useSelector((state) => state.boardModule.openModals);
  const modal = openModals.some((modId) => modId === modalId);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  const newLabels = [
    { type: "status", name: "Status", svg: getSvg("status-icon") },
    { type: "priority", name: "Priority", svg: getSvg("priority-icon") },
    { type: "members", name: "People", svg: getSvg("members-icon") },
    { type: "date", name: "Date", svg: getSvg("date-icon") },
  ];

  // Toggle modal open/close
  function modalToggle() {
    modal ? closeModal(modalId) : openModal(modalId);
  }

  // Close modal if user clicks outside
  function handleClickOutsideModal(event) {
    if (
      modalRef.current &&
      buttonRef.current &&
      !modalRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      modalToggle();
    }
  }

  // Add/remove event listener for outside clicks
  useEffect(() => {
    if (modal) {
      document.addEventListener("mousedown", handleClickOutsideModal);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [modal]);

  // Add a new label
  function onAddLabel(boardId, labelInfo) {
    addLable(boardId, labelInfo);
    modalToggle();
  }

  return (
    <section className="add-label">
      <button
        ref={buttonRef}
        className="add-column-button"
        onClick={modalToggle}
        style={modal ? { backgroundColor: "#EBEBEC" } : {}}
      >
        <div className={modal ? "plus-open" : "plus"}>{getSvg("thin-plus")}</div>
      </button>
      {modal && (
        <section className="add-label-modal" ref={modalRef}>
          <ul>
            {newLabels.map((labelInfo) => (
              <li
                key={labelInfo.type}
                onClick={() => onAddLabel(boardId, labelInfo)}
                className="label-option"
              >
                {labelInfo.svg}
                {labelInfo.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isFixed && <div className="fixed-space" />}
    </section>
  );
}
