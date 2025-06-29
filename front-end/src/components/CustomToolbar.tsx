import { ToolbarProps } from "react-big-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { useState } from "react";
import { CustomEvent } from "@/types/schedule";
import { ModeToggle } from "@/components/ModeToggle"; // adjust path as needed

export default function CustomToolbar({
  label,
  date,
  onNavigate,
  onView,
  view,
  views,
}: ToolbarProps<CustomEvent, object>) {
  const [selectedDate, setSelectedDate] = useState(format(date, "yyyy-MM-dd"));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(e.target.value);
      onNavigate("DATE", newDate);
    }
  };

  const formatLabel = () => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return `${format(start, "MMMM dd")} to ${format(end, "MMMM dd")}`;
  };

  const viewNames = Array.isArray(views)
    ? views
    : Object.keys(views).filter((v) => (views as Record<string, any>)[v]);

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded shadow-sm mb-2">
      {/* Date Picker */}
      <div>
        <Input
          type="date"
          className="rounded border px-3 py-2 bg-white dark:bg-zinc-800 text-black dark:text-white"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("PREV")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="px-4 py-2 bg-blue-900 text-white rounded font-medium dark:bg-blue-600">
          {formatLabel()}
        </div>
        <Button variant="ghost" size="icon" onClick={() => onNavigate("NEXT")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-2">
        {viewNames.map((v) => (
          <Button
            key={v}
            variant={view === v ? "blue" : "outline"}
            onClick={() => onView(v as typeof view)}
          >
            {v[0].toUpperCase() + v.slice(1)}
          </Button>
        ))}
        <ModeToggle />
      </div>
    </div>
  );
}
