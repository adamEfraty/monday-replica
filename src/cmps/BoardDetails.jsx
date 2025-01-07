import "../styles/_Board-Details.scss";
import GroupPreview from "./GroupPreview";
const BoardDetails = () => {
    const imageLinks = [
        "https://images.pexels.com/photos/30061809/pexels-photo-30061809/free-photo-of-fashionable-woman-posing-with-colorful-headscarf.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/30007901/pexels-photo-30007901/free-photo-of-thoughtful-man-in-grey-coat-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/28773362/pexels-photo-28773362/free-photo-of-dynamic-black-and-white-portrait-of-young-man-on-phone.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/30071289/pexels-photo-30071289/free-photo-of-portrait-of-a-bearded-man-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];



    const groups = [
        {
            id: Math.random().toString(36).slice(2),
            title: 'SAR',
            color: "red",
            tasks: [
                {
                    id: "t101",
                    side: "null",
                    taskTitle: "learn CSS",
                    members: [

                        { name: "bal", color: "black", image: imageLinks[2] },
                        { name: "shal", color: "green", image: imageLinks[1] },
                    ],
                    date: "27-02-2022",
                    status: "IN PROGRESS",
                    priority: "LOW",
                },
                {
                    id: "t102",
                    side: "null",
                    taskTitle: "learn Vue.js",
                    members: [
                        { name: "tal", color: "red", image: imageLinks[0] },
                        { name: "bal", color: "black", image: imageLinks[1] },
                        { name: "shal", color: "green", image: imageLinks[2] },
                    ],
                    date: "28-02-2022",
                    status: "STUCK",
                    priority: "HIGH",
                },
                {
                    id: "t103",
                    side: "null",
                    taskTitle: "learn JavaScript",
                    members: [
                        { name: "tal", color: "red", image: imageLinks[1] },
                        { name: "bal", color: "black", image: imageLinks[1] },
                        { name: "shal", color: "green", image: imageLinks[3] },
                    ],
                    date: "01-03-2022",
                    status: "DONE",
                    priority: "LOW",
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
                    members: [
                        { name: "yal", color: "blue", image: imageLinks[3] },
                        { name: "bal", color: "black", image: imageLinks[1] },
                        { name: "shal", color: "green", image: imageLinks[2] },
                        { name: "shal", color: "green", image: imageLinks[0] },
                    ],
                    date: "03-03-2022",
                    status: "IN PROGRESS",
                    priority: "HIGH",
                },
                {
                    id: "t202",
                    side: "null",
                    taskTitle: "debug front-end code",
                    members: [
                        { name: "yal", color: "blue", image: imageLinks[3] },
                        { name: "shal", color: "green", image: imageLinks[2] },
                    ],
                    date: "05-03-2022",
                    status: "STUCK",
                    priority: "LOW",
                },
                {
                    id: "t203",
                    side: "null",
                    taskTitle: "deploy application",
                    members: [
                        { name: "yal", color: "blue", image: imageLinks[3] },
                        { name: "bal", color: "black", image: imageLinks[1] },
                    ],
                    date: "06-03-2022",
                    status: "DONE",
                    priority: "HIGH",
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
                    members: [
                        { name: "kal", color: "green", image: imageLinks[0] },
                        { name: "yal", color: "blue", image: imageLinks[3] },
                    ],
                    date: "07-03-2022",
                    status: "IN PROGRESS",
                    priority: "HIGH",
                },
                {
                    id: "t302",
                    side: "null",
                    taskTitle: "optimize queries",
                    members: [
                        { name: "kal", color: "green", image: imageLinks[0] },
                        { name: "bal", color: "black", image: imageLinks[1] },
                    ],
                    date: "08-03-2022",
                    status: "DONE",
                    priority: "LOW",
                },
            ],
        },
    ];



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

    return (
        <section className="group-list">
            {groups.map((group) => (
                <GroupPreview
                    group={group}
                    labels={labels}
                    cmpOrder={cmpOrder}
                    progress={progress}
                    key={uid()}
                />
            ))}
        </section>
    );
};

export default BoardDetails;
