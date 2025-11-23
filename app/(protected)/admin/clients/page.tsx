import AdminClients from "@/features/admin/components/Clients";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function Page() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Listado de clientes</CardTitle>
          <CardDescription>
            Visualiza todos los clientes, su entrenador asignado y otra
            información relevante
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-10">
          <AdminClients />
        </CardContent>
      </Card>
    </div>
  );
}
