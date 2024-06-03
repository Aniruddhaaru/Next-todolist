"use client";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";

async function addTodoToFirebase(title, details, dueDate) {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: title,
      details: details,
      dueDate: dueDate,
      createdAt: serverTimestamp(),
    });
    console.log("Todo item added with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding todo item: ", error);
    return false;
  }
}

async function fetchTodosFromFirestore() {
  const todosCollection = collection(db, "todos");
  const querySnapshot = await getDocs(query(todosCollection, orderBy("createdAt", "desc")));
  const todos = [];
  querySnapshot.forEach((doc) => {
    const todoData = doc.data();
    todos.push({ id: doc.id, ...todoData });
  });
  return todos;
}

async function deleteTodoFromFirestore(todoId) {
  try {
    console.log("Attempt to delete todo", todoId);
    await deleteDoc(doc(db, "todos", todoId));
    return todoId;
  } catch (error) {
    console.error("Error deleting todo", error);
  }
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdateMode) {
      if (selectedTodo) {
        try {
          const updatedTodo = {
            title,
            details,
            dueDate,
          };
          const todoRef = doc(db, "todos", selectedTodo.id);
          await updateDoc(todoRef, updatedTodo);
          setTitle("");
          setDetails("");
          setDueDate("");
          setSelectedTodo(null);
          setIsUpdateMode(false);
          alert("Todo Updated");
        } catch (error) {
          console.error("Error", error);
        }
      }
    } else {
      const docRef = await addTodoToFirebase(title, details, dueDate); // Store docRef here
      if (docRef) {
        // Manually update todos state with the new todo
        setTodos(prevTodos => [{ id: docRef.id, title, details, dueDate, createdAt: new Date().toISOString() }, ...prevTodos]);
        setTitle("");
        setDetails("");
        setDueDate("");
        alert("Added successfully");
      }
    }
  };
  

  useEffect(() => {
    async function fetchTodos() {
      const fetchedTodos = await fetchTodosFromFirestore();
      setTodos(fetchedTodos);
    }
    fetchTodos();
  }, []);

 const handleUpdateClick = (todo) => {
  setTitle(todo.title || "");
  setDetails(todo.details || "");
  setDueDate(todo.dueDate || "");
  setSelectedTodo(todo);
  setIsUpdateMode(true);
};

  const handleDeleteClick = async (todoId) => {
    const confirmed = window.confirm("Are you sure you want to delete this todo?");
    if (confirmed) {
      const deletedTodoId = await deleteTodoFromFirestore(todoId);
      if (deletedTodoId) {
       
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== deletedTodoId));
        alert("Todo deleted successfully");
      }
    }
  };
  
  return (
    <main className="flex flex-1 min-h-screen flex-col items-center justify-between md:flex-row">
      <section className="flex-1 flex md:flex-col md:justify-start items-center mx-auto">
        <div className="p-6 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-gray">
          <h2 className="text-center text-2xl font-bold leading-9">
            {isUpdateMode ? "Update your Todo" : "Create a Todo"}
          </h2>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  autoComplete="off"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded border py-2 pl-2 text-gray-800 shadow ring"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Details
              </label>
              <div className="mt-2">
                <textarea
                  id="details"
                  name="details"
                  rows="4"
                  autoComplete="off"
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded border py-2 pl-2 text-gray-800 shadow ring"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Due Date
              </label>
              <div className="mt-2">
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  autoComplete="off"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded border py-2 pl-2 text-gray-800 shadow ring"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                {isUpdateMode ? "Update your Todo" : "Create a Todo"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="md:w1/2 md:max-h-screen overflow-y-auto md:ml-10 mt-20 mx-auto">
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-gray">
          <h2 className="text-center text-2l font-bold leading-9 bg-gray-100">
            Todo List
          </h2>
          <div className="mt-6 space-y-6">
          {todos.map((todo) => (
  <div key={todo.id} className="border p-4 rounded-md shadow-md">
    <h2 className="text-lg font-normal text-gray-500 break-words">
      {todo.title}
    </h2>
    <p className="text-sm text-gray-500">Due Date: {todo.dueDate}</p>
    <p className="text-gray-700 multiline break-words">
      {todo.details}
    </p>
    <div className="mt-4 space-x-6 flex">
      <button
        type="button"
        className="px-3 py-1 text-sm font-semibold bg-blue-400 hover:bg-blue-500 rounded-md"
        onClick={() => handleUpdateClick(todo)}
      >
        Update
      </button>
      <button
        type="button"
        className="px-3 py-1 text-sm font-semibold bg-red-400 hover:bg-red-500 rounded-md"
        onClick={() => handleDeleteClick(todo.id)}
      >
        Delete
      </button>
    </div>
  </div>
))}

          </div>
        </div>
      </section>
        </main>
  );
}
