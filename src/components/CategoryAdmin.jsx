import React, { useEffect, useState } from 'react'
import "../styles/CategoryAdmin.css"
export const CategoryAdmin = () => {

    const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });

  useEffect(() => {
    fetch("http://localhost:8080/api/categories",{credentials:"include", })
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleAdd = () => {
    fetch("http://localhost:8080/api/categories", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory)
    })
    .then(res => res.json())
    .then(cat => setCategories([...categories, cat]));

    setNewCategory({ name: "", icon: "" });
  };

  
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/categories/${id}`, { 
      credentials:"include", 
      method: "DELETE" 
    })
    .then(() => setCategories(categories.filter(c => c.id !== id)));
  };
  
  const confirmDelete = (id, name) =>{
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la categoría "${name}"?\n\n` +
      "Esto podría eliminar todos los productos asociados a esta categoría. Esta acción no se puede deshacer."
    );
    if(confirmed){handleDelete(id)}
  }

  return (
    <div className="category-admin-container">
      <h2>Gestionar Categorías</h2>

      <input
        placeholder="Nombre"
        value={newCategory.name}
        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
      />
     
      <button onClick={handleAdd}>Agregar</button>

      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => confirmDelete(c.id, c.name)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}