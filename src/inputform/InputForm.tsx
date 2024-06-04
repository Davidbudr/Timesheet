import { useContext, useRef, useState } from "react";
import { StateContext } from "../context/state-context";
import { EventContext } from "../context/event-context";
import { DateContext } from "../context/date-context";
import classes from "./InputForm.module.css";

import Input from "./Input"
import { DateTime } from "luxon";

export default function InputForm(){
    const userForm = useRef<HTMLFormElement>(null);
    const [calcVal, setCalcVal] = useState<boolean>(true);

    const {viewState, toggleAdding} = useContext(StateContext);
    const {addEvent} = useContext(EventContext);
    const {date } = useContext(DateContext);


    if (!viewState.addingItem){
        return null;
    }

    const changeCalcHandler = (event: (React.ChangeEvent<HTMLInputElement>)) =>{
        setCalcVal(event.target!.checked);
    }

    const submitHandler = (event: React.FormEvent) =>{
        event.preventDefault();
        const {
            title,
            details,
            start,
            end,
        } = Object.fromEntries(new FormData(userForm.current!));
        
        if(start.toString() === "" || !start) return;

        const convert_to_datetime = (time:string | undefined) =>{
            if (!time){ return null;}

            const added_time = DateTime.fromFormat(time,"HH:mm")
            const newDate = date.plus({hours: added_time.hour, minutes: added_time.minute});
            return newDate;
        }
        
        addEvent({
            title:title.toString(),
            details: details.toString(),
            start: convert_to_datetime(start.toString())!,
            end: convert_to_datetime(end?.toString()),
            calc: calcVal
        })

        userForm.current!.reset();
        toggleAdding();

    }

    return (
        <form ref={userForm} className={classes.form} onSubmit={submitHandler}>
            
            <Input title="Task Name" name="title"/>
            <Input title="Task Details" name="details" inputType="textarea"/>

            <div className={classes.group}>
                <Input title="Start Time" name="start" inputType="time"/>
                {
                    !calcVal && <Input title="End Time" name="end" inputType="time"/>
                }
            </div>

            <div className={classes.group}>
                <label className={classes.option}>Calculate End Time</label>
                <input onChange={changeCalcHandler} defaultChecked={calcVal || false} className={classes.userinput} type="checkbox"/>
            </div>

            <div className={classes.actionlist}>
                <button className={classes.action}>Save</button>
            </div>
        </form>
    )
}