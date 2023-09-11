import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "./firebase.config";

const Todo = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "todos"), {
        todo: todo,
      });
      console.log("Document written with ID: ", docRef.id);
      setTodo(""); // Очистка поля ввода после добавления
      fetchTodos(); // Обновляем список задач после добавления
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchTodos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "todos"));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodos(newData);
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      fetchTodos(); // После удаления обновляем список задач
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <section className="todo-container">
      <div className="todo">
        <h1 className="header">Todo-App</h1>

        <div>
          <div>
            <input
              type="text"
              placeholder="What do you have to do today?"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            />
          </div>

          <div className="btn-container">
            <button type="submit" className="btn" onClick={addTodo}>
              Submit
            </button>
          </div>
        </div>

        <div className="todo-content">
          {todos?.map((todoItem) => (
            <div key={todoItem.id}>
              <p>{todoItem.todo}</p>
              <button onClick={() => deleteTodo(todoItem.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Todo;
