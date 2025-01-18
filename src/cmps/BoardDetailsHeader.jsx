import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
import SearchIcon from '@mui/icons-material/SearchOutlined';
export function BoardDetailsHeader({ boardTitle }) {
  const iconStyle = { width: 18, height: 16 };
  return (
    <header className="board-details-header">
      <br />
      <div className="boardTitle">
        <h2>{boardTitle}</h2>
        <ArrowDownIcon />
      </div>
      <section className="board-nav">
        <div>
          <HomeIcon style={iconStyle} />
          <h6>Main Table</h6>
          <HorizDotsIcon style={iconStyle} />
          <hr className="highlight" />
        </div>
      </section>
      <hr />
      <section className="board-header-actions">
        <div className="newTask-button">
          <div className="new-task-button">New Item</div>
          <div className="arrow-down">
            <ArrowDownIcon style={iconStyle} />
          </div>
        </div>
        <div className="choice-div">
            <SearchIcon style={iconStyle} />
            <small>Search</small>
        </div>
      </section>
    </header>
  );
}
