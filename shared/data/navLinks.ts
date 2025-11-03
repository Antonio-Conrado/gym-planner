import { Role } from "@/app/generated/prisma";

type link = {
  name: string;
  href: string;
  roles?: string[];
};
type NavGroups = {
  title: string;
  links: link[];
};

export const navGroups: NavGroups[] = [
  {
    title: "General",
    links: [
      { name: "Inicio", href: "/#home" },
      { name: "Beneficios", href: "/#benefits" },
      { name: "Instalaciones", href: "/#facilities" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { name: "Planes", href: "/#plans" },
      { name: "Entrenadores", href: "/trainers" },
    ],
  },
  {
    title: "Otros",
    links: [
      { name: "Testimonios", href: "/#testimonials" },
      { name: "Contacto / Ubicación", href: "/#contact" },
    ],
  },
  {
    title: "Administrativo",
    links: [
      //admin
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        roles: [Role.ADMIN],
      },

      //admin
      { name: "Registrar pago", href: "/admin/payments", roles: [Role.ADMIN] },
      {
        name: "Historial de pagos",
        href: "/admin/payments/history",
        roles: [Role.ADMIN],
      },
      { name: "Planes", href: "/admin/plans", roles: [Role.ADMIN] },
      { name: "Clientes", href: "/admin/clients", roles: [Role.ADMIN] },
      { name: "Entrenadores", href: "/admin/trainers", roles: [Role.ADMIN] },

      //trainer
      {
        name: "Clientes",
        href: "/clients",
        roles: [Role.TRAINER],
      },
    ],
  },
];

export const clientLinks = (userId: number): link[] => [
  {
    name: "Rutinas",
    href: `/clients/${userId}/routines`,
    roles: [Role.CLIENT],
  },
  {
    name: "Historial de pagos",
    href: `/clients/${userId}/payments`,
    roles: [Role.CLIENT],
  },
  {
    name: "Mi progreso",
    href: `/clients/${userId}/progress`,
    roles: [Role.CLIENT],
  },
];

export const generalLinks = (userId: number, role: Role): link[] => {
  let notificationsHref = "/notifications"; // default for admin

  if (role === Role.CLIENT || role === Role.TRAINER)
    notificationsHref = `/notifications/${userId}`;

  return [
    {
      name: "Notificaciones",
      href: notificationsHref,
      roles: [Role.TRAINER, Role.ADMIN, Role.CLIENT],
    },
  ];
};
