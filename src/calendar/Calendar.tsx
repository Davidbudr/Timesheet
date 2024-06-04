import { useContext } from "react";
import { StateContext } from "../context/state-context";
import classes from "./Calendar.module.css";
import { DateTime } from "luxon";

import DayCard from "./DayCard";
import { DateContext } from "../context/date-context";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar() {
  const { viewState } = useContext(StateContext);

  const { date, setDate } = useContext(DateContext);
  const today: DateTime = DateTime.now().startOf("day");
  const month: DateTime[] = [];

  const setDateHandler = (day: DateTime) => {
    setDate(day);
  };

  for (let i = 0; i < date.daysInMonth!; i++) {
    const day = DateTime.local(date.year, date.month, i + 1);
    month.push(day);
  }

  const changeDateHandler = ({
    timeframe,
    period = "days",
  }: {
    timeframe: number;
    period?: string;
  }) => {
    const newDate = date.plus({ [period]: timeframe });
    setDate(newDate);
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <div className={classes.selector}>
          <button
            onClick={() => changeDateHandler({ timeframe: -1 })}
            className="action"
          >
            Prev
          </button>
          <h2 className={classes.dayTitle}>
            {date.equals(today)
              ? <>{"Today"}<br/><b className={classes.tinyText}>( {date.setLocale("en-gb").toLocaleString(DateTime.DATE_FULL)} )</b></>
              : date.setLocale("en-gb").toLocaleString(DateTime.DATE_FULL)}
          </h2>
          <button
            onClick={() => changeDateHandler({ timeframe: 1 })}
            className="action"
          >
            Next
          </button>
        </div>
      </header>
      {viewState.viewingCalendar && (
        <section className={classes.calendar}>
          <div className={classes.selector}>
            <button
              onClick={() =>
                changeDateHandler({ timeframe: -1, period: "months" })
              }
              className={classes.action}
            >
              Prev
            </button>
            <h2>{date.toLocaleString({ month: "long", year: "2-digit" })}</h2>
            <button
              onClick={() =>
                changeDateHandler({ timeframe: 1, period: "months" })
              }
              className="action"
            >
              Next
            </button>
          </div>
          <article className={classes.grided}>
            {WEEKDAYS.map((day, index) => (
              <DayCard key={day} column={index + 1}>
                {day}
              </DayCard>
            ))}
          </article>
          <article className={classes.grided}>
            {month.map((day, indx) => (
              <DayCard
                key={day.toISODate()}
                clickHandler={() => setDateHandler(day)}
                column={day.weekday}
                active={day.equals(date)}
              >
                {indx + 1}
              </DayCard>
            ))}
          </article>
        </section>
      )}
    </div>
  );
}
