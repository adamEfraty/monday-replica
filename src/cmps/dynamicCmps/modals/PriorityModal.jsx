import { getSvg } from "../../../services/svg.service.jsx"

export function PriorityModal({onPriorityChange}){

    //temporary priorities selection
    const priorities = [{text:'Low', color:'#86B6FB'},{text:'Medium', color:'#5559DF'},
        {text:'High', color:'#401694'},{text:'Critical ⚠️', color:'#333333'}]


    return (
        <section className="priority-modal">

            <div className="white-arrow">{getSvg('white-arrow')}</div>
            {/* list of quick access prioritise */}
            <ul>
                {
                    priorities.map(priority =>
                        <li key={priority.text}
                            onClick={()=>onPriorityChange(priority)}
                            style={{backgroundColor: priority.color}}>
                            {priority.text}
                        </li>
                    )
                }
            </ul>
        </section>
    )
}