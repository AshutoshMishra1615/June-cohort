"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  EventPropGetter,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isBefore,
  isAfter,
} from "date-fns";
import { enUS } from "date-fns/locale";
import "./calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RawEvent, CustomEvent, EventType } from "@/types/schedule";
import CustomToolbar from "@/components/CustomToolbar";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const ROOMS = [
  "Room A",
  "Room B",
  "Room C",
  "Room D",
  "Room E",
  "ICU",
  "Diddy's Room",
];
const TYPES = ["Consultation", "Meeting", "Operation"];

export default function SchedulePage() {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [modalAdd, setModalAdd] = useState<{
    open: boolean;
    event?: CustomEvent;
  }>({ open: false });
  const [modalView, setModalView] = useState<CustomEvent | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidType = (t: string): t is EventType =>
    ["Consultation", "Meeting", "Operation"].includes(t);

  useEffect(() => {
    setLoading(true);
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((data: RawEvent[]) => {
        const parsed: CustomEvent[] = data
          .filter((ev) => isValidType(ev.type))
          .map((ev) => ({
            id: ev._id,
            title: ev.title,
            type: ev.type as EventType,
            room: ev.room,
            start: new Date(ev.start),
            end: new Date(ev.end),
          }));
        setEvents(parsed);
        setLoading(false);
      });
  }, []);

  const handleSelectSlot = ({ start, end }: SlotInfo) => {
    setModalAdd({
      open: true,
      event: { title: "", type: "Consultation", room: ROOMS[0], start, end },
    });
  };

  const isOverlapping = (
    start: Date,
    end: Date,
    room: string,
    excludeId?: string
  ) => {
    return events.some(
      (e) =>
        e.room === room &&
        e.id !== excludeId &&
        isBefore(start, e.end) &&
        isAfter(end, e.start)
    );
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = modalAdd.event?.id;

    const payload: CustomEvent = {
      title: formData.get("title") as string,
      type: formData.get("type") as EventType,
      room: formData.get("room") as string,
      start: new Date(formData.get("start") as string),
      end: new Date(formData.get("end") as string),
    };

    if (isOverlapping(payload.start, payload.end, payload.room, id)) {
      alert("This time slot overlaps with another event in the same room.");
      return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/schedule/${id}` : "/api/schedule";
    setLoading(true);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);

    if (res.ok) {
      const saved = await res.json();
      const updated = { id: saved._id || id, ...payload };
      setEvents((prev) =>
        id ? prev.map((e) => (e.id === id ? updated : e)) : [...prev, updated]
      );
      setModalAdd({ open: false });
    }
  };

  const handleDelete = async () => {
    if (!modalView?.id) return;
    setLoading(true);
    const res = await fetch(`/api/schedule/${modalView.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (res.ok) {
      setEvents(events.filter((e) => e.id !== modalView.id));
      setModalView(null);
    }
  };

  function CustomEvent({ event }: { event: CustomEvent }) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center text-center px-1">
        <div className="font-semibold text-sm">{event.title}</div>
        <div className="text-xs opacity-80">
          {event.room} | {event.type}
        </div>
      </div>
    );
  }

  const eventStyle: EventPropGetter<CustomEvent> = (event) => ({
    style: {
      backgroundColor:
        event.type === "Consultation"
          ? "#A7F3D0"
          : event.type === "Meeting"
          ? "#FDE68A"
          : "#FCA5A5",
      borderRadius: "8px",
      whiteSpace: "pre-line",
      color: "#111827",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center", // ✅ valid string, now typed
      fontWeight: "500",
      fontSize: "0.85rem",
      padding: "6px",
    },
  });

  return (
    <div className="p-6">
      {loading && <p className="text-center mb-4">Loading...</p>}
      <div className="shadow-lg rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(e) => setModalView(e)}
          defaultView="week"
          step={15}
          timeslots={4}
          eventPropGetter={eventStyle}
          toolbar={true}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar,
          }}
          style={{ height: "94vh" }}
        />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={modalAdd.open}
        onOpenChange={(o) => setModalAdd({ open: o })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalAdd.event?.id ? "Edit Event" : "Add Event"}
            </DialogTitle>
          </DialogHeader>
          {modalAdd.event && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  name="title"
                  defaultValue={modalAdd.event.title}
                  required
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select name="type" defaultValue={modalAdd.event.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Room</Label>
                <Select name="room" defaultValue={modalAdd.event.room}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>From</Label>
                <Input
                  name="start"
                  type="datetime-local"
                  defaultValue={format(
                    modalAdd.event.start,
                    "yyyy-MM-dd'T'HH:mm"
                  )}
                  required
                />
              </div>
              <div>
                <Label>To</Label>
                <Input
                  name="end"
                  type="datetime-local"
                  defaultValue={format(
                    modalAdd.event.end,
                    "yyyy-MM-dd'T'HH:mm"
                  )}
                  required
                />
              </div>
              <DialogFooter className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{loading ? "Saving..." : "Save"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!modalView} onOpenChange={() => setModalView(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{modalView?.title}</DialogTitle>
            <DialogDescription>Event details below:</DialogDescription>

            <div className="space-y-1 mt-2 text-sm text-muted-foreground">
              <div>
                <strong>Type:</strong> {modalView?.type}
              </div>
              <div>
                <strong>Room:</strong> {modalView?.room}
              </div>
              <div>
                <strong>From:</strong> {modalView?.start.toLocaleString()}
              </div>
              <div>
                <strong>To:</strong> {modalView?.end.toLocaleString()}
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDelete}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
            <Button
              onClick={() => {
                setModalAdd({ open: true, event: modalView! });
                setModalView(null);
              }}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
