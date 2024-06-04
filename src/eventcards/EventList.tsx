import { useContext, useEffect, useRef, useState } from "react"
import classes from "./EventList.module.css";

import { EventContext } from "../context/event-context";
import EventCard from "./EventCard";
import { DateContext } from "../context/date-context";
import { DateTime } from "luxon";

export default function EventList(){
    const firstRun = useRef<boolean>();
    const {events, replaceEvents} = useContext(EventContext);
    const {date} = useContext(DateContext);
    const [filteredEvents, setFilteredEvents] = useState<(typeof events)>([])

    useEffect(()=>{
        const filtered = events.filter(e=>e.start.hasSame(date,"day"));
        setFilteredEvents(filtered);
        if (firstRun.current){
            localStorage.setItem("data", JSON.stringify(events));
        }
        else{
            firstRun.current = true;
            const data = JSON.parse(localStorage.getItem("data") || "[]");
            const objfromdata = data.map((d:{id:string, title:string, details:string, start:string, end?:string, calc?:string})=>{
                return {
                    id: d.id,
                    title: d.title,
                    details: d.details,
                    start: DateTime.fromISO(d.start),
                    end: d.end?DateTime.fromISO(d.end):undefined,
                    calc: d.calc
                }
            });

            replaceEvents(objfromdata);
        }
    },[events,date]);

    if (filteredEvents.length === 0) {
        return (
            <div className={classes.group}>
                <p>Nothing here yet...</p>
            </div>
        );
    }

    return (
        <div className={classes.group}>
            {filteredEvents.map(e=><EventCard key={e.id} {...e}/>)}        
        </div>
    )
}