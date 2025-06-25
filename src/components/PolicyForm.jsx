import React, { useEffect, useState } from 'react'
import "../styles/PolicyForm.css"

export const PolicyForm = () => {

    const [policies, setPolicies] = useState([]);
    const [form, setForm] = useState({title: "", description: "", id: null});


    useEffect(() => {
        fetch('http://localhost:8080/api/policies', {credentials:"include"})
          .then(res => res.json())
          .then(setPolicies);
      }, []);

      const handleChange = (e) => {
        setForm({ ...form, [e.target.name] : e.target.value});
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const method = form.id ? "PUT" : "POST";
        const url = form.id ? `http://localhost:8080/api/policies/${form.id}` : "http://localhost:8080/api/policies";

      

      fetch(url, {
        method,
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then(() => {
          setForm({ title: "", description: "", id: null });
          return fetch("http://localhost:8080/api/policies", {credentials:"include"});
        })
        .then(res => res.json())
        .then(setPolicies);
    };
    const handleEdit = (policy) => {
        setForm({
          id: policy.id,
          title: policy.title,
          description: policy.description
        });
      };

      const handleDelete = (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta política?")) return;
      
        fetch(`http://localhost:8080/api/policies/${id}`, {
          method: "DELETE",
          credentials:"include"
        })
          .then(() => {
            // Recarga la lista después de eliminar
            return fetch("http://localhost:8080/api/policies", {credentials:"include"});
          })
          .then(res => res.json())
          .then(setPolicies)
          .catch(err => console.error("Error al eliminar política:", err));
      };

  return (
    <div className='admin-policy-panel'>
        <h2>Políticas del servicio</h2>
        <form onSubmit={handleSubmit} className='policy-form'>
            <input
            name='title'
            placeholder='Título'
            value={form.title}
            onChange={handleChange}
            required
            />
            <textarea 
            name="description"
            placeholder='Descripción'
            value={form.description}
            onChange={handleChange}
            required
            ></textarea>
            <button type='submit'>{form.id ? "Actualizar" : "Agregar"}</button>
        </form>
        <div className='policy-list'>
            {policies.map(p => (
                <div key={p.id} className='policy-item'>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className='policy-actions'>
                        <button className="btn-policy-edit" onClick={() => handleEdit(p)}>Editar</button>
                        <button className="btn-policy-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
                    </div>
                    </div>
                ))}
            </div>
        </div>
  )
}
