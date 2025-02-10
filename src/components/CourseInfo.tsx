
interface CourseInfoProps {
  label: string;
  value: string | number;
}

export const CourseInfo = ({ label, value }: CourseInfoProps) => {
  return (
    <div className="p-2 sm:p-3 bg-muted rounded-lg">
      <h3 className="font-semibold mb-1 text-xs sm:text-sm md:text-base">{label}</h3>
      <p className="text-xs sm:text-sm md:text-base break-words">{value}</p>
    </div>
  );
};
