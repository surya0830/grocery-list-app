import React, { useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() !== '') {
      setItems([...items, { id: Date.now(), text: newItem, completed: false }]);
      setNewItem('');
    }
  };

  const toggleItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="App">
      <h1>Grocery List</h1>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
            />
            <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
              {item.text}
            </span>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App; 