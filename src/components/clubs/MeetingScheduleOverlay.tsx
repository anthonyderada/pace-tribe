import { format } from "date-fns";

interface MeetingTime {
  day: string;
  time: string;
}

interface MeetingScheduleOverlayProps {
  schedule: MeetingTime[] | null;
}

export const MeetingScheduleOverlay = ({ schedule }: MeetingScheduleOverlayProps) => {
  if (!schedule || schedule.length === 0) return null;

  const formatSchedule = () => {
    const days = schedule.map(s => s.day).join(", ");
    const time = schedule[0].time; // Assuming same time for all days
    return `${days} | ${time}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-3 text-white/90 text-sm">
      <div className="flex items-center gap-2">
        <span className="truncate">{formatSchedule()}</span>
      </div>
    </div>
  );
};