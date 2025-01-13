import "../styles/_Board-Details.scss";
import GroupPreview from "./GroupPreview";
import { useState } from 'react'
import { SelectedTasksModal } from "./dynamicCmps/modals/SelectedTasksModal";
const BoardDetails = () => {
    const [checkedBoxes, setCheckedBoxes] = useState([])
    const [checkedGroups, setCheckedGroups] = useState([])
    const imageLinks = [
        "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    const usersInBoard = [{id: 'userid0', name: "tal", color: "red", image: imageLinks[0]},
        {id: 'userid1', name: "shal", color: "green", image: imageLinks[1] },
        {id: 'userid2', name: "bal", color: "black", image: imageLinks[2] },
        {id: 'userid3', name: "shal", color: "green", image: imageLinks[3] }]

    const [groups, setGroups] = useState(
        [
            {
                id: Math.random().toString(36).slice(2),
                title: 'SAR',
                color: "red",
                tasks: [
                    {
                        id: "t101",
                        side: "null",
                        taskTitle: "learn CSS",
                        members: [usersInBoard[1],usersInBoard[2]],
                        date: "27-02-2022",
                        status: {text:'Working on it', color:'#FDAB3D'},
                        priority: {text:'Low', color:'#86B6FB'},
                        chat: [{userId: 'userid0', 
                            sentAt: new Date(), 
                            text: 'comment comment comment...', 
                            replys:[{userId: 'userid1', 
                                sentAt: new Date(), 
                                text:'reply reply reply...'}]
                        }]
                    },
                    {
                        id: "t102",
                        side: "null",
                        taskTitle: "learn Vue.js",
                        members: [usersInBoard[0],usersInBoard[1],usersInBoard[2]],
                        date: "28-02-2022",
                        status: {text:'Stuck', color:'#DF2F4A'},
                        priority: {text:'Medium', color:'#5559DF'},
                        chat:[],
                    },
                    {
                        id: "t103",
                        side: "null",
                        taskTitle: "learn JavaScript",
                        members: [usersInBoard[1],usersInBoard[2],usersInBoard[3]],
                        date: "01-03-2022",
                        status: {text:'Done', color:'#00C875'},
                        priority: {text:'Medium', color:'#5559DF'},
                        chat:[],
                    },
                ],
            },
            {
                id: Math.random().toString(36).slice(2),
                title: 'SAR-2',
    
                color: "blue",
                tasks: [
                    {
                        id: "t201",
                        side: "null",
                        taskTitle: "write API documentation",
                        members: [usersInBoard[0],usersInBoard[1],usersInBoard[2],usersInBoard[3]],
                        date: "03-03-2022",
                        status: {text:'Working on it', color:'#FDAB3D'},
                        priority: {text:'Critical ⚠️', color:'#333333'},
                        chat:[],
                    },
                    {
                        id: "t202",
                        side: "null",
                        taskTitle: "debug front-end code",
                        members: [usersInBoard[2],usersInBoard[3]],
                        date: "05-03-2022",
                        status: {text:'Stuck', color:'#DF2F4A'},
                        priority: {text:'Low', color:'#86B6FB'},
                        chat:[],
                    },
                    {
                        id: "t203",
                        side: "null",
                        taskTitle: "deploy application",
                        members: [usersInBoard[1],usersInBoard[3]],
                        date: "06-03-2022",
                        status: {text:'Done', color:'#00C875'},
                        priority: {text:'High', color:'#401694'},
                        chat:[],
                    },
                ],
            },
            {
                id: Math.random().toString(36).slice(2),
                title: 'SAR-3',
    
                color: "green",
                tasks: [
                    {
                        id: "t301",
                        side: "null",
                        taskTitle: "set up database schema",
                        members: [usersInBoard[0],usersInBoard[3]],
                        date: "07-03-2022",
                        status: {text:'Not Started', color:'#C4C4C4'},
                        priority: {text:'High', color:'#401694'},
                        chat:[],
                    },
                    {
                        id: "t302",
                        side: "null",
                        taskTitle: "optimize queries",
                        members: [usersInBoard[0],usersInBoard[1]],
                        date: "08-03-2022",
                        status: {text:'Working on it', color:'#FDAB3D'},
                        priority: {text:'Low', color:'#86B6FB'},
                        chat:[],
                    },
                ],
            },
        ]
    )

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
