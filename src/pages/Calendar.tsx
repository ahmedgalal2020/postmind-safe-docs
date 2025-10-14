import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Download, AlertTriangle, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { generateICS } from '@/lib/icsExport';
import { detectConflicts, suggestAlternatives } from '@/lib/conflictDetection';

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  risk_level: string | null;
  priority_int: number;
  letter_id: string | null;
}

export default function Calendar() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [alternatives, setAlternatives] = useState<Array<{ start: Date; end: Date }>>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);

      // Detect conflicts
      if (data && data.length > 0) {
        await detectConflicts(data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error(t('errorLoadingEvents'));
    } finally {
      setLoading(false);
    }
  };

  const exportToICS = (event: Event) => {
    const ics = generateICS(event);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `event-${event.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(t('icsExported'));
  };

  const showAlternatives = async (event: Event) => {
    setSelectedEvent(event);
    const suggestions = await suggestAlternatives(
      parseISO(event.start_time),
      parseISO(event.end_time),
      events
    );
    setAlternatives(suggestions);
  };

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderMonthView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="font-semibold text-center p-2">
            {t(day.toLowerCase())}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = events.filter((e) =>
            isSameDay(parseISO(e.start_time), day)
          );
          return (
            <Card
              key={day.toISOString()}
              className={`p-2 min-h-[100px] ${
                !isSameMonth(day, currentDate) ? 'opacity-50' : ''
              }`}
            >
              <div className="font-medium mb-1">{format(day, 'd')}</div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded cursor-pointer ${getRiskColor(event.risk_level)}`}
                    onClick={() => showAlternatives(event)}
                  >
                    {event.status === 'conflict' && (
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                    )}
                    {format(parseISO(event.start_time), 'HH:mm')}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge className={getRiskColor(event.risk_level)}>
                  {event.risk_level || t('normal')}
                </Badge>
                {event.status === 'conflict' && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {t('conflict')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(parseISO(event.start_time), 'PPp')}
                </span>
                <span>→</span>
                <span>{format(parseISO(event.end_time), 'PPp')}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => exportToICS(event)}>
                <Download className="h-4 w-4 mr-1" />
                {t('exportICS')}
              </Button>
              {event.status === 'conflict' && (
                <Button size="sm" onClick={() => showAlternatives(event)}>
                  {t('resolveConflict')}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
      {events.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          {t('noEvents')}
        </Card>
      )}
    </div>
  );

  if (loading) {
    return <div className="container mx-auto p-8">{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            {t('calendar')}
          </h1>
          <p className="text-muted-foreground">{t('calendarDescription')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
          >
            {t('monthView')}
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            {t('listView')}
          </Button>
        </div>
      </div>

      {viewMode === 'month' ? renderMonthView() : renderListView()}

      {selectedEvent && alternatives.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="font-semibold mb-4">{t('suggestedAlternatives')}</h3>
          <div className="space-y-2">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 border rounded">
                <Clock className="h-4 w-4" />
                <span>
                  {format(alt.start, 'PPp')} - {format(alt.end, 'p')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
