import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, LogOut, Plus, X, Check, AlertCircle, Clock } from 'lucide-react';

// Authentication state
const initialAuthState: {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string; role: string; avatar: string } | null;
  role: string | null;
} = {
  isAuthenticated: false,
  user: null,
  role: null
};

// Sample data for demonstration
const initialProjects = [
  { id: 'project-1', name: 'Website Redesign', description: 'Redesign company website for better UX' },
  { id: 'project-2', name: 'Mobile App Development', description: 'Create new mobile application for customers' }
];

const initialUsers = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'admin', avatar: '/api/placeholder/40/40' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'developer', avatar: '/api/placeholder/40/40' },
  { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', role: 'designer', avatar: '/api/placeholder/40/40' }
];

const initialColumns = {
  'todo': {
    id: 'todo',
    title: 'To Do',
    taskIds: ['task-1', 'task-2', 'task-5']
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    taskIds: ['task-3']
  },
  'review': {
    id: 'review',
    title: 'Review',
    taskIds: ['task-4']
  },
  'done': {
    id: 'done',
    title: 'Done',
    taskIds: ['task-6']
  }
};

const initialTasks = {
  'task-1': { 
    id: 'task-1', 
    title: 'Create wireframes', 
    description: 'Design initial wireframes for homepage', 
    priority: 'high',
    assignee: 'user-3',
    project: 'project-1',
    dueDate: '2025-05-15'
  },
  'task-2': { 
    id: 'task-2', 
    title: 'Setup project repository', 
    description: 'Initialize GitHub repo with basic structure', 
    priority: 'medium',
    assignee: 'user-2',
    project: 'project-1',
    dueDate: '2025-05-10'
  },
  'task-3': { 
    id: 'task-3', 
    title: 'API Integration', 
    description: 'Connect frontend with backend API endpoints', 
    priority: 'high',
    assignee: 'user-2',
    project: 'project-2',
    dueDate: '2025-05-20'
  },
  'task-4': { 
    id: 'task-4', 
    title: 'User testing', 
    description: 'Conduct usability tests with focus group', 
    priority: 'medium',
    assignee: 'user-1',
    project: 'project-2',
    dueDate: '2025-05-25'
  },
  'task-5': { 
    id: 'task-5', 
    title: 'Performance optimization', 
    description: 'Optimize loading speed and responsiveness', 
    priority: 'low',
    assignee: null,
    project: 'project-1',
    dueDate: '2025-06-01'
  },
  'task-6': { 
    id: 'task-6', 
    title: 'Design logo', 
    description: 'Create logo for mobile app', 
    priority: 'medium',
    assignee: 'user-3',
    project: 'project-2',
    dueDate: '2025-05-05'
  }
};

// Initial notification messages
const initialNotifications = [
  { id: 'notif-1', text: 'Jane assigned you a new task', read: false, time: '10 minutes ago' },
  { id: 'notif-2', text: 'Project deadline updated', read: true, time: '1 hour ago' },
  { id: 'notif-3', text: 'New comment on "Create wireframes"', read: false, time: '3 hours ago' }
];

// Custom Draggable component to simulate react-beautiful-dnd
const Draggable = ({ id, index, children, onDragStart }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, source: index }));
    if (onDragStart) onDragStart(id, index);
  };
  
  return (
    <div 
      draggable 
      onDragStart={handleDragStart} 
      className="cursor-move"
    >
      {children}
    </div>
  );
};

// Custom Droppable component to simulate react-beautiful-dnd
const Droppable = ({ id, children, onDrop }) => {
  const [isOver, setIsOver] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (onDrop) onDrop(data.id, data.source, id);
  };
  
  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${isOver ? 'bg-blue-50' : ''} transition-colors`}
    >
      {children}
    </div>
  );
};

// Main App Component
export default function TaskManagementApp() {
  const [authState, setAuthState] = useState(initialAuthState);
  const [projects, setProjects] = useState(initialProjects);
  const [users, setUsers] = useState(initialUsers);
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [currentProject, setCurrentProject] = useState(projects[0]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: string;
    assignee: string | null;
    project: string | undefined;
    dueDate: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: null,
    project: currentProject?.id,
    dueDate: ''
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password');
  const [loginError, setLoginError] = useState('');

  // For demo purposes, auto-login as admin
  useEffect(() => {
    handleLogin();
  }, []);

  // Login handler
  const handleLogin = () => {
    // In a real app, this would validate against a backend
    const user = users.find(u => u.email === email);
    if (user) {
      setAuthState({
        isAuthenticated: true,
        user: user,
        role: user.role
      });
    } else {
      setLoginError('Invalid credentials');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setAuthState(initialAuthState);
  };

  // Handle task drop between columns
  const handleTaskDrop = (taskId, sourceIndex, targetColumnId) => {
    // Find which column the task is coming from
    let sourceColumnId = '';
    for (const [colId, column] of Object.entries(columns)) {
      if (column.taskIds.includes(taskId)) {
        sourceColumnId = colId;
        break;
      }
    }
    
    if (sourceColumnId === targetColumnId) return;
    
    // Remove from source column
    const sourceColumn = columns[sourceColumnId];
    const newSourceTaskIds = sourceColumn.taskIds.filter(id => id !== taskId);
    
    // Add to target column
    const targetColumn = columns[targetColumnId];
    const newTargetTaskIds = [...targetColumn.taskIds, taskId];
    
    // Update columns state
    setColumns({
      ...columns,
      [sourceColumnId]: {
        ...sourceColumn,
        taskIds: newSourceTaskIds
      },
      [targetColumnId]: {
        ...targetColumn,
        taskIds: newTargetTaskIds
      }
    });
    
    // Create notification for task movement
    const task = tasks[taskId];
    const newNotification = {
      id: `notif-${Date.now()}`,
      text: `Task "${task.title}" moved to ${targetColumn.title}`,
      read: false,
      time: 'Just now'
    };
    
    setNotifications([newNotification, ...notifications]);
  };

  // Handle creating a new task
  const handleCreateTask = () => {
    if (!newTask.title) return;
    
    const taskId = `task-${Date.now()}`;
    const newTaskObj = {
      id: taskId,
      ...newTask
    };

    // Add task to tasks state
    setTasks({
      ...tasks,
      [taskId]: newTaskObj
    });

    // Add task to the todo column
    const todoColumn = columns['todo'];
    setColumns({
      ...columns,
      'todo': {
        ...todoColumn,
        taskIds: [...todoColumn.taskIds, taskId]
      }
    });

    // Create notification
    const newNotification = {
      id: `notif-${Date.now()}`,
      text: `New task "${newTask.title}" created`,
      read: false,
      time: 'Just now'
    };
    
    setNotifications([newNotification, ...notifications]);

    // Close modal and reset form
    setShowModal(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: null,
      project: currentProject?.id,
      dueDate: ''
    });
  };

  // Functions to open different modal types
  const openNewTaskModal = () => {
    setModalType('newTask');
    setShowModal(true);
    setNewTask({
      ...newTask,
      project: currentProject?.id
    });
  };

  // Show login screen if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to Workflow Manager
            </h2>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {loginError && (
              <div className="text-red-500 text-sm">
                {loginError}
              </div>
            )}

            <div>
              <button
                onClick={handleLogin}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
            
            <div className="text-sm text-center text-gray-500">
              For demo purposes: john@example.com / password
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Workflow Manager</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell size={20} className="text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">No notifications</div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                        >
                          <div className="text-sm text-gray-800">{notification.text}</div>
                          <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              {authState.user && (
              <>
                <img 
                src={authState.user.avatar} 
                alt={authState.user.name}
                className="h-8 w-8 rounded-full mr-2"
                />
                <span className="text-gray-700 font-medium">{authState.user.name}</span>
              </>
              )}
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <LogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Project Selection */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
                Current Project
              </label>
              <select
                id="project-select"
                className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={currentProject?.id}
                onChange={(e) => {
                  const selectedProject = projects.find(p => p.id === e.target.value);
                  setCurrentProject(selectedProject || currentProject);
                }}
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={openNewTaskModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              New Task
            </button>
          </div>
          
          {/* Project Description */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800">{currentProject?.name}</h2>
            <p className="text-gray-600 mt-1">{currentProject?.description}</p>
          </div>
          
          {/* Kanban Board */}
          <div className="grid grid-cols-4 gap-4">
            {Object.values(columns).map(column => (
              <div key={column.id} className="bg-gray-100 rounded-lg">
                <h3 className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200 bg-gray-200 rounded-t-lg">
                  {column.title} ({column.taskIds.filter(taskId => tasks[taskId]?.project === currentProject?.id).length})
                </h3>
                
                <Droppable 
                  id={column.id} 
                  onDrop={handleTaskDrop}
                >
                  <div className="p-2 min-h-64">
                    {column.taskIds.map((taskId, index) => {
                      const task = tasks[taskId];
                      // Skip tasks that don't belong to the current project
                      if (task.project !== currentProject?.id) return null;
                      
                      return (
                        <Draggable 
                          key={taskId} 
                          id={taskId} 
                          index={index}
                          onDragStart={() => {}}
                        >
                          <div
                            className="bg-white p-3 rounded shadow-sm mb-2 border-l-4 border-blue-500"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-800">{task.title}</h4>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                            
                            <div className="mt-3 flex justify-between items-center">
                              {task.assignee ? (
                                <div className="flex items-center">
                                  <img 
                                    src={users.find(u => u.id === task.assignee)?.avatar} 
                                    alt="Assignee" 
                                    className="h-6 w-6 rounded-full mr-1"
                                  />
                                  <span className="text-xs text-gray-500">
                                    {users.find(u => u.id === task.assignee)?.name}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Unassigned</span>
                              )}
                              
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock size={12} className="mr-1" />
                                {task.dueDate}
                              </div>
                            </div>
                          </div>
                        </Draggable>
                      );
                    })}
                  </div>
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal for creating new task */}
      {showModal && modalType === 'newTask' && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <select
                    id="assignee"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newTask.assignee || ''}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value || null})}
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!newTask.title}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}