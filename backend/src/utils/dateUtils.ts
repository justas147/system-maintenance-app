export function getDatesInRange(startDate, endDate) {
  // Convert string dates to Date objects if needed
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  
  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
  }
  
  if (start > end) {
      throw new Error('Start date must be before end date');
  }
  
  const dates: Date[] = [];
  
  // Clone the start date
  let currentDate = new Date(start);
  
  // Set time to midnight to avoid timezone issues
  currentDate.setHours(0, 0, 0, 0);
  
  // Loop until we reach the end date
  while (currentDate <= end) {
      dates.push(new Date(currentDate));
      // Add one day
      currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function checkIfDateIsInRange(date: Date, startDate: Date, endDate: Date): boolean {
  // Get start of day for start date
  const rangeStartDate = new Date(startDate);
  rangeStartDate.setHours(0, 0, 0, 0);
  // Get end of day for end date
  const rangeEndDate = new Date(endDate);
  rangeEndDate.setHours(23, 59, 59, 999);

  return date >= rangeStartDate && date <= rangeEndDate;
}