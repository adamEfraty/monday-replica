import OptionsIcon from "@mui/icons-material/TuneOutlined";
import { useSelector } from "react-redux";
import { openModal, closeModal } from "../../../store/actions/boards.actions";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useState, useEffect } from "react";
import { getSvg } from "../../../services/svg.service";

export function FilterModal({ boardId, boardColumnsFilter, handleFilteredLabel }) {
  const openModals = useSelector((state) => state.boardModule.openModals);
  const modal = openModals.some((modalId) => modalId === `filter`);
  const boards = useSelector((state) => state.boardModule.boards);
  const [boardLabels, setBoardLabels] = useState(boards.find((board) => board._id === boardId).labels);
  const [filterBy, setFilterBy] = useState("");


  useEffect(() => {
    const regExp = new RegExp(filterBy, "i");
    setBoardLabels(boards.find((board) => board._id === boardId).labels.filter((label) => regExp.test(label.name)));
  }, [filterBy, boards]);

  function modalToggle() {
    modal ? closeModal(`filter`) : openModal(`filter`);
  }

  function handleFilterChange({ target }) {
    const value = target.value;
    setFilterBy(value);
  }

  return (
    <div
      className="filter-modal"
      style={{ cursor: "pointer", paddingRight: 6, paddingTop: 4 }}
    >
      <section onClick={modalToggle} className="filter-modal">
        {getSvg('settings-icon')}
      </section>
      {modal && (
        <div className="filter-modal-content">
          <h4>Choose columns to search</h4>
          <div className="filter-input">
            <input type="text" placeholder="Find a column" onChange={handleFilterChange} />
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
                    onChange={() => handleFilteredLabel(label)}
                    id={label.id}
                    name={label.name}
                    checked={boardColumnsFilter.labels.some((column) => column.id === label.id)}
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
