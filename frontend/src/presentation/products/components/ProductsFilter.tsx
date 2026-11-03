import { useTags } from "@/presentation/tags/hooks/useTags";
import { TagChip } from "@/presentation/components/TagChip";
import { Button } from "@/components/ui/button";
import { RangeSlider } from "@/components/ui/range-slider";
import { formatPrice } from "@/lib/format";
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

export interface PriceBounds {
  min: number;
  max: number;
}

interface ProductsFilterProps {
  values: ProductsFilterValues;
  onChange: (values: ProductsFilterValues) => void;
  /** Precio mínimo y máximo de los productos; sin él no se muestra el selector de precio. */
  priceBounds: PriceBounds | null;
}

function parseBound(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function clamp(value: number, { min, max }: PriceBounds): number {
  return Math.min(Math.max(value, min), max);
}

export function ProductsFilter({ values, onChange, priceBounds }: ProductsFilterProps) {
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
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
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
        {priceBounds && priceBounds.max > priceBounds.min && (
          <RangeSlider
            label="Precio"
            className="flex-[2_1_16rem]"
            min={priceBounds.min}
            max={priceBounds.max}
            value={[
              clamp(parseBound(values.priceMin) ?? priceBounds.min, priceBounds),
              clamp(parseBound(values.priceMax) ?? priceBounds.max, priceBounds),
            ]}
            onValueChange={([low, high]) =>
              // En los extremos el filtro queda vacío: "sin límite".
              set({
                priceMin: low <= priceBounds.min ? "" : String(low),
                priceMax: high >= priceBounds.max ? "" : String(high),
              })
            }
            formatValue={formatPrice}
            thumbLabels={["Precio mínimo", "Precio máximo"]}
          />
        )}
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
