import { StateContext } from "./context/state-context";
import { useContext } from "react";
import classes from "./ViewToggles.module.css";

export default function ViewToggles(){
    const {viewState, toggleCalendar, toggleAdding} = useContext(StateContext);
    return (
        <div className={classes.toggleGroup}>
          <button className="action" onClick={()=>toggleCalendar()}>{viewState.viewingCalendar?"hide Calendar":"view Calendar"}</button>
          <button className="action" onClick={()=>toggleAdding()}>{viewState.addingItem? "Cancel": "Add Item"}</button>
        </div>
    )
}