
import { useSelector } from "react-redux";
import { AppHeader } from "../cmps/AppHeader";
import { SideBar } from "../cmps/SideBar";
import { MainInnerIndex } from "../cmps/MainInnerIndex";
import { removeBoard } from "../store/actions/boards.actions";


export function MondayIndex({ isBoard = false }) {
    const user = useSelector(state => state.userModule.user)
    const boards = useSelector(state => state.boardModule.boards)


    function onRemoveBoard(id) {
        removeBoard(id);
    }

    return (
        <div className="index-container">
            <AppHeader userData={user} />
            <section className="content">
                <SideBar boards={boards} user={user} onRemoveBoard={onRemoveBoard} />
                <MainInnerIndex user={user} isBoard={isBoard} boards={boards} />
            </section>
        </div>
    )
}