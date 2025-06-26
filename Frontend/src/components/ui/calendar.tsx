import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { addMonths, subMonths } from "date-fns";

export function CustomCalendar({ ...props }) {
  const [month, setMonth] = React.useState(new Date());

  function handlePrevious() {
    setMonth(subMonths(month, 1));
  }

  function handleNext() {
    setMonth(addMonths(month, 1));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-4">
        <button onClick={handlePrevious}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-medium text-sm">
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button onClick={handleNext}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays
        {...props}
      />
    </div>
  );
}
