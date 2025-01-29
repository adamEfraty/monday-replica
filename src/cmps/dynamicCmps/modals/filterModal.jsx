import OptionsIcon from "@mui/icons-material/TuneOutlined";
import { useSelector } from "react-redux";
import { openModal, closeModal } from "../../../store/actions/boards.actions";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useState } from "react";
import { getSvg } from "../../../services/svg.service";

export function FilterModal({ boardId }) {
  const openModals = useSelector((state) => state.boardModule.openModals);
  const modal = openModals.some((modalId) => modalId === `filter`);
  const boards = useSelector((state) => state.boardModule.boards);
  const boardLabels = boards.find((board) => board.id === boardId).labels;

  function modalToggle() {
    modal ? closeModal(`filter`) : openModal(`filter`);
  }

  return (
    <div
      className="filter-modal"
      style={{ cursor: "pointer", paddingRight: 6, paddingTop: 4 }}
    >
      <section onClick={modalToggle} className="filter-modal">
        <OptionsIcon style={{ width: 24, height: 24 }} />
      </section>
      {modal && (
        <div className="filter-modal-content">
          <h4>Choose columns to search</h4>
          <div className="filter-input">
            <input type="text" placeholder="Find a column" />
            <SearchIcon />
          </div>
          <section className="filter-selection">
            <div className="all-columns">
              <input type="checkbox" />
              <h5>All columns</h5>
            </div>
            <div>
              <input type="checkbox" />
              <small>Item columns</small>
            </div>
            <ul>
              {boardLabels.map((label) => (
                <li key={label.id}>
                  <input
                    type="checkbox"
                    id={label.id}
                    name={label.name}
                    value={label.name}
                  />
                  <div>
                    {getSvg(`${label.type}-icon`)}
                    <label htmlFor={label.id}>{label.name}</label>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
