
const Date = ({ onTaskUpdate, info }) => {
    return <span className="date-pill" onClick={() => onTaskUpdate("date update")}>{info}</span>;
};

export default Date;
