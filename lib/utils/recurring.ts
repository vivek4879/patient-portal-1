import { addWeeks, addMonths, isBefore } from 'date-fns'

export function generateRecurringInstances(
  initialDate: Date,
  repeat: "none" | "weekly" | "monthly",
  monthsForward: number = 3
): Date[] {
  const instances: Date[] = [initialDate]
  
  if (repeat === "none") return instances

  const endDate = addMonths(new Date(), monthsForward)
  let currentDate = new Date(initialDate)

  while (isBefore(currentDate, endDate)) {
    if (repeat === "weekly") {
      currentDate = addWeeks(currentDate, 1)
    } else if (repeat === "monthly") {
      currentDate = addMonths(currentDate, 1)
    }
    
    if (isBefore(currentDate, endDate)) {
      instances.push(currentDate)
    }
  }

  return instances
}
