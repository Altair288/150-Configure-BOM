export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}`;
}

export function formatStatusState(status: string): string {
  if (status === "Released" || status === "Active") {
    return "Success";
  }

  if (status === "In Work") {
    return "Warning";
  }

  return "None";
}
