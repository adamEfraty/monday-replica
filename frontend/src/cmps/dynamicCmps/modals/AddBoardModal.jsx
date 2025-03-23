import { useState } from "react"
import { useNavigate } from "react-router";
import { getSvg } from '../../../services/svg.service.jsx'

export function AddBoardModal({addBoardModalToggle, addBoard, userEmail}){

    const navigate = useNavigate();
    const [newBoardName, setNewBoardName] = useState('')

    async function createNewBoard(){
        const newName = newBoardName === '' ? 'New Board' : newBoardName
        const newBoard = await addBoard(newName)
        addBoardModalToggle()
        navigate(`/${userEmail}s-team.someday.com/boards/${newBoard._id}`)
    }

    return(
        <section className="add-board-modal">
            <div className="dark-background" onClick={addBoardModalToggle}/>

            <section className="add-board-window">
                <button className="close-button" onClick={addBoardModalToggle}>
                    <div style={{transform: 'rotate(45deg)'}}>
                        {getSvg('thin-plus')}
                    </div>
                </button>
                <h1>Create Board</h1>

                <p>Board name</p>
                <input type="text" onChange={event=>
                    setNewBoardName(event.target.value)}
                    placeholder="New Board Name"/>

                <div className="buttons-area">
                    <button className="cancel-button" onClick={addBoardModalToggle}>Cancel</button>
                    <button className="create-button" onClick={createNewBoard}>
                        Create Board
                    </button>

                </div>
            </section>
        </section>
    )
}