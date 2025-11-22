import { Button } from "../ui/button";

type Props = {
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  rowsOnPage: number;
};

export default function Pagination({
  total,
  page,
  rowsPerPage,
  onPageChange,
  rowsOnPage,
}: Props) {
  const totalPages = Math.ceil(total / rowsPerPage);
  const start = rowsOnPage > 0 ? (page - 1) * rowsPerPage + 1 : 0;
  const end = rowsOnPage > 0 ? (page - 1) * rowsPerPage + rowsOnPage : 0;

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-end space-x-2">
      <div className="text-muted-foreground flex-1 text-sm">
        <span>
          Mostrando {start}–{end} de {total ?? "--"}{" "}
          {total === 1 ? "fila" : "filas"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Anterior
        </Button>
        <span className="text-sm">
          Página {page} de {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
