import { useState, useMemo,useEffect } from 'react';

type Todo = {
  _id: string;
  title: string;
  isDone: boolean;
};

type Filter = 'all' | 'active' | 'completed';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  



  const handleNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };
  

  const handleNewTodoKeyDown = async(e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      const response = await fetch(`https://vercel.com/syeda-tahiras-projects/todo-backend=${newTodo}`,{
        method: "post"
      })
      

      const result = await response.json();
      console.log(result)
      if(result.success){
        setTodos([...todos,result.data])
      }
      setNewTodo('');
    }
  };

  const toggleTodo = async(id: string,done:boolean) => {
    const response = await fetch(`https://vercel.com/syeda-tahiras-projects/todo-backend ${id}?done=${!done}`,{
      method:"put"
    })
    const result = await response.json();
    if(result.success){
setTodos(
      todos.map(todo =>
        todo._id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
    }
    
  };

  const deleteTodo = async(id: string) => {
    const response = await fetch(`https://vercel.com/syeda-tahiras-projects/todo-backend ${id}`,{
      method: "delete"
    })
    const result = await response.json();
    if(result.success){
      setTodos(todos.filter(todo => todo._id !== id));
    }
    
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.isDone));
  };

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.isDone).length;
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.isDone);
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.isDone);
    }
    return todos;
  }, [todos, filter]);

  useEffect(()=>{
    const getProducts = async()=>{
      const response = await fetch(`https://vercel.com/syeda-tahiras-projects/todo-backend`)
      const result = await response.json();
      if(result.success){
        setTodos(result.data);
      }
    }
    getProducts();
  },[])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-sans">
      <div className="w-full max-w-lg px-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold tracking-widest">TODO</h1>
        </header>

        <div className="bg-gray-800 rounded-lg shadow-lg mb-8">
          <input
            className="w-full bg-transparent px-6 py-4 text-lg focus:outline-none"
            type="text"
            placeholder="Create a new todo..."
            value={newTodo}
            onChange={handleNewTodoChange}
            onKeyDown={handleNewTodoKeyDown}
          />
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg">
          {filteredTodos.map(todo => (
            <div
              key={todo._id}
              className="flex items-center px-6 py-4 border-b border-gray-700 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={() => toggleTodo(todo._id,todo.isDone)}
                className="form-checkbox h-6 w-6 bg-transparent rounded-full border-gray-600 text-indigo-500 focus:ring-0"
              />
              <span
                className={`ml-4 text-lg ${
                  todo.isDone ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="ml-auto text-gray-500 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center px-6 py-4 text-gray-500">
            <span>{activeTodosCount} items left</span>
            <div className="hidden sm:flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`${
                  filter === 'all' ? 'text-indigo-500' : ''
                } hover:text-white`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`${
                  filter === 'active' ? 'text-indigo-500' : ''
                } hover:text-white`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`${
                  filter === 'completed' ? 'text-indigo-500' : ''
                } hover:text-white`}
              >
                Completed
              </button>
            </div>
            <button onClick={clearCompleted} className="hover:text-white">
              Clear Completed
            </button>
          </div>
        </div>
        <div className="sm:hidden bg-gray-800 rounded-lg shadow-lg mt-8 flex justify-center items-center px-6 py-4 text-gray-500">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`${
                  filter === 'all' ? 'text-indigo-500' : ''
                } hover:text-white`}
              >
                All
              </button>              
              <button
                onClick={() => setFilter('active')}
                className={`${
                  filter === 'active' ? 'text-indigo-500' : ''
                } hover:text-white`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`${
                  filter === 'completed' ? 'text-indigo-500' : ''
                } hover:text-white`}
              >
                Completed
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;