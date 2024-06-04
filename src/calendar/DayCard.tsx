import React from "react";
import classes from "./DayCard.module.css";

type props = {
    children: React.ReactNode,
    column?: number,
    active?: boolean,
    clickHandler?: ()=>void
}
export default function DayCard({children, column, active, clickHandler}:props){
    return (
        <div onClick={clickHandler} style={{gridColumn:column}} className={`${classes.card} ${clickHandler?classes.interactive:''} ${active? classes.active:''}`}>
            {children}
        </div>
    )
}