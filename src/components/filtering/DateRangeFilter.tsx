import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, X } from "lucide-react";
import { format } from "date-fns";

interface DateRangeFilterProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  startDate: Date | null;
  endDate: Date | null;
}

export function DateRangeFilter({ onDateChange, startDate, endDate }: DateRangeFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onDateChange(start, end);
    setIsCalendarOpen(false);
  };

  const clearDates = () => {
    onDateChange(null, null);
    setIsCalendarOpen(false);
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return "Select dates";
    return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDateRange()}</span>
          {(startDate || endDate) && (
            <X 
              className="h-4 w-4 ml-2 hover:text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                clearDates();
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="grid gap-2">
            <Button 
              variant="outline" 
              onClick={() => handlePresetClick(7)}
            >
              Last 7 days
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handlePresetClick(30)}
            >
              Last 30 days
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handlePresetClick(365)}
            >
              Last year
            </Button>
          </div>
          <div className="border-t pt-4">
            <Calendar
              mode="range"
              selected={{
                from: startDate || undefined,
                to: endDate || undefined,
              }}
              onSelect={(range) => {
                onDateChange(range?.from || null, range?.to || null);
              }}
              numberOfMonths={2}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}