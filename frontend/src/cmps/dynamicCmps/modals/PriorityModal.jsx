import { getSvg } from "../../../services/svg.service.jsx"

export function PriorityModal({onPriorityChange, labelWidth}){

    //temporary priorities selection
    const priorities = [         
        {text:'Critical ⚠️', color:'#333333'}, 
        {text:'High', color:'#401694'}, 
        {text:'Medium', color:'#5559DF'}, 
        {text:'Low', color:'#579BFC'}, 
        { text: '', color: '#C4C4C4' }
    ]


    return (
        <section className="priority-modal"
        style={{"--cell-width": `${labelWidth}px`}}>

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