interface CourseInfoProps {
  label: string;
  value: string | number;
}

export const CourseInfo = ({ label, value }: CourseInfoProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-1">{label}</h3>
      <p>{value}</p>
    </div>
  );
};