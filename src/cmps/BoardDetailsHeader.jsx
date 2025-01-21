import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useSelector } from "react-redux";
import { setFilterState } from "../store/actions/boards.actions";
export function BoardDetailsHeader({ boardTitle }) {
  const filterBy = useSelector((state) => state.boardModule.filterBy);
  const filterState = useSelector((state) => state.boardModule.filterState);
  const iconStyle = { width: 20, height: 18 };

  function handleFilterState(state) {
    console.log("skjfhiushdfuigh", filterState, state);
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
          <div className="new-task-button">New Item</div>
          <div className="arrow-down">
            <ArrowDownIcon style={{ ...iconStyle, height: 20 }} />
          </div>
        </div>
        <div
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              handleFilterState(false); // Only trigger if focus leaves the div and its children
            }
          }}
          onClick={() => handleFilterState(true)}
          className={filterState ? "filter-input" : "choice-div"}
          tabIndex={0} // Make the div focusable
        >
          <SearchIcon style={{ width: 24, height: 24 }} />
          {filterState ? (
            <input
              autoFocus
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleFilterState(false);
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
