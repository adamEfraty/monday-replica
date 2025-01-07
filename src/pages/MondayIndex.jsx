
import { useSelector } from "react-redux";
import { AppHeader } from "../cmps/AppHeader";
import { SideBar } from "../cmps/SideBar";
import { MainInnerIndex } from "../cmps/MainInnerIndex";
import { useParams } from "react-router";

export function MondayIndex({isBoard = false}) {
    const { boardId } = useParams()
    const user = useSelector(state => state.userModule.user)
    const boards = useSelector(state => state.boardModule.boards)


    return (
        <div className="index-container">
            <AppHeader userData={user} />
            <section className="content">
            <SideBar />
            <MainInnerIndex user={user} isBoard={isBoard} boards={boards} />
            </section>
        </div>
    )
}