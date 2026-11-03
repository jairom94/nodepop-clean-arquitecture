import { useTags } from "@/presentation/tags/hooks/useTags";
import { TagChip } from "@/presentation/components/TagChip";
import { Button } from "@/components/ui/button";
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

  const set = (patch: Partial<ProductsFilterValues>) => onChange({ ...values, ...patch });

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

  const tags = tagsQuery.data ?? [];

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-card p-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-[3_1_16rem] flex-col gap-1.5">
          <Label htmlFor="filter-name">Nombre</Label>
          <Input
            id="filter-name"
            type="search"
            placeholder="Buscar en mis productos"
            value={values.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </div>
        <div className="flex flex-[1_1_8rem] flex-col gap-1.5">
          <Label htmlFor="filter-price-min">Precio mínimo</Label>
          <Input
            id="filter-price-min"
            type="number"
            min="0"
            step="0.01"
            placeholder="0 €"
            value={values.priceMin}
            onChange={(e) => set({ priceMin: e.target.value })}
          />
        </div>
        <div className="flex flex-[1_1_8rem] flex-col gap-1.5">
          <Label htmlFor="filter-price-max">Precio máximo</Label>
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

      {(tags.length > 0 || isDirty) && (
        <div
          role="group"
          aria-label="Filtrar por tag"
          className="flex flex-wrap items-center gap-2"
        >
          {tags.map((tag) => (
            <TagChip
              key={tag.id ?? tag.name}
              label={tag.name}
              size="sm"
              selected={values.tags.includes(tag.name)}
              onClick={() => toggleTag(tag.name)}
            />
          ))}
          {isDirty && (
            <Button
              variant="link"
              size="sm"
              className="ml-auto"
              onClick={() => onChange(EMPTY_PRODUCTS_FILTER)}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
