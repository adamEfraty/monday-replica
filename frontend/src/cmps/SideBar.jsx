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

  return (
    <nav className="side-bar">
      {/* Home Section */}
      <section
        onClick={() =>
          onChangeAdressOnce(
            `/${utilService.getNameFromEmail(user.email)}s-team.sunday.com`
          )
        }
      >
        <HomeIcon className="side-bar-icon home" style={iconStyle} />
        <p>Home</p>
      </section>
      {/* My Work Section */}
      <section>
        <MyWorkIcon className="side-bar-icon myWork" style={iconStyle} />
        <p>My Work</p>
      </section>

      <hr />

      {/* Favorites Section */}
      <section className="favorites">
        <div>
          <SvgCmp
            type={!favoritesOpen ? `empty-rating-icon` : `full-rating-icon`}
            className="side-bar-icon favorites"
            style={favoritesOpen ? iconStyle : { ...iconStyle, backgroundColor: "" }}
          />
          <p>Favorites</p>
        </div>
        {favoritesOpen ? (
          <ArrowUpIcon onClick={() => setFavoritesOpen(!favoritesOpen)} />
        ) : (
          <ArrowDownIcon onClick={() => setFavoritesOpen(!favoritesOpen)} />
        )}
      </section>

      {/* Workspaces Section */}
      {favoritesOpen ? (
        <ul className="sidebar-boardlist">
          {boards.map((board) => favorites.includes(board.id) && (
            <li key={board.id}>
              <div
                className="sidebar-board"
                onClick={() => {
                  console.log(board.id);
                  onChangeAdressOnce(
                    `/${utilService.getNameFromEmail(
                      user.email
                    )}s-team.sunday.com/boards/${board.id}`
                  );
                }}
              >
                <section>
                  <BoardIcon style={iconStyle} />
                  {/* Board Title Navigation */}
                  <h3>{board.title}</h3>
                </section>
                <HorizDotsIcon
                  onClick={(event) => handleDotsClick(event, board.id)}
                  className="horizontal-dots-icon"
                  style={iconStyle}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <hr />
          <div className="workspaces">
            <section>
              <WorkspacesIcon
                className="side-bar-icon work"
                style={iconStyle}
              />
              <p>Workspaces</p>
            </section>
            <div className="add-board">
              <div>
                <h3>Main Workspace</h3>
                <ArrowDownIcon style={iconStyle} />
              </div>
              <button
                className="add-board-button"
                onClick={(ev) => setAnchorEl(ev.currentTarget)}
              >
                <PlusIcon style={{ width: 28, height: 26 }} />
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
                <MenuModal type="addItem" handleOpenModal={() => {
                  console.log('im heree')
                  setOpenModal(!addBoardModalState)
                }
                } />
              </Popover>
            </div>
          </div>

          {/* Board List */}
          <ul className="sidebar-boardlist">
            {boards.map((board) => (
              <li key={board.id}>
                <div
                  className="sidebar-board"
                  onClick={() => {
                    console.log(board.id);
                    onChangeAdressOnce(
                      `/${utilService.getNameFromEmail(
                        user.email
                      )}s-team.sunday.com/boards/${board.id}`
                    );
                  }}
                >
                  <section>
                    <BoardIcon style={iconStyle} />
                    {/* Board Title Navigation */}
                    <h3>{board.title}</h3>
                  </section>

                  {/* <button
                className="options-menu"
                onClick={() => onRemoveBoard(board.id)}
              >
                X
              </button> */}
                  <HorizDotsIcon
                    onClick={(event) => handleDotsClick(event, board.id)}
                    className="horizontal-dots-icon"
                    style={iconStyle}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
}
