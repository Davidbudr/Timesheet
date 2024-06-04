// import TrashIcon from "../assets/trash3.svg";
// import EditIcon from "../assets/pencil.svg";
// import SaveIcon from "../assets/floppy-fill.svg";

const TrashIcon = "./trash3.svg";
const EditIcon = "./pencil.svg";
const SaveIcon = "./floppy-fill.svg";

import { DateTime } from "luxon";
import classes from "./EventCard.module.css";
import { FormEvent, useContext, useRef, useState } from "react";
import { EventContext } from "../context/event-context";
import { DateContext } from "../context/date-context";


type proptype = {
    id?: string,
    title: string,
    details: string,
    start: DateTime,
    end?: DateTime | null,
    calc: boolean
};

export default function EventCard(props: proptype){
    const formRef = useRef<HTMLFormElement>(null);
    const checkedRef = useRef<HTMLInputElement>(null);
    const {removeEvent, updateEvent} = useContext(EventContext);
    const {date} = useContext(DateContext);
    const [editing, setEditing] = useState(false);

    const difference = props.end? props.end.diff(props.start, ["hours","minutes"]): null;

    const deleteHandler = () =>{
        const confirm = window.confirm('Are you sure you want to delete this task?');
        if (confirm){
            removeEvent(props.id!);
        }
    }

    const editHandler = () =>{
        setEditing(c=>!c);
    }

    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEditing(c=>!c);
        const convert_to_datetime = (time:string | undefined, date: string ) =>{
            if (!time){ return null;}

            const startDate = DateTime.fromFormat(date, "yyyy-MM-dd");
            const added_time = DateTime.fromFormat(time,"HH:mm")
            const newDate = startDate.plus({hours: added_time.hour, minutes: added_time.minute});
            return newDate;
        }
        const data = Object.fromEntries(new FormData(formRef.current!));
        const parsed: typeof props = {
            id: props.id,
            title: data.title.toString(),
            details: data.details.toString(),
            start: convert_to_datetime(data.start.toString(),data.date.toString())!,
            end: convert_to_datetime(data.end.toString(),data.date.toString()),
            calc: checkedRef.current!.checked
        }

        updateEvent(parsed);

    }

    if (editing){
        return (
            <form ref={formRef} onSubmit={submitHandler} className={classes.card}>
                <div className={classes.actionGroup}>
                    <button type="button" onClick={deleteHandler} className={classes.action}>
                        <i className={classes.actionIcon} style={{maskImage:`url('${TrashIcon}')`}}></i>
                    </button>
                    <input name="title" defaultValue={props.title} className={classes.editInput} />        
                    <button className={classes.action}>
                        <i className={classes.actionIcon} style={{maskImage:`url('${SaveIcon}')`}}></i>
                    </button>
                </div>
                <div className={classes.editGroup}>
                    <label htmlFor="start">Start Time</label>
                    <input type="time" name="start" defaultValue={props.start.toFormat("HH:mm")} className={classes.editInput} />
                    <label htmlFor="start">End Time</label>
                    <input type="time" name="end" defaultValue={props.end?.toFormat("HH:mm") || ""} className={classes.editInput} />
                </div>
                <div className={classes.editGroup}>
                    <label htmlFor="details">Task Details</label>
                    <textarea name="details" defaultValue={props.details} className={classes.editInput} />
                </div>
                <div className={classes.editGroup}>
                    <label htmlFor="details">Task Date</label>
                    <input name="date" type="date" defaultValue={date.toFormat("yyyy-MM-dd")} className={classes.editInput}/>
                </div>
                <div>
                    <label htmlFor="calc">Calculate Time</label>
                    <input ref={checkedRef} type="checkbox" name="calc" defaultChecked={props.calc} className={classes.editInput} />
                </div>


            </form>
        )
    }

    return (
      <div className={classes.card}>
        <div className={classes.actionGroup}>
            <button onClick={deleteHandler} className={classes.action}>
                <i className={classes.actionIcon} style={{maskImage:`url('${TrashIcon}')`}}></i>
            </button>
            <h2 className={classes.title}>{props.title}</h2>
            <button onClick={editHandler} className={classes.action}>
                <i className={classes.actionIcon} style={{maskImage:`url('${EditIcon}')`}}></i>
            </button>
        </div>
        <p>
        {props.start.toFormat("HH:mm")} - {props.end ? props.end!.toFormat("HH:mm") : "-"}{" "}
        {props.end && (
            <b className={props.title}>
            ({difference?.hours} Hours {difference?.minutes} minutes)
            </b>
        )}
        </p>
        <p>{props.details}</p>
      </div>
    );
}