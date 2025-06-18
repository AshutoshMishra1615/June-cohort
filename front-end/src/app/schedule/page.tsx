"use client";

import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CustomEvent extends Event {
  type: "Consultation" | "Meeting" | "Operation";
  room: string;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<CustomEvent[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const eventStyleGetter = (event: CustomEvent) => {
    const colors = {
      Consultation: "bg-green-200",
      Operation: "bg-red-300",
      Meeting: "bg-yellow-200",
    };
    return {
      className: `${
        colors[event.type]
      } text-black rounded-md border border-gray-300 px-2 py-1`,
    };
  };

  const handleSelectSlot = async ({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }) => {
    const title = prompt("Enter title:");
    const type = prompt("Enter type (Consultation/Meeting/Operation):") as
      | "Consultation"
      | "Meeting"
      | "Operation";
    const room = prompt("Enter room:") || "N/A";

    if (!title || !type) return;

    const newEvent: CustomEvent = { title, start, end, type, room };

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Schedule</h1>
      <div className="shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          eventPropGetter={eventStyleGetter}
          views={["week"]}
          defaultView="week"
          step={60}
          timeslots={1}
          selectable
          onSelectSlot={handleSelectSlot}
          min={new Date(2024, 5, 16, 8)}
          max={new Date(2024, 5, 16, 17)}
        />
      </div>
    </div>
  );
}
