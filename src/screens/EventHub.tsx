import { ArrowLeft, Calendar, MapPin, ChevronRight, ListChecks, Users, Trash2, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Event, Guest, Task } from '../types';

interface EventHubProps {
  events: Event[];
  onDelete: (id: string) => void;
  guests: Guest[];
  onAddGuest: (guest: Guest) => void;
  tasks: Task[];
}

export default function EventHub({ events, onDelete, guests, onAddGuest, tasks: allTasks }: EventHubProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');

  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Evento não encontrado.</p>
        <button onClick={() => navigate('/')} className="text-primary ml-2 font-bold">Voltar</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      onDelete(event.id);
      navigate('/');
    }
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const initials = newGuestName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newGuest: Guest = {
      id: Date.now().toString(),
      eventId: id!,
      name: newGuestName,
      role: 'Convidado',
      present: false,
      initials
    };

    onAddGuest(newGuest);
    setNewGuestName('');
    setShowAddGuest(false);
  };

  const eventGuests = guests.filter(g => g.eventId === id);
  const eventTasks = allTasks.filter(t => t.eventId === id);
  const completedTasks = eventTasks.filter(t => t.completed).length;
  const progress = eventTasks.length > 0 ? Math.round((completedTasks / eventTasks.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background-light overflow-hidden relative">
      {/* Hero Section (Event Details) */}
      <section className="bg-[#0B132B] text-white px-6 pt-12 pb-14 relative shrink-0">
        <nav className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-error/20 hover:text-error transition-all"
          >
             <Trash2 size={20} />
          </button>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-[32px] leading-tight mb-6 text-white max-w-[90%]">
            {event.name}
          </h1>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/70">
              <Calendar size={18} className="text-primary" />
              <span className="font-body font-medium text-sm">
                {event.date.split('-').reverse().join('/')}, {event.time}
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <MapPin size={18} className="text-primary" />
              <span className="font-body font-medium text-sm">{event.location || 'Local a definir'}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content Modules */}
      <section className="p-6 flex-1 bg-background-light -mt-6 rounded-t-[32px] relative z-20 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        {/* Tasks Module */}
        <Link to={`/event/${id}/tasks`} className="block">
          <motion.div 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-border-light rounded-2xl p-6 flex flex-col shadow-sm hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <ListChecks size={24} className="text-primary" />
              </div>
              <ChevronRight size={20} className="text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <h2 className="font-display font-bold text-xl text-text-main mb-1">Tarefas</h2>
            <div className="flex justify-between items-center mb-4">
               <p className="font-body font-bold text-[11px] text-text-muted uppercase tracking-widest">
                {completedTasks}/{eventTasks.length} CONCLUÍDAS
              </p>
              <span className="text-accent-success font-bold text-xs">{progress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-background-light rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent-success rounded-full" 
              />
            </div>
          </motion.div>
        </Link>

        {/* Guest List Module */}
        <div className="relative">
          <Link to={`/event/${id}/guests`} className="block">
            <motion.div 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-border-light rounded-2xl p-6 flex flex-col shadow-sm hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Users size={24} className="text-primary" />
                </div>
                <ChevronRight size={20} className="text-text-muted group-hover:text-primary transition-colors" />
              </div>
              <h2 className="font-display font-bold text-xl text-text-main mb-1">Convidados</h2>
              <p className="font-body font-bold text-[11px] text-text-muted uppercase tracking-widest mb-6 px-1">
                {eventGuests.length} CONFIRMADOS
              </p>
              
              {/* Avatars Preview */}
              <div className="flex items-center -space-x-3 px-1">
                {eventGuests.slice(0, 3).map((guest, i) => (
                  <div key={guest.id} className="w-9 h-9 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm overflow-hidden">
                    {guest.initials}
                  </div>
                ))}
                {eventGuests.length > 3 && (
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-background-light flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                    +{eventGuests.length - 3}
                  </div>
                )}
              </div>
            </motion.div>
          </Link>
          
          {/* Add Guest Button Overlay */}
          <button 
            onClick={() => setShowAddGuest(true)}
            className="absolute top-6 right-14 w-12 h-12 rounded-xl bg-primary/5 hover:bg-primary/20 text-primary flex items-center justify-center transition-all z-30"
            title="Adicionar Convidado"
          >
            <UserPlus size={20} />
          </button>
        </div>
      </section>

      {/* Add Guest Modal */}
      <AnimatePresence>
        {showAddGuest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-[448px] rounded-t-[32px] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddGuest(false)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:bg-background-light rounded-full"
              >
                <X size={24} />
              </button>
              
              <h3 className="font-display font-bold text-2xl mb-6">Novo Convidado</h3>
              
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Nome Completo</label>
                  <input 
                    type="text" 
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Ex: João Silva"
                    required
                    autoFocus
                    className="w-full h-14 bg-background-light border-none rounded-xl px-4 font-body text-text-main focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full h-14 bg-primary text-white font-display font-bold text-lg rounded-xl shadow-glow hover:bg-primary-dark transition-all mt-4"
                >
                  Salvar Convidado
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
