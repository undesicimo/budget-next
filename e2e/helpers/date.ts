export function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const timeEpo = date.getTime();

  return `${year}-${month}-${day}-${timeEpo}`;
}
