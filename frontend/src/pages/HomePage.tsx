import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, Tag, Search, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Encuentra lo que buscas",
    description: "Explora cientos de productos de segunda mano cerca de ti.",
  },
  {
    icon: ShoppingBag,
    title: "Publica y vende",
    description: "Sube tus productos y contacta con compradores en segundos.",
  },
  {
    icon: Tag,
    title: "Organiza por tags",
    description: "Filtra por categorías para encontrar exactamente lo que necesitas.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso seguro",
    description: "Tus sesiones están protegidas con autenticación JWT.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Nodepop
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          La plataforma de compra-venta de segunda mano. Compra, vende y
          descubre productos cerca de ti.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link to="/products" />}>
            Ver productos
          </Button>
          <Button size="lg" variant="outline" render={<Link to="/login" />}>
            Iniciar sesión
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="size-6 text-muted-foreground" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
