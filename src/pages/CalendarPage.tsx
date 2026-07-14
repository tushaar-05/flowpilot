import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Drawer';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';
import { getPriorityColor, capitalize } from '@/utils/helpers';

export function CalendarPage() {
  const { tasks } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const days = useMemo(() => {
    const startOfCurrentMonth = startOfMonth(currentMonth);
    const endOfCurrentMonth = endOfMonth(currentMonth);
    
    const gridStart = startOfWeek(startOfCurrentMonth, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(endOfCurrentMonth, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const tasksForDate = (date: Date) =>
    tasks.filter((t) => isSameDay(parseISO(t.dueDate), date));

  const selectedTasks = selectedDate ? tasksForDate(selectedDate) : [];

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: 'Calendar' }]} />
        <h1 className="text-2xl font-bold mt-2">Calendar</h1>
        <p className="text-muted text-sm mt-1">View task deadlines by date</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayTasks = tasksForDate(day);
            const inMonth = isSameMonth(day, currentMonth);
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'h-24 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-slate-50',
                  isToday(day) && 'border-primary bg-primary/5',
                  !inMonth && 'opacity-40'
                )}
              >
                <span className={cn(
                  'text-sm font-medium text-center block w-full',
                  isToday(day) && 'text-primary'
                )}>
                  {format(day, 'd')}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="text-[10px] truncate rounded px-1 py-0.5 bg-primary/10 text-primary"
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[10px] text-muted">+{dayTasks.length - 2} more</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Tasks'}
      >
        {selectedTasks.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <CalendarIcon className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No tasks due on this date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedTasks.map((task) => (
              <Card key={task.id} padding="sm">
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-xs text-muted mt-1 line-clamp-2">{task.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={getPriorityColor(task.priority)}>{capitalize(task.priority)}</Badge>
                  <Badge className="bg-slate-100 text-slate-600">{capitalize(task.status)}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
