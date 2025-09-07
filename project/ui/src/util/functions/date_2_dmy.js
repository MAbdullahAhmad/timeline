export default function date_2_dmy(d) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString(undefined, { month: "short" }).toUpperCase();
  const year = String(d.getFullYear());
  return { day, month, year };
}