import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { utilService } from "../../../services/util.service";
import TimeIcon from "@mui/icons-material/AccessTime";
import ExportIcon from "@mui/icons-material/FileUploadOutlined";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";
import HorizontalIcon from "@mui/icons-material/HorizontalRule";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TextFieldsSharpIcon from "@mui/icons-material/TextFieldsSharp";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

export function ActivityModal({ activities, width }) {
  const boards = useSelector((state) => state.boardModule.boards);
  const users = useSelector((state) => state.userModule.users);

  const iconStyle = { width: 14 };

  function handleLongText(text) {
    if (text) {
      const maxLetters = Math.floor(width / 22) - 25;
      if (text.length < maxLetters) return text;
      else {
        const shortenText = `${text.slice(0, maxLetters)}...`;
        return shortenText;
      }
    } else {
      return null;
    }
  }

  return activities[0] ? (
    <div className="activities-modal-container">
      <section className="header-activities">
        <section className="newTask-button">
          <div className="new-task-button">Filter Log</div>
          <div className="arrow-down">
            <ArrowDownIcon />
          </div>
        </section>
        <ExportIcon className="export-icon" />
      </section>
      <ul className="activities-modal">
        {activities.map((activity, activityIdx) => {
          console.log("A bunch of different data: ", users, activity, boards);
          const user = users.find((user) => user._id === activity.userId);
          const idx = boards.findIndex((board) =>
            board.groups.some((group) => group.id === activity.activity.groupId)
          );
          const group = boards[idx].groups.find(
            (group) => group.id === activity.activity.groupId
          );
          const task = group.tasks.find((task) => {
            console.log(task.id, activity.taskId);
            return task.id === activity.taskId;
          });
          console.log(task, activity.taskId);
          const userName = user.fullName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase();

          console.log(typeof activity.activity.postChange);

          return (
            <section key={activityIdx}>
              {activityIdx > 0 && <hr />}
              <section className="activity-modal-container">
                <section className="activity-modal">
                  <div>
                    <section className="time">
                      <TimeIcon style={iconStyle} />
                      <p>{utilService.milisecondsTimeCalc(activity.time)}</p>
                    </section>
                    <h4>{userName}</h4>
                    <p>{task.cells[0].value.title}</p>
                  </div>
                  <section className="scdColumn">
                    {activity.activity.type !== "created" && (
                      <div>
                        <Icon type={activity.activity.field} />
                        <p>{activity.activity.field}</p>
                      </div>
                    )}
                    {activity.activity.type === "Added" ||
                    activity.activity.type === "Removed" ? (
                      Array.isArray(activity.activity.item) &&
                      activity.activity.item[0].fullName ? (
                        <div className="data-column">
                          <p>{activity.activity.type}</p>
                          <p>{activity.activity.item[0].fullName}</p>
                        </div>
                      ) : (
                        <p>{activity.activity.type}</p>
                      )
                    ) : activity.activity.type === "created" ||
                      activity.activity.type === "Duplicated" ? (
                      <div className="created">
                        <Icon type={activity.activity.type} />
                        <p>{activity.activity.type}</p>
                      </div>
                    ) : (
                      <div className="data-column">
                        <section
                          className="activity-priority-modal"
                          style={{
                            backgroundColor: activity.activity.preChange?.color,
                            color:
                              activity.activity.preChange === null ||
                              typeof activity.activity.preChange === "string" ||
                              typeof activity.activity.preChange?.title ===
                                "string"
                                ? "black"
                                : "white",
                          }}
                        >
                          {activity.activity.preChange?.text ? (
                            handleLongText(activity.activity.preChange.text)
                          ) : activity.activity.preChange?.title ? (
                            handleLongText(activity.activity.preChange.title)
                          ) : activity.activity.preChange === null ? (
                            <HorizontalIcon />
                          ) : typeof activity.activity.preChange ===
                            "string" ? (
                            handleLongText(activity.activity.preChange)
                          ) : null}
                        </section>
                        <ArrowForwardIcon style={{ width: 12 }} />
                        <section
                          className="activity-priority-modal"
                          style={{
                            backgroundColor:
                              activity.activity.postChange?.color,
                            minWidth:
                              activity.activity.postChange?.text?.length > 0
                                ? 0
                                : 30,
                            color:
                              typeof activity.activity.preChange === "string" ||
                              typeof activity.activity.preChange?.title ===
                                "string"
                                ? "black"
                                : "white",
                          }}
                        >
                          <p>
                            {handleLongText(
                              typeof activity.activity.postChange === "string"
                                ? activity.activity.postChange
                                : activity.activity.postChange.text
                                ? activity.activity.postChange.text
                                : activity.activity.postChange.title
                            )}
                          </p>
                        </section>
                      </div>
                    )}
                    {activity.activity.type === "created" ||
                    activity.activity.type === "Duplicated" ? (
                      <div className="data-column">
                        {`Group: `}
                        <p style={{ color: "blue" }}>{group.title}</p>
                      </div>
                    ) : null}
                  </section>
                </section>
              </section>
            </section>
          );
        })}
      </ul>
    </div>
  ) : (
    <h1>No Activities</h1>
  );
}

function Icon({ type }) {
  console.log(type);
  switch (type) {
    case "created":
      return <AddCircleOutlineIcon />;
    case "Duplicated":
      return <ContentCopyOutlinedIcon />;
    case "date":
      return <CalendarMonthOutlinedIcon />;
    case "taskTitle":
      return <TextFieldsSharpIcon />;
    case "priority":
      return <TableRowsOutlinedIcon />;
    case "status":
      return <TableRowsOutlinedIcon />;
    case "members":
      return <GroupOutlinedIcon />;
  }
}
