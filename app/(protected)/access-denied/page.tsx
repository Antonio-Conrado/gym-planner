import ErrorAlert from "@/shared/components/alert/ErrorAlert";

export default function Page() {
  return (
    <>
      <ErrorAlert
        title={"Accesso denegado"}
        description={
          "No tienes permisos para acceder a esta página. Por favor, contacta con el administrador si crees que esto es un error."
        }
        isRedirectBack={true}
      />
    </>
  );
}
