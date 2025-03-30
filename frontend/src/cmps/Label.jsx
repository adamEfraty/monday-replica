import { openModal, closeModal } from "../store/actions/boards.actions.js";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  deleteLable,
  onChangeLabelName,
  onUpdateReduxLabelWidth,
  onUpdateLocalLabelWidth,
} from "../store/actions/boards.actions.js";
import { getSvg } from "../services/svg.service.jsx";
import { DeleteLabelConfirmation } from "./dynamicCmps/modals/DeleteLabelConfirmation.jsx";
import { utilService } from "../services/util.service.js";
import ReactDOM from "react-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export function Label({
  label,
  labelId,
  boardId,
  groupId,
  isFixed,
  isLast,
  isBordScrollOnZero,
}) {
  const modalId = `${label.id}${groupId}${isFixed ? "fix" : ""}`;
  const openModals = useSelector((state) => state.boardModule.openModals);
  const modal = openModals.some((modId) => modId === modalId);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const labelRef = useRef(null);

  const [onEditMode, setOnEditMode] = useState(false);
  const [textToEdit, setTextToEdit] = useState(label.name);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverLable, setHoverLabel] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const confirmationRef = useRef(null);
  const [animationActive, setAnimationActive] = useState(false);

  const id = label.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const board = useSelector((state) =>
    state.boardModule.boards.find((board) => board._id === boardId)
  );

  useEffect(() => {
    const handleHoverLabel = (event) => {
      if (labelRef.current)
        labelRef.current.contains(event.target)
          ? setHoverLabel(true)
          : setHoverLabel(false);
    };
    document.addEventListener("mouseover", handleHoverLabel);
    return () => document.removeEventListener("mouseout", handleHoverLabel);
  }, []);

  function modalToggle() {
    modal ? closeModal(modalId) : openModal(modalId);
  }

  function handleClickOutsideModal(event) {
    if (
      !modalRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      modalToggle();
    }
  }

  useEffect(() => {
    if (modal) document.addEventListener("mousedown", handleClickOutsideModal);
    else document.removeEventListener("mousedown", handleClickOutsideModal);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [modal]);

  function onDeleteLable() {
    toggleConfirmationModal();
    setTimeout(() => deleteLable(boardId, label.id), 50);
  }

  function toggleEditMode() {
    if (onEditMode) {
      if (textToEdit === "") {
        setTextToEdit(label.name);
      } else {
        onChangeLabelName(boardId, label.id, textToEdit);
      }
    }
    setOnEditMode((prev) => !prev);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") toggleEditMode();
  }

  function onRenameLable() {
    setOnEditMode(true);
    modalToggle();
  }

  function toggleConfirnationModal() {
    const animationDuration = 0.2;
    closeModal(modalId);
    if (deleteConfirmationModal) {
      confirmationAnimation(false, animationDuration);
      setTimeout(
        () => setDeleteConfirmationModal((prev) => !prev),
        animationDuration * 500
      );
    } else {
      setAnimationActive(true);
      setDeleteConfirmationModal((prev) => !prev);
      setTimeout(() => {
        confirmationAnimation(true, animationDuration);
        setAnimationActive(false);
      }, 10);
    }
  }

  function confirmationAnimation(isEnter, duration) {
    if (!confirmationRef.current) return;
    const animation = isEnter ? "fadeInDown" : "fadeOutUp";
    utilService.animateCSS(confirmationRef.current, animation, duration);
  }

  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging || !labelRef.current) return;
      const labelBoundaries = labelRef.current.getBoundingClientRect();
      const newWidth = event.clientX - labelBoundaries.x - 5;
      const MIN_WIDTH = 100;
      onUpdateReduxLabelWidth(
        board,
        boardId,
        label.id,
        Math.max(newWidth, MIN_WIDTH)
      );
    },
    [isDragging, board, boardId, label.id]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    onUpdateLocalLabelWidth(boardId, label.id, label.width);
  }, [isDragging, boardId, label.id, label.width]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle mouse down correctly
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  function toggleConfirmationModal() {
    const animationDuration = 0.2;
    closeModal(modalId);

    if (deleteConfirmationModal) {
      confirmationAnimation(false, animationDuration);
      setTimeout(
        () => setDeleteConfirmationModal((prev) => !prev),
        animationDuration * 500
      );
    } else {
      setAnimationActive(true);
      setDeleteConfirmationModal((prev) => !prev);
      setTimeout(() => {
        confirmationAnimation(true, animationDuration);
        setAnimationActive(false);
      }, 10);
    }
  }

  function confirmationAnimation(isEnter, duration) {
    if (!confirmationRef.current) return;
    const animation = isEnter ? "fadeInDown" : "fadeOutUp";
    utilService.animateCSS(confirmationRef.current, animation, duration);
  }

  function shortLabelText(str){
    const sorthenStr = str.slice(0, (label.width / 8) - 7)
    return `${sorthenStr}${(sorthenStr.length < str.length) ? '...' : ''}`
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        border: 'none'
      }}
    >
      <div
        ref={labelRef}
        className="label"
        style={{
          backgroundColor:
            hoverLable || modal || isDragging || onEditMode ? "#F5F6F8" : "white",
          borderBottom: isFixed
            ? isBordScrollOnZero
              ? ""
              : "solid 1px #D0D4E4"
            : "",
        }}
      >
        <div className="drag-label" {...attributes} {...listeners}/>

        <div
          className="resize-label"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          style={{
            opacity: hoverLable || modal || isDragging ? "1" : "0",
            backgroundColor: isDragging && "#0073EA",
          }}
        ></div>

        {!onEditMode ? (
          <section className="text-area">
            {(hoverLable || modal) && <i
              ref={buttonRef}
              className="fa-solid fa-ellipsis"
              onClick={modalToggle}
              style={{backgroundColor: modal ? '#C8E1FA' : ''}}
            ></i>}
            
            <p onClick={toggleEditMode}>{shortLabelText(label.name)}</p>
          </section>
        ) : (
          <input
            autoFocus
            value={textToEdit}
            onChange={(event) => setTextToEdit(event.target.value)}
            onBlur={toggleEditMode}
            onKeyDown={handleKeyDown}
            type="text"
          />
        )}

        {modal && (
          <section
            className="label-modal"
            ref={modalRef}
            onPointerDown={(e) => e.stopPropagation()}
            style={isLast ? { left: "-205px" } : {}}
          >
            <button onClick={toggleConfirmationModal}>
              {getSvg("trash2")}
              Delete
            </button>
            <button onClick={onRenameLable}>
              {getSvg("pencil")}
              Rename
            </button>
          </section>
        )}

        {deleteConfirmationModal &&
          ReactDOM.createPortal(
            <DeleteLabelConfirmation
              onDeleteLable={onDeleteLable}
              toggleConfirmationModal={toggleConfirmationModal}
              confirmationRef={confirmationRef}
              animationActive={animationActive}
              labelName={label.name}
            />,

            document.body // Appends the modal properly
          )}
      </div>
    </div>
  );
}
