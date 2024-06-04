import { DateTime } from "luxon";
import { createContext, useState } from "react";

type ctxType = {
    date: DateTime,
    setDate: (newDate:DateTime)=>void
}

export const DateContext = createContext<ctxType>({date: DateTime.now(), setDate: ()=>{}});

export const DateContextProvider = ({children}:{children?: React.ReactNode}) =>{
    const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now().startOf("day"));

    const setHandler = (date: DateTime) =>{
        setSelectedDate(date);
    }

    const ctx:ctxType = {
        date: selectedDate,
        setDate: setHandler
    }

    return(
        <DateContext.Provider value={ctx}>
            {children}
        </DateContext.Provider>
    )
}