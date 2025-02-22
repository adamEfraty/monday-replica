import BoardIcon from "@mui/icons-material/SpaceDashboardOutlined";

export function AddItem({ handleAddBoard }) {
  return (
    <div className="add-item-popover">
      <p>Add new</p>
      <li>
        <ul onClick={handleAddBoard}><BoardIcon /><h5>Board</h5></ul>
      </li>
    </div>
  );
}
