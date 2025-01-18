

export function P_Status({tasks}){

    const colorOrder = ['#00C875', '#FDAB3D', '#DF2F4A', '#C4C4C4']
    const statuses = tasks.map(task=>task.status)
    const progressSummery = orderByColor(colorOrder, mergeByColor(statuses))

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
                        width: `${((unit.number/statuses.length)*100)}%`}}/>
                })
            }
        </div>
    )
}