import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
export function BoardDetailsHeader({ boardTitle }) {
  const iconStyle = { width: 20, height: 18 };
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
          <div className="new-task-button">New Item</div>
          <div className="arrow-down">
            <ArrowDownIcon style={{...iconStyle, height:20}} />
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
