import { useEffect, useState } from "react";
import { eventBusService } from "../services/event-bus.service";
import { undo } from "../store/actions/boards.actions";
import DoneIcon from "@mui/icons-material/Done";
import XIcon from "@mui/icons-material/Clear";

export function UserMsg() {
  const [msg, setMsg] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    eventBusService.on("show-user-msg", (msg) => {
      setMsg(msg);
      setIsVisible(true);
      //   setTimeout(closeMsg, 20000);
    });
  }, []);

  const iconStyle = { width: 20 };

  function closeMsg() {
    setMsg(null);
    setIsVisible(false);
  }

  function handleUndo(data) {
    undo(data);
    closeMsg();
  }

  if (!msg) return <></>;
  return (
    <div className={`user-msg ${msg.type} ${isVisible ? "visible" : ""}`}>
      <div className="msg">
        {msg.type === "success" ? (
          <DoneIcon style={iconStyle} />
        ) : (
          <XIcon style={iconStyle} />
        )}
        <h4>{msg.txt}</h4>
      </div>
      {msg.data ? (
        <button className="undo-btn btn" onClick={() => handleUndo(msg.data)}>
          Undo
        </button>
      ) : null}
      <XIcon onClick={closeMsg} className="close-btn btn" />
    </div>
  );
}
