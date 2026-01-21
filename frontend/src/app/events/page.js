'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthContext';
import { useNotification } from '../../components/NotificationContext';
import PermissionGuard, { usePermission } from '../../components/PermissionGuard';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const canModifyEvents = usePermission(['ADMIN', 'ORGANIZER']);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.events.getAll();
        if (response.ok) {
          const eventsData = await response.json();
          setEvents(eventsData);
        } else {
          setError('Failed to load events');
        }
      } catch (err) {
        setError('Network error. Check if backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId, eventName) => {
    try {
      const response = await api.events.delete(eventId);
      if (response.ok) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        showNotification('Event deleted successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(`Failed: ${errorData.message || 'Error'}`, 'error');
      }
    } catch (err) {
      showNotification('Network error.', 'error');
    }
  };

  const handleEditEvent = (eventId) => {
    window.location.href = `/events/edit/${eventId}`;
  };

  const demoEvents = [
    {
      id: 1,
      name: 'Tech Conference 2024',
      date: '2024-09-15',
      location: 'San Francisco, CA',
      status: 'ACTIVE',
      attendees: 450,
      capacity: 500,
      price: 108000,
      type: 'Conference',
    },
    {
      id: 2,
      name: 'Wedding Ceremony',
      date: '2024-09-20',
      location: 'New York, NY',
      status: 'ACTIVE',
      attendees: 120,
      capacity: 150,
      price: 144000,
      type: 'Wedding',
    },
    {
      id: 3,
      name: 'Music Festival',
      date: '2024-10-05',
      location: 'Austin, TX',
      status: 'ACTIVE',
      attendees: 1200,
      capacity: 2000,
      price: 768000,
      type: 'Festival',
    },
  ];

  const eventsToDisplay = events.length > 0 ? events : demoEvents;

  const filteredEvents = eventsToDisplay.filter((event) => {
    const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const eventStatus = event.status?.toUpperCase() || 'ACTIVE';
    const matchesFilter = filterStatus === 'all' || eventStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'PUBLISHED':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Active</Badge>;
      case 'DRAFT':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">Draft</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Synchronizing elite events...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Events Portfolio
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Curate and oversee your world-class gatherings.</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'ORGANIZER']}>
          <Link href="/events/create">
            <Button className="premium-gradient shadow-lg hover:shadow-primary/20 h-12 px-8 font-bold rounded-xl gap-2 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              New Experience
            </Button>
          </Link>
        </PermissionGuard>
      </div>

      {/* Control Bar */}
      <Card className="glass border-white/20 shadow-xl overflow-hidden rounded-2xl">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or type..."
                className="pl-10 h-12 glass border-white/10 focus-visible:ring-primary/20 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px] h-12 glass border-white/10 rounded-xl font-medium">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="all">Every State</SelectItem>
                  <SelectItem value="ACTIVE">Active Only</SelectItem>
                  <SelectItem value="DRAFT">Drafts</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error state alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl flex items-center gap-4">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error} - Using demo data fallback.</p>
        </div>
      )}

      {/* Events Table */}
      <Card className="glass border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="w-[300px] h-14 font-bold text-foreground pl-8">EVENT & TYPE</TableHead>
              <TableHead className="font-bold text-foreground">VENUE & SCHEDULE</TableHead>
              <TableHead className="font-bold text-foreground">STATUS</TableHead>
              <TableHead className="font-bold text-foreground">ATTENDEE RATIO</TableHead>
              <TableHead className="font-bold text-foreground">ENTRY PRICE</TableHead>
              <TableHead className="text-right pr-8 font-bold text-foreground">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => {
              const eventDate = event.startDateTime || event.date;
              const eventType = event.type || 'Standard';
              const eventStatus = event.status || 'ACTIVE';
              const attendees = event.currentAttendees || event.attendees || 0;
              const capacity = event.capacity || 100;
              const revenue = event.price ? `₹${event.price.toLocaleString()}` : 'Free';

              return (
                <TableRow key={event.id} className="group hover:bg-primary/5 transition-colors border-white/5 h-20">
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shadow-inner">
                        {eventType === 'Conference' ? '🎤' :
                          eventType === 'Wedding' ? '💍' :
                            eventType === 'Festival' ? '🎸' : '🎪'}
                      </div>
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors text-base">{event.name}</div>
                        <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase">{eventType}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {eventDate ? new Date(eventDate).toLocaleDateString('en-GB') : 'Schedule Pending'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(eventStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${Math.min((attendees / capacity) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{attendees}/{capacity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-foreground text-base">
                    {revenue}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10">
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass w-48 p-2 rounded-xl border-white/20">
                        <DropdownMenuLabel>Event Controls</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-primary/5 flex gap-3" onClick={() => alert('Viewing details...')}>
                          <Eye className="w-4 h-4 text-blue-500" /> View Statistics
                        </DropdownMenuItem>
                        <PermissionGuard roles={['ADMIN', 'ORGANIZER']}>
                          <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-primary/5 flex gap-3" onClick={() => handleEditEvent(event.id)}>
                            <Edit className="w-4 h-4 text-emerald-500" /> Modify Event
                          </DropdownMenuItem>
                          <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-destructive/5 text-destructive flex gap-3" onClick={() => handleDeleteEvent(event.id, event.name)}>
                            <Trash2 className="w-4 h-4" /> Terminate Event
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredEvents.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Zero Events Detected</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto font-medium">No results found for your current search or filter criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
