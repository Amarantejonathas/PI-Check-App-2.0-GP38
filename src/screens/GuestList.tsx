import { ArrowLeft, Search, CheckCircle2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Guest } from '../types';
import { supabase } from '../services/supabase';

interface GuestListProps {
  guests: Guest[];
  onToggleCheckin: (id: string) => void;
  onDeleteGuest: (id: string) => void;
}

export default function GuestList({
  guests: allGuests,
  onToggleCheckin,
  onDeleteGuest
}: GuestListProps) {

  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [filter, setFilter] = useState<'Todos' | 'Presentes' | 'Ausentes'>('Todos');
  const [search, setSearch] = useState('');

  const [guests, setGuests] = useState<Guest[]>([]);

  // Buscar Convidados
  useEffect(() => {
    fetchGuests();
  }, [eventId]);

  const fetchGuests = async () => {
    if (!eventId) return;

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      console.error('Erro ao buscar convidados:', error);
      return;
    }

    setGuests(
      data.map((guest: any) => ({
        id: guest.id,
        eventId: guest.event_id,
        name: guest.name,
        role: guest.role,
        present: guest.present,
        initials: guest.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      }))
    );
  };

  const deleteGuest = (e: React.MouseEvent, guestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteGuest(guestId);
  };

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === 'Todos' ||
      (filter === 'Presentes'
        ? g.present
        : !g.present);

    return matchesSearch && matchesFilter;
  });

  const presentCount = guests.filter(g => g.present).length;

  return (
    <div className="flex-1 flex flex-col h-screen bg-background-light overflow-hidden">

      {/* Sticky Header */}
      <div className="bg-white sticky top-0 z-20 shrink-0 border-b border-border-light">

        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-background-light rounded-full transition-colors mr-2"
          >
            <ArrowLeft size={24} />
          </button>

          <h1 className="font-display font-bold text-xl">
            Lista de Convidados
          </h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative group">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
            />

            <input
              type="text"
              placeholder="Buscar convidado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-background-light border border-transparent rounded-xl pl-12 pr-4 focus:bg-white focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-4">
          <div className="bg-background-light p-1 rounded-xl flex">

            {(['Todos', 'Presentes', 'Ausentes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`
                  flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all
                  ${filter === tab
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-main'}
                `}
              >
                {tab}
              </button>
            ))}

          </div>
        </div>

        {/* Info */}
        <div className="px-6 py-3 flex justify-between items-center text-xs border-t border-border-light">
          <span className="text-text-muted font-bold">
            TOTAL: {guests.length}
          </span>

          <span className="text-accent-success font-bold">
            {presentCount}/{guests.length} PRESENTES
          </span>
        </div>
      </div>

      {/* Guest List */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        <AnimatePresence mode="popLayout">
          {filteredGuests.map((guest) => (
            <motion.div
              key={guest.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`
                bg-white h-18 flex items-center justify-between px-4 rounded-xl border transition-all
                ${guest.present
                  ? 'border-accent-success/20 bg-accent-success/5 shadow-sm'
                  : 'border-border-light shadow-sm'}
              `}
            >
              <div className="flex items-center gap-3">

                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xs border
                  ${guest.present
                    ? 'bg-accent-success/10 text-accent-success border-accent-success/30'
                    : 'bg-background-light text-primary border-border-light'}
                `}>
                  {guest.initials}
                </div>

                <div>
                  <h4 className="text-sm font-bold font-body text-text-main">
                    {guest.name}
                  </h4>

                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">
                    {guest.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => onToggleCheckin(guest.id)}
                  className={`
                    h-9 px-4 rounded-lg font-display font-bold text-xs flex items-center gap-2 transition-all active:scale-95
                    ${guest.present
                      ? 'bg-accent-success text-white shadow-sm'
                      : 'bg-white border-2 border-primary text-primary hover:bg-primary/5'}
                  `}
                >
                  {guest.present && <CheckCircle2 size={14} />}

                  {guest.present
                    ? 'Presente'
                    : 'Check-in'}
                </button>

                <button
                  onClick={(e) => deleteGuest(e, guest.id)}
                  className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>

      </main>
    </div>
  );
}
