import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { utilService } from "../../../services/util.service";
import TimeIcon from "@mui/icons-material/AccessTime";
import ExportIcon from "@mui/icons-material/FileUploadOutlined";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export function ActivityModal({ activities }) {
  const boards = useSelector((state) => state.boardModule.boards);
  const users = useSelector((state) => state.userModule.users);
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
        {activities.map((activity) => {
          const user = users.find((user) => user.id === activity.userId);
          const idx = boards.findIndex((board) =>
            board.groups.some((group) => group.id === activity.activity.groupId)
          );
          const group = boards[idx].groups.find(
            (group) => group.id === activity.activity.groupId
          );
          console.log(group);
          const task = group.tasks.find((task) => task.id === activity.taskId);
          const userName = user.fullName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase();

          return (
            <section key={activity.id}>
              <section className="activity-modal-container">
                <section className="activity-modal">
                  <div>
                    <section className="time">
                      <TimeIcon />
                      {utilService.milisecondsTimeCalc(activity.time)}
                    </section>
                    <h4>{userName}</h4>
                    <p>{task.cells[0].value.title}</p>
                  </div>
                  {activity.activity.type !== "created" && (
                    <p>{activity.activity.field}</p>
                  )}
                  {activity.activity.type === "Added" ||
                  activity.activity.type === "Removed" ? (
                      <p>{activity.activity.type}</p>
                    ) : activity.activity.type === "created" ||
                    activity.activity.type === "Duplicated" ? (
                    <div className="created">
                      <p>{activity.activity.type}</p>
                      <div>
                        {`Group: `}
                        <p style={{ color: "blue" }}>{group.title}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p>
                        {activity.activity.preChange.text ||
                          activity.activity.preChange.title ||
                          (typeof activity.activity.preChange === "string" &&
                            activity.activity.preChange)}
                      </p>
                      <p>{" > "}</p>
                      <p>
                        {activity.activity.postChange.text ||
                          activity.activity.postChange.title}
                      </p>
                    </div>
                  )}
                </section>
              </section>
              <hr />
            </section>
          );
        })}
      </ul>
    </div>
  ) : (
    <h1>No Activities</h1>
  );
}
