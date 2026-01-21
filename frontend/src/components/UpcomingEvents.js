'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  CalendarDays,
  Users,
  ChevronRight,
  MapPin,
  ArrowUpRight
} from 'lucide-react';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString, format = 'full') => {
    const date = new Date(dateString);
    if (format === 'day') return date.getDate();
    if (format === 'month') return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.events.getAll();
        if (response.ok) {
          const eventsData = await response.json();
          const activeEvents = eventsData
            .filter(e => e.status === 'ACTIVE' || e.status === 'PUBLISHED')
            .slice(0, 4);
          setEvents(activeEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Card className="glass border-none shadow-2xl rounded-[2rem] overflow-hidden">
      <CardHeader className="p-8 border-b border-white/5 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-primary" />
            Pipeline
          </CardTitle>
          <Link href="/events">
            <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/5 rounded-xl gap-1">
              Explore Full <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Upcoming curated experiences</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-8 flex gap-6 animate-pulse">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-primary/5 rounded w-3/4"></div>
                  <div className="h-4 bg-primary/5 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="p-8 group hover:bg-primary/5 transition-all duration-300">
                <div className="flex gap-6 items-start">
                  {/* Date Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <span className="text-[10px] font-black text-primary group-hover:text-white transition-colors">{formatDate(event.startDateTime, 'month')}</span>
                    <span className="text-2xl font-black text-primary group-hover:text-white transition-colors leading-none mt-1">{formatDate(event.startDateTime, 'day')}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-tight mb-2 truncate">
                      {event.name}
                    </h4>

                    <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location || 'Global/Remote'}</span>
                      <span className="flex items-center gap-1.5 text-primary"><Users className="w-3.5 h-3.5" /> {event.currentAttendees || 0}/{event.capacity} Filled</span>
                    </div>

                    <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-primary group-hover:bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(((event.currentAttendees || 0) / (event.capacity || 100)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Clear Pipeline</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
