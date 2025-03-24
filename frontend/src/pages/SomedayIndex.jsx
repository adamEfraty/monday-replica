import { useSelector } from "react-redux";
import { AppHeader } from "../cmps/AppHeader";
import { SideBar } from "../cmps/SideBar";
import { MainInnerIndex } from "../cmps/MainInnerIndex";
import { removeBoard } from "../store/actions/boards.actions";
import { CreateBoard } from "../cmps/dynamicCmps/modals/CreateBoard";
import { addBoard } from "../store/actions/boards.actions";
import { useState } from "react";

export function SomedayIndex({ isBoard = false, isKanban = false }) {
  const user = useSelector((state) => state.userModule.user);
  const boards = useSelector((state) => state.boardModule.boards);
  const addBoardModalState = useSelector(
    (state) => state.boardModule.addBoardModalState
  );
  const [addBoardModal, setAddBoardModal] = useState(false)
  

  function onRemoveBoard(id) {
    removeBoard(id);
  }

  function handleAddBoard(boardName = "New Board") {
    addBoard(boardName);
  }

  function addBoardModalToggle() {
    setAddBoardModal(prev=>!prev)
  }

  return (
    <div className="index-container">
      {addBoardModalState && <CreateBoard handleAddBoard={handleAddBoard} />}
      <AppHeader userData={user} />
      <section className="content">

        <SideBar 
        boards={boards} 
        user={user} 
        onRemoveBoard={onRemoveBoard} 
        addBoardModalToggle={addBoardModalToggle} 
        addBoardModal={addBoardModal}/>

        <MainInnerIndex 
        user={user} 
        isBoard={isBoard} 
        isKanban={isKanban} 
        boards={boards} 
        addBoardModalToggle={addBoardModalToggle} 
        addBoardModal={addBoardModal}/>
      </section>
    </div>
  );
}
