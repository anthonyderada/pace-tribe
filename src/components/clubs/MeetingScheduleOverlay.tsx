import { Circle } from "lucide-react";

interface MeetingTime {
  day: string;
  time: string;
}

interface MeetingScheduleOverlayProps {
  schedule: MeetingTime[] | null;
}

const dayAbbreviations: { [key: string]: string } = {
  'Monday': 'M',
  'Tuesday': 'T',
  'Wednesday': 'W',
  'Thursday': 'T',
  'Friday': 'F',
  'Saturday': 'S',
  'Sunday': 'S'
};

export const MeetingScheduleOverlay = ({ schedule }: MeetingScheduleOverlayProps) => {
  if (!schedule || schedule.length === 0) return null;

  const time = schedule[0].time; // Assuming same time for all days
  const days = schedule.map(s => dayAbbreviations[s.day]);

  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-1">
        {days.map((day, index) => (
          <div key={index} className="relative">
            <Circle className="h-5 w-5 text-white" />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-black">
              {day}
            </span>
          </div>
        ))}
      </div>
      <div className="text-black font-bold text-base">
        {time}
      </div>
    </div>
  );
};