import {DateContextProvider} from "./context/date-context";
import { StateContextProvider } from "./context/state-context";
import { EventContextProvider } from "./context/event-context";

import classes from "./App.module.css";

import Calendar from "./calendar/Calendar"
import InputForm from "./inputform/InputForm";
import EventList from "./eventcards/EventList";
import ViewToggles from "./ViewToggles";
function App() {

  return (
    <EventContextProvider>
      <StateContextProvider>
        <DateContextProvider>
          <div className={classes.fullscreen}>
            <ViewToggles />
            <Calendar />
            <InputForm />
            <EventList />
          </div>
        </DateContextProvider>
      </StateContextProvider>
    </EventContextProvider>
  )
}

export default App
