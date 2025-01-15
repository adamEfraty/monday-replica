import React, { useState, useEffect } from 'react'

import { convertDateToString } from '../../../services/util.service.js';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

export function DateModal({currentDate, onDateChange }) {

    // the currant day on date cell that convert to dayjs style that DateCalendar supports
    const [newJday,setNewJday] = useState(dayjs(currentDate, 'DD-MM-YYYY'))

    console.log('newJday',newJday)

    // fixing some library problem with DD-MM form...
    useEffect(()=>{
        setNewJday(dayjs(currentDate, 'DD-MM-YYYY'))
    },[currentDate])

    const handleDateChange = newDate => {
        // Format the date to MM-DD-YYYY
        console.log(newDate)
        const formattedDate = newDate.format('DD-MM-YYYY')
        onDateChange(formattedDate)
    }

    return (
        <section className="date-modal">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar 
                value={newJday}
                onChange={handleDateChange}/>
            </LocalizationProvider>
        </section>
    )
}


