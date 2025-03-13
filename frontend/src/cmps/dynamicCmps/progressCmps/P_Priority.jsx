

export function P_Priority({tasks, labelId}){

    const colorOrder = ['#5559DF', '#579BFC', '#333333', '#401694', '#C4C4C4']
    const priorities = tasks.map(task=>{
        const priorityCell = task.cells.find(cell=> cell.labelId === labelId)
        return priorityCell.value})
    const progressSummery = orderByColor(colorOrder, mergeByColor(priorities))

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
                        width: `${((unit.number/priorities.length)*100)}%`}}/>
                })
            }
        </div>
    )
}