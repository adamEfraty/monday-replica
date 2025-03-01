import React, { useState, useEffect } from 'react'
import { getSvg } from "../../../services/svg.service.jsx"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

export function DateModal({ currentDate, onDateChange, labelWidth }) {

    const [newJday, setNewJday] = useState(dayjs(currentDate, 'DD-MM-YYYY'))

    useEffect(() => {
        setNewJday(dayjs(currentDate, 'DD-MM-YYYY'))
    }, [currentDate])

    const handleDateChange = newDate => {
        const formattedDate = newDate.format('DD-MM-YYYY')
        onDateChange(formattedDate)
    }

    return (
        <section className="date-modal"
        style={{"--cell-width": `${labelWidth}px`}}>
            <div className="white-arrow">{getSvg('white-arrow')}</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    value={newJday}
                    onChange={handleDateChange} />
            </LocalizationProvider>
        </section>
    )
}


