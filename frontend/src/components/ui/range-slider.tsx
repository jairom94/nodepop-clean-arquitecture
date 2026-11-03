import { useLayoutEffect, useRef, useState } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

type Range = [number, number];

/** Separación mínima en px entre tiradores para que sus valores no se pisen. */
const MIN_LABEL_GAP_PX = 96;

interface RangeSliderProps {
  /** Texto visible encima del control; también nombra el grupo para lectores de pantalla. */
  label: string;
  min: number;
  max: number;
  value: Range;
  onValueChange: (value: Range) => void;
  step?: number;
  /** Formato de los valores que se muestran sobre cada tirador. */
  formatValue?: (value: number) => string;
  /** Nombres accesibles de los tiradores, en orden: [mínimo, máximo]. */
  thumbLabels?: [string, string];
  className?: string;
}

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

/** Selector de rango con dos tiradores y el valor de cada uno encima. */
export function RangeSlider({
  label,
  min,
  max,
  value,
  onValueChange,
  step = 1,
  formatValue = String,
  thumbLabels = ["Mínimo", "Máximo"],
  className,
}: RangeSliderProps) {
  const [trackRef, trackWidth] = useElementWidth<HTMLDivElement>();
  const [low, high] = value;
  const span = max - min || 1;
  const lowPct = ((low - min) / span) * 100;
  const highPct = ((high - min) / span) * 100;

  // Si los tiradores están cerca, un único valor centrado sobre el tramo elegido.
  const merged = ((highPct - lowPct) / 100) * trackWidth < MIN_LABEL_GAP_PX;
  const mergedText = low === high ? formatValue(low) : `${formatValue(low)} – ${formatValue(high)}`;
  const mergedPct = (lowPct + highPct) / 2;

  return (
    <SliderPrimitive.Root
      data-slot="range-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={(next) => onValueChange(next as Range)}
      thumbAlignment="edge"
      className={cn("flex flex-col gap-1.5", className)}
    >
      <SliderPrimitive.Label className="text-sm leading-none font-medium select-none">
        {label}
      </SliderPrimitive.Label>
      {/* El espacio superior aloja los valores flotantes de los tiradores. */}
      <SliderPrimitive.Control className="flex touch-none items-center pt-8 pb-2 select-none data-disabled:opacity-50">
        <SliderPrimitive.Track ref={trackRef} className="relative h-2 w-full rounded-full bg-input">
          <SliderPrimitive.Indicator className="rounded-full bg-foreground" />
          {merged && (
            <span
              aria-hidden="true"
              // translateX(-p%) con left:p% mantiene la etiqueta dentro del carril en los extremos.
              style={{ left: `${mergedPct}%`, transform: `translateX(-${mergedPct}%)` }}
              className="pointer-events-none absolute bottom-full mb-4 text-sm font-semibold whitespace-nowrap tabular-nums"
            >
              {mergedText}
            </span>
          )}
          {value.map((thumbValue, index) => (
            <SliderPrimitive.Thumb
              key={index}
              index={index}
              getAriaLabel={(i) => thumbLabels[i]}
              getAriaValueText={() => formatValue(thumbValue)}
              className="size-7 rounded-full bg-foreground shadow-md outline-none select-none has-focus-visible:ring-4 has-focus-visible:ring-ring/50 data-dragging:ring-4 data-dragging:ring-ring/30"
            >
              {!merged && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute bottom-full mb-1.5 text-sm font-semibold whitespace-nowrap tabular-nums",
                    index === 0 ? "left-0" : "right-0",
                  )}
                >
                  {formatValue(thumbValue)}
                </span>
              )}
            </SliderPrimitive.Thumb>
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
