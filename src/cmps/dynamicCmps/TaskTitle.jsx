const TaskTitle = ({ info, onTaskUpdate }) => {
    console.log("title", info);
    return <span onClick={() => onTaskUpdate("title update")}>{info}</span>;
};

export default TaskTitle;
