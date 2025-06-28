import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { addMonths, subMonths } from "date-fns";
import "react-day-picker/dist/style.css"; // Ensure DayPicker styles are imported

export function CustomCalendar(props) {
  const [month, setMonth] = useState(new Date());

  const handlePrevious = () => {
    setMonth(subMonths(month, 1));
  };

  const handleNext = () => {
    setMonth(addMonths(month, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-4">
        <button onClick={handlePrevious}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-medium text-sm">
          {month.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
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
