export function getToday6AM() {
  const resetTime = new Date();
  resetTime.setHours(6, 0, 0, 0);
  return resetTime;
}

export function getMonday6AM() {
  const now = new Date();
  const resetTime = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;
  resetTime.setDate(now.getDate() - diffToMonday);
  resetTime.setHours(6, 0, 0, 0);
  return resetTime;
}
