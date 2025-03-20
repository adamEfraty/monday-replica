import { useState } from "react"
import { getSvg } from '../../../services/svg.service.jsx'

export function P_Status({tasks, labelId}){

    const colorOrder = ['#00C875', '#FDAB3D', '#DF2F4A', '#C4C4C4']
    const statuses = tasks.map(task=>{
        const statuseCell = task.cells.find(cell=> cell.labelId === labelId)
        return statuseCell.value})
    const progressSummery = orderByColor(colorOrder, mergeByColor(statuses))
    
    const [modalColor, setModalColor] = useState(null)


    function mergeByColor(arr) {
        const result = []

        for (const status of arr) {
          const existing = result.find(obj =>
            obj.color === status.color)
      
          if (existing) existing.number++ 
          else result.push({ ...status, number: 1 })
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
        <div className="progress-status">
            {
                progressSummery.map(unit=>{
                    return <div key={unit.color}
                    className="color-block"
                    style={{background: unit.color, 
                        width: `${((unit.number/statuses.length)*100)}%`,
                    }}
                    

                    onMouseEnter={()=>setModalColor(unit.color)}
                    onMouseLeave={()=>setModalColor(null)}>

                        {
                            unit.color === modalColor &&
                            <div className="color-block-modal" style={{"--width": (unit.text === '') ? '100px' : ((unit.text === 'Working on it') ? '180px' : '')}}>
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