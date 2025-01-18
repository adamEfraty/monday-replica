import { utilService } from "../../../services/util.service.js"

export function P_Date({tasks}){

    const dates = tasks.map(task=> utilService.formatStrToDate(task.date))
    const {firstDate, lastDate} = getFirstAndLastDate(dates)
    const finalStr = betweenDatesStr(firstDate, lastDate)
    const progressPrecentage = precentageOfToday(firstDate, lastDate)

    function getFirstAndLastDate(dates) {
        if (dates.length === 0) return {firstDate: null, lastDate: null}
        const sortedDates = dates.sort((a, b) => a - b)
    
        return {
            firstDate: sortedDates[0],
            lastDate: sortedDates[sortedDates.length - 1]
        }
    }

    function betweenDatesStr(firstDate, lastDate){

        if(!firstDate || !lastDate) return '-'

        const firstDateObj = utilService.formatDateToPerfectStr(firstDate)
        const lastDateObj = utilService.formatDateToPerfectStr(lastDate)



        if (firstDateObj.year !== lastDateObj.year)
            return `${firstDateObj.day} ${firstDateObj.month}, '${firstDateObj.year.slice(2,4)} - ${lastDateObj.day} ${lastDateObj.month}, '${lastDateObj.year.slice(2,4)}`
        
        else if(firstDateObj.month !== lastDateObj.month)
            return `${firstDateObj.day} ${firstDateObj.month} - ${lastDateObj.day} ${lastDateObj.month}`
        
        else if(firstDateObj.day !== lastDateObj.day) 
            return `${firstDateObj.day} - ${lastDateObj.day} ${firstDateObj.month}`

        else return `${firstDateObj.day} ${firstDateObj.month}`
    }

    function precentageOfToday(firstDate, lastDate){
        const today  = new Date()
        if(!firstDate || !lastDate) return 0
        else if (today < firstDate) return 0
        else if (today > lastDate) return 100
        else return Math.round(((today-firstDate)/(lastDate-firstDate))*100)
    }   

    return(
        <section className="progress-date">
            <div className="total-bar">
                <div className="progress-bar"
                style={{backgroundColor: '#579BFC', width: `${progressPrecentage}%`}}/>
            </div>
            <p>{finalStr}</p>



        </section>
        
    )
}