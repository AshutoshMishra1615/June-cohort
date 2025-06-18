"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface CustomEvent extends Event {
  type: "Consultation" | "Meeting" | "Operation";
  room: string;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

export default function SchedulePage() {
  const [events, setEvents] = useState<CustomEvent[]>([]);

  useEffect(() => {
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((data: any[]) => {
        const parsed = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(parsed);
      });
  }, []);

  const handleSelectSlot = async ({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }) => {
    const title = prompt("Enter title:");
    const type = prompt(
      "Enter type (Consultation/Meeting/Operation):"
    ) as CustomEvent["type"];
    const room = prompt("Enter room:");
    if (!title || !type || !room) return;

    const newEvent = { title, type, room, start, end };
    // Send to backend
    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    // Update UI immediately
    setEvents((prev) => [...prev, newEvent]);
  };

  const eventStyleGetter = (event: CustomEvent) => ({
    style: {
      backgroundColor:
        event.type === "Consultation"
          ? "#A7F3D0"
          : event.type === "Meeting"
          ? "#FDE68A"
          : "#FCA5A5",
      color: "#000",
      borderRadius: "6px",
      padding: "4px",
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Schedule</h1>
      <div className="shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => alert(event.title)}
        />
      </div>
    </div>
  );
}
