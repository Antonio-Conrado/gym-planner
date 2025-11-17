"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Dispatch, SetStateAction, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { User } from "@/app/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/shared/components/ui/spinner";

export type InitialClient = {
  id: User["id"];
  name: User["name"];
  email: User["email"];
};

type Props = {
  selectedClient: InitialClient | null;
  setSelectedClient: Dispatch<SetStateAction<InitialClient | null>>;
};

export function SearchUser({ selectedClient, setSelectedClient }: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedValue = useDebounce(searchTerm, 300);

  const { data: clients = [], isFetching } = useQuery({
    queryKey: ["client", selectedClient?.id],
    queryFn: async () => {
      const res = await fetch(`/api/clients/search?value=${debouncedValue}`);
      if (!res.ok) throw new Error("Error fetching clients");
      const data: InitialClient[] = await res.json();
      return data;
    },
    enabled: !!debouncedValue,
  });

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between font-normal text-gray-500"
          >
            {selectedClient ? selectedClient.name : "Seleccionar cliente"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className=" sm:w-96 p-0">
          <Command>
            <CommandInput
              placeholder="Buscar cliente..."
              className="h-9"
              value={searchTerm}
              onValueChange={(value) => setSearchTerm(value)}
            />
            <CommandList>
              <CommandEmpty>
                {isFetching ? (
                  <Spinner className="mx-auto" />
                ) : (
                  "No hay resultados"
                )}
              </CommandEmpty>
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem
                    key={client.id}
                    value={client.name}
                    onSelect={() => {
                      setSelectedClient(client);
                      setSearchTerm(client.name);
                      setOpen(false);
                    }}
                  >
                    {client.name} ({client.email})
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedClient?.id === client.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" name="userId" value={selectedClient?.id ?? ""} />
    </>
  );
}
