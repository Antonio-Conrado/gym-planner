import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type Props = {
  title: string;
  description: string;
  href?: string;
  linkValue?: string;
};

export default function ErrorAlert({
  title,
  description,
  href = "/",
  linkValue = "Volver al inicio",
}: Props) {
  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <Alert className="max-w-md w-full flex flex-col items-center">
        <AlertTitle className="text-xl font-semibold text-center">
          {title}
        </AlertTitle>
        <AlertDescription className="text-gray-700 mt-2 text-center">
          {description}
        </AlertDescription>

        <Link href={href} className="mt-4">
          <span className="inline-block w-40 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition text-center">
            {linkValue}
          </span>
        </Link>
      </Alert>
    </div>
  );
}
