import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

export function RegisterClient() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gray-800 hover:bg-gray-700 hover:cursor-pointer text-white hover:text-white"
        >
          Crear nuevo cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo cliente</DialogTitle>
          <DialogDescription>
            Ingresa los datos del cliente en el formulario a continuación para
            registrarlo.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Crear nuevo cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
