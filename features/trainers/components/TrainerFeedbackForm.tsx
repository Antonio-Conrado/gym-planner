import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import RateTrainerForm from "./RateTrainerForm";

type Props = {
  trainerId: number;
  slug: string;
};
export default function TrainerFeedbackForm({ trainerId, slug }: Props) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Calificar y dejar comentario</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <RateTrainerForm
            trainerId={trainerId}
            allowComment={true}
            slug={slug}
          />
        </DialogContent>
      </form>
    </Dialog>
  );
}
