import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from '@mui/icons-material/HomeOutlined';
import HorizDotsIcon from '@mui/icons-material/MoreHorizOutlined';
export function BoardDetailsHeader({ boardTitle }) {
  return (
    <header className="board-details-header">
      <br />
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2>{boardTitle}</h2>
        <ArrowDownIcon />
      </div>
      <br />
      <section>
        <div>
            <HomeIcon />
          <p>Main Table</p>
          <HorizDotsIcon />
        </div>
      </section>
      <hr style={{ width: "95%" }} />
    </header>
  );
}
