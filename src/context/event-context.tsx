import { DateTime } from "luxon";
import { createContext, useReducer } from "react";

type eventType = { 
    id?: string,
    title: string,
    details: string,
    start: DateTime,
    end?: DateTime | null,
    calc: boolean,
}

type ctxType = {
    events: eventType[],
    addEvent: (event:eventType)=>void,
    updateEvent: (event:eventType)=>void,
    replaceEvents: (events:eventType[])=>void,
    removeEvent: (id:string)=>void,
}

export const EventContext = createContext<ctxType>({
    events: [],
    addEvent: ()=>{},
    updateEvent: ()=>{},
    replaceEvents: ()=>{},
    removeEvent: ()=>{},
});

function reducerFn(
  state: { events: eventType[] },
  action:
    | { type: "ADD" | "UPDATE"; payload: eventType }
    | { type: "REMOVE"; payload: string }
    | { type: "REPLACE"; payload: eventType[] }
    | undefined
):{events:eventType[]} {
  let newState = { events: [...state.events] };
  switch (action?.type) {
    case "ADD":
      newState.events.push({
        end: null,
        ...action.payload,
        id: crypto.randomUUID().toString(),
      });
      break;
    case "UPDATE":
      const removed = [...state.events].filter(
        (e) => e.id !== action.payload.id
      );
      removed.push({ ...action.payload });
      newState.events = removed;
      break;
    case "REMOVE":
      const filtered = state.events.filter((e) => e.id !== action.payload);
      newState.events = filtered;
      break;
    case "REPLACE":
      newState = {events:[...action.payload]};
      break;
    default:
      break;
  }

  newState.events = newState.events
  .sort(
    (a: eventType, b: eventType) =>
      a.start.diff(b.start).toObject().milliseconds!
  )
  .map((event, indx) => {
    const calculating = event.calc;
    if (calculating && indx === newState.events.length - 1) {
      event.end = null;
    }
    if (!calculating || indx === newState.events.length - 1) return event;
    event.end = newState.events[indx + 1].start;

    return event;
  });


  return newState;
}

export const EventContextProvider = ({children}:{children?: React.ReactNode}) =>{
    const [eventState, dispatchView] = useReducer(reducerFn, {events:[]});

    const addEvent = (event:eventType) =>{
        dispatchView({type:"ADD", payload: event});
    }

    const removeEvent = (id:string) =>{
        dispatchView({type:"REMOVE", payload: id});
    }

    const updateEvent = (event:eventType) =>{
        dispatchView({type:"UPDATE", payload: event});
    }
    const replaceEvents = (events: eventType[])=>{
        dispatchView({type:"REPLACE", payload: events});
    }

    const ctx:ctxType = {
        events:eventState.events,
        addEvent,
        updateEvent,
        removeEvent,
        replaceEvents
    }

    return(
        <EventContext.Provider value={ctx}>
            {children}
        </EventContext.Provider>
    )
}