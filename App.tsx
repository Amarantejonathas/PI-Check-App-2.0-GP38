/**
 * Grupo 38 desenvolvido por 
 * Jonathas Amarante
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './src/screens/Dashboard';
import Calendar from './src/screens/Calendar';
import EventHub from './src/screens/EventHub';
import TaskList from './src/screens/TaskList';
import GuestList from './src/screens/GuestList';
import CreateEvent from './src/screens/CreateEvent';
import Login from './src/screens/Login';
import Register from './src/screens/Register';

import { Event, Task, Guest } from './types';
import { useState, useEffect } from 'react';
import { supabase } from './src/services/supabase';

export default function App() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Lançamento do Produto',
      date: '12 de Outubro',
      time: '19:00',
      location: 'Rua das Flores, 123',
      description: 'Evento oficial de lançamento da versão 2.0.',
      type: 'Reunião',
      progress: 75,
      status: 'ATIVO'
    },
    {
      id: '2',
      name: 'Festa de Aniversário',
      date: '25 de Outubro',
      time: '21:00',
      location: 'Salão de Festas',
      description: 'Comemoração de 10 anos da empresa.',
      type: 'Festa',
      progress: 40,
      status: 'ATIVO'
    },
    {
      id: '3',
      name: 'Reunião de Planejamento',
      date: '02 de Novembro',
      time: '09:00',
      location: 'Sala de Reuniões',
      description: 'Definição das metas para o próximo trimestre.',
      type: 'Reunião',
      progress: 10,
      status: 'ATIVO'
    }
  ]);

  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', eventId: '1', name: 'João Silva', role: 'VIP', present: true, initials: 'JS' },
    { id: '2', eventId: '1', name: 'Maria Oliveira', role: 'Mesa 4', present: false, initials: 'MO' },
    { id: '3', eventId: '1', name: 'Carlos Mendes', role: 'Pista', present: false, initials: 'CM' },
    { id: '4', eventId: '1', name: 'Ana Costa', role: 'Acompanhante', present: true, initials: 'AC' },
    { id: '5', eventId: '1', name: 'Paulo Roberto', role: 'VIP', present: false, initials: 'PR' },
    { id: '6', eventId: '1', name: 'Fernanda Souza', role: 'Mesa 2', present: true, initials: 'FS' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', eventId: '1', title: 'Review Q3 budget', completed: true },
    { id: '2', eventId: '1', title: 'Approve design assets', completed: true },
    { id: '3', eventId: '1', title: 'Send client update', completed: false },
    { id: '4', eventId: '1', title: 'Schedule team sync', completed: false },
    { id: '5', eventId: '1', title: 'Prepare presentation slides', completed: false },
  ]);

  // 🔥 SUPABASE STATE
  const [todos, setTodos] = useState<any[]>([]);

  // 🔥 SUPABASE USEEFFECT (CORRETO)
  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await supabase
        .from('todos')
        .select('*');

      if (error) {
        console.error('Erro ao buscar todos:', error.message);
        return;
      }

      if (data) {
        setTodos(data);
      }
    }

    loadTodos();
  }, []);

  // EVENTS
  const addEvent = (event: Event) => setEvents([...events, event]);
  const deleteEvent = (eventId: string) => setEvents(events.filter(e => e.id !== eventId));

  // GUESTS
  const addGuest = (guest: Guest) => setGuests([...guests, guest]);
  const toggleGuestCheckin = (guestId: string) =>
    setGuests(guests.map(g => g.id === guestId ? { ...g, present: !g.present } : g));
  const deleteGuest = (guestId: string) =>
    setGuests(guests.filter(g => g.id !== guestId));

  // TASKS
  const addTask = (task: Task) => setTasks([...tasks, task]);
  const toggleTask = (taskId: string) =>
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  const deleteTask = (taskId: string) =>
    setTasks(tasks.filter(t => t.id !== taskId));

  return (
    <Router>
      <div className="min-h-screen bg-background-light flex flex-col max-w-[448px] mx-auto shadow-xl relative overflow-x-hidden">

        {/* 🔥 TESTE OPCIONAL DO SUPABASE */}
        <div className="p-3 text-sm bg-white border">
          <strong>Todos do Supabase:</strong>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.name ?? todo.title}</li>
            ))}
          </ul>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard events={events} onDelete={deleteEvent} tasks={tasks} />} />
          <Route path="/calendar" element={<Calendar events={events} />} />
          <Route path="/event/:id" element={<EventHub events={events} onDelete={deleteEvent} guests={guests} onAddGuest={addGuest} tasks={tasks} />} />
          <Route path="/event/:id/tasks" element={<TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} onAddTask={addTask} />} />
          <Route path="/event/:id/guests" element={<GuestList guests={guests} onToggleCheckin={toggleGuestCheckin} onDeleteGuest={deleteGuest} />} />
          <Route path="/create" element={<CreateEvent onAdd={addEvent} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
