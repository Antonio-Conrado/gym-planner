"use client";
import { Upload } from "lucide-react";
import { Input } from "../ui/input";
import { ChangeEvent, startTransition, useActionState, useEffect } from "react";
import { status } from "@/shared/interfaces/initialStateAction";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export type InitialStatePhoto = {
  message: string;
  status: status;
};

type UploadPhotoFormProps = {
  id: number;
  action: (
    id: number,
    initialState: InitialStatePhoto,
    formData: FormData
  ) => Promise<{ message: string; status: status }>;

  name: string;
  label?: string;
};

export default function UploadPhotoForm({
  id,
  action,
  name = "name",
  label = "Subir foto",
}: UploadPhotoFormProps) {
  const actionWithId = action.bind(null, id);
  const [state, formAction, isPending] = useActionState(actionWithId, {
    message: "",
    status: status.PENDING,
  });

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append(name, file);

    startTransition(async () => {
      formAction(formData);
    });
  };
  useEffect(() => {
    if (state) {
      if (state.status === status.COMPLETED) toast.success(state.message);
      if (state.status === status.ERROR) toast.error(state.message);
    }
  }, [state]);

  return (
    <div>
      <form action={formAction}>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <label className=" cursor-pointer flex justify-center items-center gap-2 border px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm ">
              <Upload />
              <span>{label}</span>
              <Input
                type="file"
                name={name}
                className="sr-only"
                onChange={handleUpload}
                disabled={isPending}
              />
            </label>
          </>
        )}
      </form>
    </div>
  );
}
