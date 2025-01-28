import { AddItem } from "./menuOptions/AddItem.option";
import { SideBarBoard } from "./menuOptions/SideBarBoard.option";

export function MenuModal(props) {
  switch (props.type) {
    case "addItem":
      return <AddItem handleAddBoard={props.handleAddBoard} />;
    case "sideBarBoard":
      return (
        <SideBarBoard board={props.board} onRemoveBoard={props.onRemoveBoard} />
      );
      case "task":
        return (
            <TaskMenu task={props.task} onRemoveTask={props.onRemoveTask} />
        );
    default:
      console.error(`Unknown component type: ${props.type}`);
      return <div>Unknown component: {props.type}</div>;
  }
}
