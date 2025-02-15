import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { utilService } from "../../../services/util.service";

export function ActivityModal({ activities }) {
  const boards = useSelector((state) => state.boardModule.boards);
  const users = useSelector((state) => state.userModule.users);
  useEffect(() => {
    console.log(activities);
  }, []);
  return activities[0] ? (
    <ul>
      {activities.map((activity) => {
        const user = users.find((user) => user.id === activity.userId);
        const idx = boards.findIndex((board) =>
          board.groups.some((group) => group.id === activity.activity.groupId)
        );
        const group = boards[idx].groups.find(
          (group) => group.id === activity.activity.groupId
        );
        const task = group.tasks.find((task) => task.id === activity.taskId);
        const userName = user.fullName
          .split(" ")
          .map((name) => name[0])
          .join("")
          .toUpperCase();
        console.log(user, group.title, activities);
        return (
          <section className="activity-modal" key={activity.id}>
            <div>
              <p>{utilService.milisecondsTimeCalc(activity.time)}</p>
              <h4>{userName}</h4>
              <p>{task.cells[0].value.title}</p>
            </div>
            <div>
              <p>{activity.activity.field}</p>
            </div>
            {activity.activity.type === "Added" ||
            activity.activity.type === "Removed" ? (
              <p>{activity.activity.type}</p>
            ) : activity.activity.type === "created" ? (
              <div>
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
                    activity.activity.preChange.title}
                </p>
                <p>{" > "}</p>
                <p>
                  {activity.activity.postChange.text ||
                    activity.activity.postChange.title}
                </p>
              </div>
            )}
            {activity.item && <div>{activity.item}</div>}
          </section>
        );
      })}
    </ul>
  ) : (
    <h1>No Activities</h1>
  );
}
