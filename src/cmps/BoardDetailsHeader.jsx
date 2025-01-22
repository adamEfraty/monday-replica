import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { handleFilter, getFilterContext } from "../store/actions/boards.actions";
import { boardService } from "../services/board.service";
export function BoardDetailsHeader({ handleAddTask, boardTitle }) {
  const filterBy = useSelector((state) => state.boardModule.filterBy);
  const boards = useSelector((state) => state.boardModule.boards);
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);
  const [filterState, setFilterState] = useState(boardService.getFilterState());

  useEffect(() => {
    const filter = getFilterContext();
    setFilterByToEdit(filter);
  }, [])

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
    <header className="board-details-header stick">
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
          <div className="new-task-button" onClick={() => handleAddTask()}>New Item</div>
          <div className="arrow-down">
            <ArrowDownIcon style={{ ...iconStyle, height: 20 }} />
          </div>
        </div>
        <div
          onBlur={(e) => {
            console.log("Ragnar")
            if (!e.currentTarget.contains(e.relatedTarget)) {
              handleFilterStateChange(false); // Only trigger if focus leaves the div and its children
            }
          }}
          onClick={() => handleFilterStateChange(true)}
          className={filterState ? "filter-input" : "choice-div"}
          tabIndex={0} // Make the div focusable
        >
          <SearchIcon style={{ width: 24, height: 24 }} />
          {filterState ? (
            <input
              onChange={handleFilterChange}
              type="text"
              value={filterByToEdit}
              autoFocus
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleFilterStateChange(false);
                }
              }}
            />
          ) : (
            <small>Search</small>
          )}
        </div>
      </section>
    </header>
  );
}
