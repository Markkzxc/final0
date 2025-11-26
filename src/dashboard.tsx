import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import "./dashboard.css";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  uid: string;
}

const Dashboard: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  
  const navigate = useNavigate();

  // --- 1. SECURITY GUARD: Check Auth State on Load ---
  useEffect(() => {
    // This listener runs whenever the component mounts (even via Back button)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in? Great, fetch their data.
        fetchTodos(user.uid);
        setLoading(false);
      } else {
        // User is NOT logged in? KICK THEM OUT immediately.
        // { replace: true } prevents them from clicking "Back" to return here.
        navigate("/", { replace: true }); 
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Fetch all todos (Moved logic to accept UID directly)
  const fetchTodos = async (uid: string) => {
    const q = query(collection(db, "todos"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    const todoList: Todo[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      completed: doc.data().completed,
      uid: doc.data().uid,
    } as Todo));

    setTodos(todoList);
  };

  // --- 2. UPDATED LOGOUT FUNCTION ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear local state
      setTodos([]);
      sessionStorage.clear();
      
      // Navigate to Login and REPLACE the history entry
      // This wipes the "Dashboard" from the browser's "Back" stack
      navigate("/", { replace: true });
      
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Add a new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim() || !auth.currentUser) return;
    const uid = auth.currentUser.uid;
    
    // Optimistic UI update (optional, but feels faster)
    await addDoc(collection(db, "todos"), {
      title: newTodo,
      completed: false,
      uid,
    });

    setMessage("✅ Task added!");
    setNewTodo("");
    fetchTodos(uid);
  };

  // Toggle completed status
  const toggleComplete = async (todo: Todo) => {
    const todoRef = doc(db, "todos", todo.id);
    await updateDoc(todoRef, { completed: !todo.completed });
    setMessage(`✅ Task "${todo.title}" updated!`);
    if(auth.currentUser) fetchTodos(auth.currentUser.uid);
  };

  // Delete a todo
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
    setMessage("✅ Task deleted!");
    if(auth.currentUser) fetchTodos(auth.currentUser.uid);
  };

  // Start editing a todo
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  // Save edited todo
  const saveEdit = async (id: string) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, { title: editingTitle });
    setEditingId(null);
    setEditingTitle("");
    setMessage("✅ Task updated!");
    if(auth.currentUser) fetchTodos(auth.currentUser.uid);
  };

  // Prevent rendering the dashboard while checking auth
  if (loading) {
    return <div className="loading-screen">Loading...</div>; 
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>To-Do App</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="todo-input">
          <input
            type="text"
            placeholder="Enter a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={handleAddTodo}>Add Task</button>
        </div>

        {message && <p className="message">{message}</p>}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              {editingId === todo.id ? (
                <input
                  className="edit-input"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
              ) : (
                <span>{todo.title}</span>
              )}

              <div className="todo-actions">
                {!todo.completed && editingId !== todo.id && (
                  <>
                    <button
                      className="done-btn"
                      onClick={() => toggleComplete(todo)}
                    >
                      Done
                    </button>
                    <button className="edit-btn" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                  </>
                )}

                {editingId === todo.id && (
                  <button
                    className="save-btn"
                    onClick={() => saveEdit(todo.id)}
                  >
                    Save
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;