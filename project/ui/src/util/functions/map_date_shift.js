export default function map_date_shift(item, i, arr) {
  const currDate = new Date(item.date);
  const prevDate = i > 0 ? new Date(arr[i - 1].date) : null;

  let shift = "day";
  if (i === 0) {
    shift = "year";
  } else if (
    !Number.isNaN(currDate.getTime()) &&
    prevDate &&
    !Number.isNaN(prevDate.getTime())
  ) {
    if (currDate.getFullYear() !== prevDate.getFullYear()) shift = "year";
    else if (currDate.getMonth() !== prevDate.getMonth()) shift = "month";
  }

  return { ...item, date: currDate, shift };
}
