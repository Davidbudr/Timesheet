import { createContext, useReducer } from "react";

type statetype = { 
    addingItem:boolean,
    viewingCalendar:boolean
}

type ctxType = {
    viewState: statetype,
    toggleAdding: ()=>void,
    toggleCalendar: ()=>void
}

export const StateContext = createContext<ctxType>({
    viewState: {
        addingItem:false,
        viewingCalendar:false
    },
    toggleAdding: ()=>{},
    toggleCalendar: ()=>{}
});

function setState(state:statetype,action:string):statetype{
    let newState = {...state};
    switch (action){
        case "TOGGLE_ADDING":
            newState.addingItem = !state.addingItem;
            newState.viewingCalendar = false;
            return newState;
        case "TOGGLE_CALENDAR":
            newState.viewingCalendar = !state.viewingCalendar;
            newState.addingItem = false;
            return newState;
        default:
            break;
    }

    return newState;
}

export const StateContextProvider = ({children}:{children?: React.ReactNode}) =>{
    const [viewState, dispatchView] = useReducer(setState, {addingItem: false,viewingCalendar:false});

    const toggleAdding = () =>{
        dispatchView("TOGGLE_ADDING");
    }

    const toggleCalendar = () =>{
        dispatchView("TOGGLE_CALENDAR");
    }

    const ctx:ctxType = {
        viewState,
        toggleAdding,
        toggleCalendar
    }

    return(
        <StateContext.Provider value={ctx}>
            {children}
        </StateContext.Provider>
    )
}