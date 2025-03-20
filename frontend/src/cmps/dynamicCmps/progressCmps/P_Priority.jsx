import { useState } from "react"
import { getSvg } from '../../../services/svg.service.jsx'

export function P_Priority({tasks, labelId}){

    const colorOrder = ['#5559DF', '#579BFC', '#333333', '#401694', '#C4C4C4']
    const priorities = tasks.map(task=>{
        const priorityCell = task.cells.find(cell=> cell.labelId === labelId)
        return priorityCell.value})
    const progressSummery = orderByColor(colorOrder, mergeByColor(priorities))
    
    const [modalColor, setModalColor] = useState(null)


    function mergeByColor(arr) {
        const result = []

        for (const priority of arr) {
          const existing = result.find(obj =>
            obj.color === priority.color)
      
          if (existing) existing.number++ 
          else result.push({ ...priority, number: 1 })
        }
      
        return result
    }

    function orderByColor(colorOrder, arr){
        const result = []
        for (const color of colorOrder){
            const colorExist = arr.some(obj=> obj.color === color)

            if (colorExist){
                const object = arr.find(obj=>obj.color===color)
                result.push(object)
            }
        }
        return result   
    }

    return(
        <div className="progress-priority">
            {
                progressSummery.map(unit=>{
                    return <div key={unit.color}
                    className="color-block"
                    style={{background: unit.color, 
                        width: `${((unit.number/priorities.length)*100)}%`,
                    }}
                    

                    onMouseEnter={()=>setModalColor(unit.color)}
                    onMouseLeave={()=>setModalColor(null)}>

                        {
                            unit.color === modalColor &&
                            <div className="color-block-modal" style={{"--width": (unit.text === '') ? '100px' : ''}}>
                                <div className="modal-context">
                                    <span>{`${(unit.text !== '') ? (unit.text + ':') : ''} ${unit.number}/${tasks.length}`}</span>
                                    <span>{`${Math.round((unit.number/tasks.length)*100)}%`}</span>
                                    {getSvg('black-arrow')}
                                </div>
                            </div>
                        }
                    </div>
                })
            }
        </div>
    )
}