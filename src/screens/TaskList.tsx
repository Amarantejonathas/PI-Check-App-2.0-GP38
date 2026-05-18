import { ArrowLeft, Check, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Task } from '../types';
import { supabase } from '../services/supabase';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: Task) => void;
}

export default function TaskList({
  tasks: allTasks,
  onToggleTask,
  onDeleteTask,
  onAddTask
}: TaskListProps) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('event_id', id);

    if (error) {
      console.error('Erro ao buscar tasks:', error);
      return;
    }

    setTasks(
      (data || []).map((task: any) => ({
        id: task.id,
        eventId: task.event_id,
        title: task.title,
        completed: task.completed,
      }))
    );
  };

  const deleteTask = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteTask(taskId);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !id) return;

    onAddTask({
      id: Date.now().toString(),
      eventId: id,
      title: inputValue,
      completed: false
    });

    setInputValue('');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  const progress =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0;

  return (
    <div className="flex-1 flex flex-col h-screen bg-background-light overflow-hidden">

      {/* HEADER */}
      <header className="bg-white border-b border-border-light p-4 flex items-center shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-background-light rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="flex-1 text-center font-display font-bold text-lg pr-10">
          Check-App
        </h1>

        <Link
          to={`/event/${id}/guests`}
          className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
        >
          Convidados
        </Link>
      </header>

      {/* PROGRESS */}
      <section className="bg-white p-6 shadow-sm border-b border-border-light z-10 shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-text-main">
            Progresso do Evento
          </h2>

          <span className="text-sm font-bold text-primary font-display">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-background-light h-2.5 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </section>

      {/* TASK LIST */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2 pb-28">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.label
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center h-16 bg-white px-5 rounded-xl border border-border-light shadow-sm cursor-pointer hover:border-primary/40 transition-all group"
            >
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  className="peer sr-only"
                />

                <div className={`
                  w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all
                  ${task.completed
                    ? 'bg-primary border-primary'
                    : 'border-text-muted group-hover:border-primary'}
                `}>
                  <Check
                    size={14}
                    className={`text-white transition-opacity ${
                      task.completed ? 'opacity-100' : 'opacity-0'
                    }`}
                    strokeWidth={3}
                  />
                </div>
              </div>

              <span className={`
                ml-4 flex-1 transition-all font-body
                ${task.completed
                  ? 'text-text-muted line-through'
                  : 'text-text-main font-medium'}
              `}>
                {task.title}
              </span>

              <button
                onClick={(e) => deleteTask(e, task.id)}
                className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </motion.label>
          ))}
        </AnimatePresence>
      </main>

      {/* ADD TASK */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[448px] bg-background-light p-4 border-t border-border-light shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-20">
        <form onSubmit={addTask} className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 h-14 bg-white border border-border-light px-5 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-text-muted"
          />

          <button
            type="submit"
            className="w-16 h-14 bg-primary text-white flex items-center justify-center rounded-r-xl shadow-glow hover:bg-primary-dark transition-colors"
          >
            <Send size={24} />
          </button>
        </form>
      </footer>
    </div>
  );
}
