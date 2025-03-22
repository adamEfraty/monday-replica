import HomeIcon from "@mui/icons-material/HomeOutlined";
import MyWorkIcon from "@mui/icons-material/EventAvailableOutlined";
import WorkspacesIcon from "@mui/icons-material/GridViewOutlined";
import { useNavigate, useLocation } from "react-router";
import { addBoard } from "../store/actions/boards.actions";
import { utilService } from "../services/util.service";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PlusIcon from "@mui/icons-material/AddOutlined";
import BoardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import HorizDotsIcon from "@mui/icons-material/MoreHorizOutlined";
import { MenuModal } from "./dynamicCmps/modals/menu/MenuModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getSvg, SvgCmp } from "../services/svg.service";
import Popover from "@mui/material/Popover";
import { CreateBoard } from "./dynamicCmps/modals/CreateBoard";
import { useDispatch } from "react-redux";
import { SET_MODAL } from "../store/reducer/boards.reducer";

export function SideBar({ boards, user, onRemoveBoard }) {
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const favorites = useSelector((state) => state.boardModule.favorites);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "add-item-popover" : undefined;
  const addBoardModalState = useSelector((state) => state.boardModule.addBoardModalState);
  const dispatch = useDispatch();

  function setOpenModal(value) {
    dispatch({ type: SET_MODAL, value });
  }

  function onChangeAdressOnce(fullAddress) {
    if (location.pathname !== fullAddress) {
      navigate(`${fullAddress}`);
    }
  }

  function handleDotsClick(event, boardId) {
    event.stopPropagation();
    onRemoveBoard(boardId);
  }

  const iconStyle = { width: 22, height: 22 };

  function isInKanban() {
    console.log('window.location.hash', window.location.hash)
    return window.location.hash.endsWith('views');
  }

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
          {boards.map((board) => board.isFavorite && (
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

                <div className="horizontal-dots-icon"
                onClick={(event) => handleDotsClick(event, board._id)}>
                  {getSvg('horizontal-dots')}
                </div>
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
              <button
                className="add-board-button"
                onClick={(ev) => setAnchorEl(ev.currentTarget)}
              >
                {getSvg('thin-plus')}
              </button>
              <Popover
                id={popoverId}
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "right",
                  horizontal: "bottom",
                }}
              >
                <MenuModal type="addItem" handleOpenModal={() => setOpenModal(!addBoardModalState)} />
              </Popover>
            </div>
          </div>

          {/* Board List */}
          <ul className="sidebar-boardlist">
            {boards.map((board) => (
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

                  <div className="horizontal-dots-icon"
                  onClick={(event) => handleDotsClick(event, board._id)}>
                    {getSvg('horizontal-dots')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
}
