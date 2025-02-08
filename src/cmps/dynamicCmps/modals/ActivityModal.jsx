import { useEffect } from "react"
import { useSelector } from "react-redux"

export function ActivityModal(){
    const activitiesArr = useSelector((state) => state.boardModule.activities)
    const boards = useSelector((state) => state.boardModule.boards)
    useEffect(() => {
        console.log('activitiesArr:', activitiesArr)
    }, [activitiesArr])
    return (
        <ul>
            {activities.map((activity) => (
                <section>
                    <h1>{activity.title}</h1>
                    <h2>{activity.address}</h2>
                    <hr />
                    <div>
                        <p>{activity.des}</p>
                    </div>
                </section>
            ))}
        </ul>
    )
}