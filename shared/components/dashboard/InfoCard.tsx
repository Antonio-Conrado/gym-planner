import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  cls?: string;
};
export default function InfoCard({
  title,
  value,
  description,
  icon,
  cls,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-gray-700 font-normal">{title}</CardTitle>
          {icon && <span className={cls}>{icon}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-2xl">{value}</p>
        <p className="text-sm text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
}
