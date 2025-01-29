interface EventDescriptionProps {
  description: string | null;
  participantCount: number;
}

export const EventDescription = ({ description, participantCount }: EventDescriptionProps) => {
  return (
    <>
      <p className="text-gray-400 line-clamp-3">
        {description || "No description available"}
      </p>
      <p className="text-gray-400 text-sm mt-4">
        {participantCount} participants
      </p>
    </>
  );
};