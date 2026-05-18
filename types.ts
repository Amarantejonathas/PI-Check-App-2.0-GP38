export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'Festa' | 'Reunião' | 'Estudo' | 'Outro';
  progress: number;
  status: 'ATIVO' | 'CONCLUÍDO';
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  completed: boolean;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  role: string;
  present: boolean;
  initials: string;
}
