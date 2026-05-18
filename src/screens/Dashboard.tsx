import { Plus, Calendar, MapPin, Search, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Event, Task } from '../types';
import BottomNav from '../components/BottomNav';

import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

interface DashboardProps {
  events: Event[];
  onDelete: (id: string) => void;
  tasks: Task[];
}

export default function Dashboard({ events, onDelete, tasks }: DashboardProps) {

  // NOVO: estado local dos eventos vindos do Supabase
  const [supabaseEvents, setSupabaseEvents] = useState<Event[]>([]);

  // NOVO: loading
  const [loading, setLoading] = useState(true);

  // NOVO: buscar eventos
  useEffect(() => {
    async function fetchEvents() {
      try {

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) {
          throw error;
        }

        setSupabaseEvents(data || []);

      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="flex-1 flex flex-col pb-24 h-screen overflow-hidden">
      {/* Header */}
      <header className="p-6 bg-white shrink-0">
        <div className="flex justify-between items-center mb-6">
          <Link to="/login" className="hover:opacity-80 transition-opacity">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-main">Check-App</h1>
          </Link>
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden">
            <img 
              src="data:image/jpeg;base64,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" 
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="mb-2">
          <h2 className="font-display text-3xl font-bold text-text-main">Meus Eventos</h2>
          <p className="text-text-muted mt-1">Gerencie suas tarefas e cronogramas</p>
        </div>
      </header>

      {/* Main List */}
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scroll-smooth bg-background-light">

        {/* Loading */}
        {loading && (
          <p className="text-center text-text-muted">
            Carregando eventos...
          </p>
        )}

        {/* Event List */}
        <div className="space-y-4">
          <AnimatePresence>
            {supabaseEvents.map((event, index) => {
              const eventTasks = tasks.filter(t => t.eventId === event.id);
              const completedTasks = eventTasks.filter(t => t.completed).length;
              const progress = eventTasks.length > 0 ? Math.round((completedTasks / eventTasks.length) * 100) : 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <Link to={`/event/${event.id}`} className="block group">
                    <div className="bg-white p-5 rounded-2xl border border-border-light shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col gap-5">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-display text-xl font-bold text-text-main group-hover:text-primary transition-colors leading-tight">
                                {event.name}
                              </h4>
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider h-fit">
                                {event.status}
                              </span>
                            </div>
                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">{event.type}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-muted text-xs">
                            <div className="flex items-center gap-2 bg-background-light/50 p-2 rounded-lg group-hover:bg-primary/5 transition-colors">
                              <Calendar size={14} className="text-primary" />
                              <span className="font-medium">
                                {event.date.split('-').reverse().join('/')} • {event.time}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 bg-background-light/50 p-2 rounded-lg group-hover:bg-primary/5 transition-colors">
                                <MapPin size={14} className="text-primary" />
                                <span className="font-medium truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border-light/50 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-text-muted">Progresso</span>
                          <span className="text-accent-success font-bold font-display">{progress}% Concluído</span>
                        </div>
                        <div className="w-full bg-background-light h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="h-full bg-accent-success rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(event.id);
                    }}
                    className="absolute top-4 right-4 p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* FAB */}
      <Link 
        to="/create"
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-xl shadow-glow flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30"
      >
        <Plus size={32} />
      </Link>

      <BottomNav />
    </div>
  );
}