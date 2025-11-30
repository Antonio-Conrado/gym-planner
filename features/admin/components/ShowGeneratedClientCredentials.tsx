import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dispatch, SetStateAction } from "react";
import { GeneratedClientCredentials } from "./RegisterClient";

type Props = {
  showInformationDialog: boolean;
  generatedInformation: GeneratedClientCredentials;
  setShowInformationDialog: Dispatch<SetStateAction<boolean>>;
  setGeneratedInformation: Dispatch<SetStateAction<GeneratedClientCredentials>>;
};
export default function ShowGeneratedClientCredentials({
  showInformationDialog,
  generatedInformation,
  setShowInformationDialog,
  setGeneratedInformation,
}: Props) {
  return (
    <Dialog
      open={showInformationDialog}
      onOpenChange={(open) => {
        if (!open) return;
        setShowInformationDialog(open);
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Credenciales del cliente</DialogTitle>
          <DialogDescription>
            Proporciona esta información temporal al cliente para que pueda
            acceder luego. Solo se mostrará una vez.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-5">
          <div className="grid gap-3">
            <Label>Correo generado</Label>
            <Input value={generatedInformation?.email ?? ""} readOnly />
          </div>
          <div className="grid gap-3">
            <Label>Contraseña generada</Label>
            <Input value={generatedInformation?.password ?? ""} readOnly />
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            onClick={() => {
              setShowInformationDialog(false);
              setGeneratedInformation(null);
            }}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
