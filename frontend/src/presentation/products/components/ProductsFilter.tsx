import { useTags } from "@/presentation/tags/hooks/useTags";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ProductsFilterValues {
  name: string;
  priceMin: string;
  priceMax: string;
  tags: string[];
}

export const EMPTY_PRODUCTS_FILTER: ProductsFilterValues = {
  name: "",
  priceMin: "",
  priceMax: "",
  tags: [],
};

interface ProductsFilterProps {
  values: ProductsFilterValues;
  onChange: (values: ProductsFilterValues) => void;
}

export function ProductsFilter({ values, onChange }: ProductsFilterProps) {
  const tagsQuery = useTags();

  const set = (patch: Partial<ProductsFilterValues>) =>
    onChange({ ...values, ...patch });

  const toggleTag = (name: string) => {
    set({
      tags: values.tags.includes(name)
        ? values.tags.filter((t) => t !== name)
        : [...values.tags, name],
    });
  };

  const isDirty =
    values.name !== "" ||
    values.priceMin !== "" ||
    values.priceMax !== "" ||
    values.tags.length > 0;

  return (
    <Card className="mt-4">
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-name">Nombre</Label>
            <Input
              id="filter-name"
              placeholder="Buscar por nombre..."
              value={values.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-price-min">Precio mínimo (€)</Label>
            <Input
              id="filter-price-min"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={values.priceMin}
              onChange={(e) => set({ priceMin: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-price-max">Precio máximo (€)</Label>
            <Input
              id="filter-price-max"
              type="number"
              min="0"
              step="0.01"
              placeholder="Sin límite"
              value={values.priceMax}
              onChange={(e) => set({ priceMax: e.target.value })}
            />
          </div>
        </div>

        {(tagsQuery.data ?? []).length > 0 && (
          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1">
              {(tagsQuery.data ?? []).map((tag) => {
                const selected = values.tags.includes(tag.name);
                return (
                  <button
                    key={tag.id ?? tag.name}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={[
                      "rounded-full px-3 py-1 text-xs transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    ].join(" ")}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isDirty && (
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => onChange(EMPTY_PRODUCTS_FILTER)}
          >
            Limpiar filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
