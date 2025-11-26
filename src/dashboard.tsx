import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
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

  // Fetch all todos
  const fetchTodos = async () => {
    const snapshot = await getDocs(collection(db, "todos"));
    const todoList: Todo[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      completed: doc.data().completed,
      uid: doc.data().uid,
    }));
    setTodos(todoList);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim() || !auth.currentUser) return;

    const uid = auth.currentUser.uid;

    await addDoc(collection(db, "todos"), {
      title: newTodo,
      completed: false,
      uid,
    });

    setMessage("✅ Task added!");
    setNewTodo("");
    fetchTodos();
  };

  // Toggle completed status
  const toggleComplete = async (todo: Todo) => {
    const todoRef = doc(db, "todos", todo.id);
    await updateDoc(todoRef, { completed: !todo.completed });
    setMessage(`✅ Task "${todo.title}" updated!`);
    fetchTodos();
  };

  // Delete a todo
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
    setMessage("✅ Task deleted!");
    fetchTodos();
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
    fetchTodos();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h1>To-Do App</h1>

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
                      Mark as Done
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(todo)}
                    >
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
