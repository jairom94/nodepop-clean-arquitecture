const wholeEuros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const euros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

/** Formatea un precio omitiendo los céntimos cuando son cero: 150 €, 95,50 €. */
export function formatPrice(price: number): string {
  return (Number.isInteger(price) ? wholeEuros : euros).format(price);
}

export function parsePositiveId(raw: string | undefined): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
