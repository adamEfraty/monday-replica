import { useNavigate, useLocation } from "react-router";
import { addBoard, removeBoard } from "../store/actions/boards.actions";
import { utilService } from "../services/util.service";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSvg, SvgCmp } from "../services/svg.service";
import { useDispatch } from "react-redux";
import { openModal, closeModal, updateBoardFavorite } from '../store/actions/boards.actions.js'
import { AddBoardModal } from "./dynamicCmps/modals/AddBoardModal.jsx";


export function SideBar({ boards, user, addBoardModalToggle, addBoardModal }) {
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const horizontalDotsRefs = useRef([])

  const openModals = useSelector(state => state.boardModule.openModals)
  const preAddBoardModal = openModals.some(modalId => modalId === 'pre-add-board-modal')
  const preAddBoardModalRef = useRef(null)
  const preAddBoardButtonRef = useRef(null)

  const [removeBoardId, setRemoveBoardId] = useState(null)
  const removeBoardModalRef = useRef(null)

  function preAddBoardModalToggle() {
    preAddBoardModal
    ? closeModal('pre-add-board-modal')
    : openModal('pre-add-board-modal')
  }

  //if user click outside modal close it
  function handleClickOutsideAddModal(event) {
      if (!preAddBoardModalRef.current.contains(event.target) && 
        !preAddBoardButtonRef.current.contains(event.target))
        preAddBoardModalToggle()
  }

  // open listener to handleClickOutsideModal only when modal open
  useEffect(() => {
      if (preAddBoardModal) document.addEventListener
          ('mousedown', handleClickOutsideAddModal)
      else document.removeEventListener
          ('mousedown', handleClickOutsideAddModal)
      return () => document.removeEventListener
          ('mousedown', handleClickOutsideAddModal)

  }, [preAddBoardModal])

  function onChangeAdressOnce(fullAddress) {
    if (location.pathname !== fullAddress) {
      navigate(`${fullAddress}`);
    }
  }


  function handleClickOutsideRemoveModal(event) {
    if (!removeBoardModalRef.current.contains(event.target))
      setRemoveBoardId(null)
  }

  useEffect(() => {
      if (removeBoardId) document.addEventListener
          ('mousedown', handleClickOutsideRemoveModal)
      else document.removeEventListener
          ('mousedown', handleClickOutsideRemoveModal)
      return () => document.removeEventListener
          ('mousedown', handleClickOutsideRemoveModal)

  }, [removeBoardId])


  const iconStyle = { width: 22, height: 22 };

  return (
    <nav className="side-bar">
      {/* Home Section */}
      <section
        className="sidebar-home"
        style={{backgroundColor:  window.location.hash.endsWith('.com') ? '#CCE5FF' : ''}}
        onClick={() =>
          onChangeAdressOnce(
            `/${utilService.getNameFromEmail(user.email)}s-team.someday.com`
          )
        }
      >
        {getSvg('home-icon')}
        <p>Home</p>
      </section>

      {/* Favorites Section */}
      <section className="favorites" onClick={() => setFavoritesOpen(!favoritesOpen)}>
        <div className="left-part">
          <SvgCmp
            type={!favoritesOpen ? `empty-rating-icon` : `full-rating-icon`}
            className="side-bar-icon favorites"
            style={favoritesOpen ? iconStyle : { ...iconStyle, backgroundColor: "" }}
          />
          <p>Favorites</p>
        </div>
        {favoritesOpen ? 
          <div style={{transform: 'rotate(-90deg)'}}>
            {getSvg('group-title-arrow')}
          </div>
          
          : 
          <div style={{transform: 'rotate(90deg)'}}>
            {getSvg('group-title-arrow')}
          </div>
        }
      </section>

      {/* Workspaces Section */}
      {favoritesOpen ? (
        <ul className="sidebar-boardlist">
          {boards.map((board, index) => board.isFavorite && (
            <li key={board._id}>
              <div
                className="sidebar-board"
                style={{backgroundColor:  window.location.hash.endsWith(board._id) || 
                  window.location.hash.endsWith(`${board._id}/views`) ? '#CCE5FF' : ''}}
                onClick={() => {
                  onChangeAdressOnce(
                    `/${utilService.getNameFromEmail(
                      user.email
                    )}s-team.someday.com/boards/${board._id}`
                  )
                }}
              >
                <section>
                  {getSvg('board-icon')}
                  {/* Board Title Navigation */}
                  <h3>{board.title}</h3>
                </section>

                <div className="horizontal-dots-icon" ref={el => horizontalDotsRefs.current[index] = el}
                  onClick={() => setRemoveBoardId(board._id)}>
                    {getSvg('horizontal-dots')}
                </div>

                {
                  removeBoardId === board._id &&
                  <div className="remove-board-modal" ref={removeBoardModalRef}>
                    
                    <button onClick={()=>{
                      updateBoardFavorite(board._id)
                      setRemoveBoardId(null)
                    }}>{getSvg('empty-rating-icon')}{`${board.isFavorite ? 'Remove from' : 'Add to'} favorites`}</button>

                    <button onClick={()=>{
                      removeBoard(board._id)
                      setRemoveBoardId(null)
                      }}>{getSvg('trash2')}Delete</button>

                  </div>
                }
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <hr />
          <div className="workspaces">
            <section>
              {getSvg('workspaces-icon')}
              <p>Workspaces</p>
            </section>
            <div className="add-board">
              <div>
                <span className="m-icon">M</span>
                <div className="small-house-icon">
                  {getSvg('small-house')}
                </div>
                <h3>Main workspace</h3>

                <div className="arrow-down-workspace">
                  {getSvg('group-title-arrow')}
                </div>
              </div>
              <button className="add-board-button" ref={preAddBoardButtonRef}
              onClick={preAddBoardModalToggle}>
                {getSvg('thin-plus')}
              </button>
              {
                preAddBoardModal &&
                <section className="pre-add-board-modal" ref={preAddBoardModalRef}>
                  <button onClick={()=>{
                    addBoardModalToggle()
                    preAddBoardModalToggle()
                  }}>
                    {getSvg('board-icon')}
                    Add new board
                    </button>
                </section>
              }
            </div>
          </div>

          {/* Board List */}
          <ul className="sidebar-boardlist">
            {boards.map((board, index) => (
              <li key={board._id}>
                <div
                  className="sidebar-board"
                  style={{backgroundColor:  window.location.hash.endsWith(board._id) || 
                    window.location.hash.endsWith(`${board._id}/views`) ? '#CCE5FF' : ''}}
                  onClick={event => {
                    !horizontalDotsRefs.current.some(ref=>ref && ref.contains(event.target)) &&
                    !removeBoardModalRef.current?.contains(event.target) &&
                    onChangeAdressOnce(
                      `/${utilService.getNameFromEmail(
                        user.email
                      )}s-team.someday.com/boards/${board._id}`
                    )
                  }}
                >
                  <section>
                    {getSvg('board-icon')}
                    {/* Board Title Navigation */}
                    <h3>{board.title}</h3>
                  </section>

                  <div className="horizontal-dots-icon" ref={el => horizontalDotsRefs.current[index] = el}
                  onClick={() => setRemoveBoardId(board._id)}>
                    {getSvg('horizontal-dots')}
                  </div>

                  {
                    removeBoardId === board._id &&
                    <div className="remove-board-modal" ref={removeBoardModalRef}>
                      
                      <button onClick={()=>{
                        updateBoardFavorite(board._id)
                        setRemoveBoardId(null)
                      }}>{getSvg('empty-rating-icon')}{`${board.isFavorite ? 'Remove from' : 'Add to'} favorites`}</button>

                      <button onClick={()=>{
                        removeBoard(board._id)
                        setRemoveBoardId(null)
                        }}>{getSvg('trash2')}Delete</button>

                    </div>
                  }
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {
        addBoardModal &&
        <AddBoardModal 
        addBoardModalToggle={addBoardModalToggle} 
        addBoard={addBoard}
        userEmail={utilService.getNameFromEmail(user.email)}/>
      }
    </nav>
  );
}
