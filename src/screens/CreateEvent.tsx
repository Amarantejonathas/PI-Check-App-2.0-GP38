import {
  MapPin,
  Clock,
  Calendar as CalendarIcon,
} from 'lucide-react';

import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Event } from '../types';
import { supabase } from '../services/supabase';

interface CreateEventProps {
  onAdd?: (event: Event) => void;
}

export default function CreateEvent({
  onAdd,
}: CreateEventProps) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [formData, setFormData] =
    useState<Partial<Event>>({
      name: '',
      type: 'Festa',
      date: '',
      time: '',
      location: '',
      description: '',
    });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.name || !formData.date) {
      setErrorMessage(
        'Nome e data são obrigatórios.'
      );
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Usuário autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          'Usuário não autenticado.'
        );
      }

      // Inserir evento
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          name: formData.name,
          type: formData.type,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          description: formData.description,
          progress: 0,
          status: 'ATIVO',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Evento criado
      const newEvent: Event = {
        id: data.id,
        name: data.name,
        type: data.type,
        date: data.date,
        time: data.time,
        location: data.location,
        description: data.description,
        progress: data.progress,
        status: data.status,
      };

      // Atualiza estado local se existir
      if (onAdd) {
        onAdd(newEvent);
      }

      navigate('/');
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error.message ||
          'Erro ao criar evento.'
      );
    } finally {
      setLoading(false);
    }
  };

  const types: Event['type'][] = [
    'Festa',
    'Reunião',
    'Estudo',
    'Outro',
  ];

  return (
    <div className="flex-1 flex flex-col h-screen bg-white overflow-hidden">
      {/* HEADER */}
      <header className="p-4 flex items-center justify-end shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-bold text-base hover:underline"
        >
          Cancelar
        </button>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="p-6 pt-0 space-y-6 flex-1 overflow-y-auto">
          {/* TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <input
              type="text"
              placeholder="Nome do Evento"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              autoFocus
              className="w-full text-4xl font-display font-bold border-none p-0 focus:ring-0 placeholder:text-text-muted/40"
            />
          </motion.div>

          {/* TYPE */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: t,
                  })
                }
                className={`
                  h-10 px-6 rounded-lg font-display font-bold text-sm whitespace-nowrap transition-all
                  ${
                    formData.type === t
                      ? 'bg-primary text-white shadow-glow'
                      : 'bg-background-light border border-border-light text-text-main'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Data
              </label>

              <div className="relative flex items-center">
                <CalendarIcon
                  size={18}
                  className="absolute left-4 text-text-muted pointer-events-none"
                />

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  className="w-full h-14 bg-white border border-border-light rounded-xl pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                Hora
              </label>

              <div className="relative flex items-center">
                <Clock
                  size={18}
                  className="absolute left-4 text-text-muted pointer-events-none"
                />

                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time: e.target.value,
                    })
                  }
                  className="w-full h-14 bg-white border border-border-light rounded-xl pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Localização
            </label>

            <div className="relative flex items-center">
              <MapPin
                size={18}
                className="absolute left-4 text-text-muted pointer-events-none"
              />

              <input
                type="text"
                placeholder="Adicionar local"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                className="w-full h-14 bg-white border border-border-light rounded-xl pl-12 pr-4 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2 pb-24">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              Descrição (Opcional)
            </label>

            <div className="relative border border-border-light rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <textarea
                rows={4}
                placeholder="Detalhes adicionais sobre o evento..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full bg-transparent border-none p-4 text-sm font-medium focus:ring-0 outline-none resize-none"
              />
            </div>
          </div>

          {/* ERROR */}
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">
              {errorMessage}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[448px] p-6 bg-white/95 backdrop-blur-sm border-t border-border-light z-30">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary text-white font-display font-bold text-lg rounded-xl shadow-glow hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading
              ? 'Criando Evento...'
              : 'Criar Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}
