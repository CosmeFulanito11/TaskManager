import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Calendar, Tag, Filter, Search, Clock, AlertCircle } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('media');
  const [newTaskCategory, setNewTaskCategory] = useState('personal');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todas');
  const [filterPriority, setFilterPriority] = useState('todas');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  // Cargar tareas del localStorage al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      title: newTask,
      description: newTaskDescription,
      completed: false,
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: newTaskDueDate,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setNewTaskDescription('');
    setNewTaskPriority('media');
    setNewTaskCategory('personal');
    setNewTaskDueDate('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingTask(task);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetTask) => {
    if (!draggedTask || draggedTask.id === targetTask.id) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = tasks.findIndex(t => t.id === targetTask.id);

    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    setTasks(newTasks);
    setDraggedTask(null);
  };

  // Filtros
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = 
      filterStatus === 'todas' ? true :
      filterStatus === 'completadas' ? task.completed :
      !task.completed;

    const matchesPriority = 
      filterPriority === 'todas' ? true : task.priority === filterPriority;

    const matchesCategory = 
      filterCategory === 'todas' ? true : task.category === filterCategory;

    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  // Estadísticas
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'alta': return 'from-red-500 to-orange-500';
      case 'media': return 'from-yellow-500 to-orange-500';
      case 'baja': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'trabajo': return '💼';
      case 'personal': return '👤';
      case 'estudio': return '📚';
      case 'salud': return '❤️';
      default: return '📋';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Gestor de Tareas
        </h1>
        <p className="text-gray-400">Organiza tu día de manera eficiente</p>
      </div>

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completadas</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-gray-400">Pendientes</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-red-400">{stats.overdue}</div>
          <div className="text-sm text-gray-400">Vencidas</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Formulario de Nueva Tarea */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 sticky top-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Nueva Tarea
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Nombre de la tarea..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Detalles de la tarea..."
                  rows="3"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prioridad</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="personal">Personal</option>
                    <option value="trabajo">Trabajo</option>
                    <option value="estudio">Estudio</option>
                    <option value="salud">Salud</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha límite</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={addTask}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar Tarea
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="lg:col-span-2">
          {/* Filtros */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" />
              <h3 className="text-xl font-bold">Filtros</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todas">Todas</option>
                <option value="pendientes">Pendientes</option>
                <option value="completadas">Completadas</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todas">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todas">Todas las categorías</option>
                <option value="personal">Personal</option>
                <option value="trabajo">Trabajo</option>
                <option value="estudio">Estudio</option>
                <option value="salud">Salud</option>
              </select>
            </div>
          </div>

          {/* Tareas */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-xl text-gray-400">No hay tareas que coincidan con los filtros</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(task)}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all cursor-move hover:scale-[1.02] ${
                    task.completed 
                      ? 'border-green-500/30 opacity-70' 
                      : 'border-slate-700/50 hover:border-purple-500/50'
                  }`}
                >
                  {editingTask && editingTask.id === task.id ? (
                    // Modo edición
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                        rows="2"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo vista
                    <>
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-500 hover:border-purple-500'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4" />}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(task)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {task.description && (
                            <p className={`text-gray-400 mb-3 ${task.completed ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm bg-slate-700/50 border border-slate-600">
                              {getCategoryIcon(task.category)} {task.category}
                            </span>
                            {task.dueDate && (
                              <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                                isOverdue(task.dueDate) && !task.completed
                                  ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                                  : 'bg-slate-700/50 border border-slate-600'
                              }`}>
                                <Calendar className="w-4 h-4" />
                                {new Date(task.dueDate).toLocaleDateString('es-ES')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>💡 Tip: Arrastra las tareas para reordenarlas</p>
      </div>
    </div>
  );
};

export default TaskManager;