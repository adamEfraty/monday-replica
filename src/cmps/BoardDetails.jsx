import "../styles/_Board-Details.scss";
import GroupPreview from "./GroupPreview";
import { useState, useEffect } from 'react'
import { logout, loadUsers } from "../store/actions/user.actions";
import { loadBoards } from "../store/actions/boards.actions";
import { SelectedTasksModal } from "./dynamicCmps/modals/SelectedTasksModal";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
const BoardDetails = () => {
    const {boardId} = useParams()
    const navigate = useNavigate()
    const [checkedBoxes, setCheckedBoxes] = useState([])
    const [checkedGroups, setCheckedGroups] = useState([])

    const boards = useSelector((state) => state.boardModule.boards);
    const user = useSelector(state => state.userModule.user)
    const users = useSelector(state => state.userModule.users)

    const currentBoard = boards.find((board) => board._id === boardId);

    const groups = currentBoard?.groups || [];

    //.........................
    useEffect(() => {
        onLoadBoards()
    }, [boards.groups])

    async function onLoadBoards() {
        await loadBoards()
        await loadUsers()
    }
    function onLogout() {
        navigate('/')
        logout()
    }

    //...............................

    function handleAddGroup() {
        addGroup(boardId);
    }

    // function that set groups with each task update
    function onTaskUpdate(changeInfo) {

        // just some console to track changes
        const updateInfo = `
        groupId:${changeInfo.group.id},
        taskId:${changeInfo.task.id}, 
        type: ${changeInfo.type}
        value: ${changeInfo.value}`
        console.log(updateInfo)

        // defult variables
        let newGroups = []
        let updatedField = ''

        // change updatedField according to the data change type
        switch(changeInfo.type){
            case "title update": updatedField = 'taskTitle'; break
            case "priority update": updatedField = 'priority'; break
            case "status update": updatedField = 'status'; break
            case "date update": updatedField = 'date'; break
            case "members add": updatedField = 'members'; break
            case "members remove": updatedField = 'members'; break
            default: console.error(`Unknown update task type: ${changeInfo.type}`)
        }

        // create new goups with the new task data
        const newTask = {...changeInfo.task, [updatedField]: changeInfo.value}
        const newTasks = changeInfo.group.tasks.map(task=>
            (task.id===newTask.id)?newTask:task)
        const newGroup = {...changeInfo.group, tasks: newTasks}
        newGroups = groups.map(group=>
            (group.id===newGroup.id)?newGroup:group)
        
        // replace previous groups with the new one
        setGroups(newGroups)
    }



    const cmpOrder = [

        "taskTitle",
        "priority",
        "status",

        "members",
        "date",
    ];

    const uid = () => Math.random().toString(36).slice(2);
    const labels = ["item", "priority", "status", "members", "date"];

    const progress = [null, "priority", "status", null, "date"];

    const handleCheckBoxClick = (taskId) => {
        setCheckedBoxes((prev) => {
          if (prev.includes(taskId)) {
            return prev.filter((id) => id !== taskId);
          } else {
            return [...prev, taskId];
          }
        });
      };

      const handleMasterCheckboxClick = (group) => {
        setCheckedGroups(prev => {
            if(prev.includes(group.id)){
                setCheckedBoxes([]);
                return prev.filter((id) => id !== group.id)
            }else{
                setCheckedBoxes(group.tasks.map((task) => task.id));
                return [...prev, group.id]
            }
        })
      };

    return (
        <section className="group-list">
            {groups.map((group) => (
                <GroupPreview
                    group={group}
                    labels={labels}
                    cmpOrder={cmpOrder}
                    progress={progress}
                    key={uid()}
                    usersInBoard={usersInBoard}
                    onTaskUpdate={onTaskUpdate}
                    checkedBoxes={checkedBoxes}
                    checkedGroups={checkedGroups}
                    handleMasterCheckboxClick={handleMasterCheckboxClick}
                    handleCheckBoxClick={handleCheckBoxClick}
                />
            ))}
            {checkedBoxes.length > 0 && <SelectedTasksModal data={checkedBoxes} />}
        </section>
    )
}

export default BoardDetails;
