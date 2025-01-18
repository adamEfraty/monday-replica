import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
export function BoardDetailsHeader({ boardTitle }) {
    const iconStyle = { width: 18 };
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
    </header>
  );
}
