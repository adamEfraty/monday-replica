import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { FilterModal } from "./dynamicCmps/modals/filterModal";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  handleFilter,
  getFilterContext,
} from "../store/actions/boards.actions";
import { boardService } from "../services/board.service";
export function BoardDetailsHeader({ handleAddTask, boardTitle, boardId, boardColumnsFilter, handleFilteredLabel }) {
  const filterBy = useSelector((state) => state.boardModule.filterBy);
  const boards = useSelector((state) => state.boardModule.boards);
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
  const [filterState, setFilterState] = useState(boardService.getFilterState());

  useEffect(() => {
    const filter = getFilterContext();
    setFilterByToEdit(filter);
  }, []);

  useEffect(() => {
    handleFilter(filterByToEdit);
  }, [filterByToEdit]);

  const iconStyle = { width: 20, height: 18 };

  function handleFilterChange({ target }) {
    const value = target.value;
    setFilterByToEdit(value);
  }

  function handleFilterStateChange(state) {
    boardService.setFilterStateSession(state);
    !filterState == state && setFilterState(state);
  }
  return (
    <header className="board-details-header">
      <br />
      <div className="boardTitle">
        <h2>{boardTitle}</h2>
        <ArrowDownIcon />
      </div>
      <section className="board-nav">
        <div>
          <div>
            <HomeIcon style={iconStyle} />
            <h5>Main Table</h5>
          </div>
          <HorizDotsIcon style={iconStyle} />
          <hr className="highlight" />
        </div>
      </section>
      <hr />
      <section className="board-header-actions">
        <div className="newTask-button">
          <div className="new-task-button" onClick={() => handleAddTask()}>
            New Item
          </div>
          <div className="arrow-down">
            <ArrowDownIcon style={{ ...iconStyle, height: 20 }} />
          </div>
        </div>
        <div
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              filterBy.length === 0 && handleFilterStateChange(false); // Only trigger if focus leaves the div and its children
            }
          }}
          onClick={() => handleFilterStateChange(true)}
          className={filterState ? "filter-input" : "choice-div"}
          tabIndex={0} // Make the div focusable
        >
          <SearchIcon style={{ width: 24, height: 24 }} />
          {filterState ? (
            <>
              <input
                onChange={handleFilterChange}
                type="text"
                value={filterByToEdit}
                autoFocus
              />
              <FilterModal boardId={boardId} boardColumnsFilter={boardColumnsFilter} handleFilteredLabel={handleFilteredLabel} />
            </>
          ) : (
            <small>Search</small>
          )}
        </div>
      </section>
    </header>
  );
}
