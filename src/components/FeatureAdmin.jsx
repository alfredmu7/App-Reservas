import React, { useEffect, useState } from 'react'
import "../styles/FeatureAdmin.css"

export const FeatureAdmin = () => {

    const [feature, setFeature] = useState([]);//lista de características para mostrar.
    const [newFeature, setNewFeature] = useState({name:"", icon:""});//formulario de nueva característica.

    //traer info desde el backend
    const fetchFeature = async () => {
        const res= await fetch("http://localhost:8080/api/features", {credentials: "include"});
        const data = await res.json();
        setFeature(data);
    }

    
    useEffect(() => {
      fetchFeature();     
    }, [])
    
    
    const handleAdd = async () => {
        await fetch("http://localhost:8080/api/features",{
            method: "POST",
            credentials:"include",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(newFeature)
        });

        //limpiamos 
        setNewFeature({name: "", icon: ""});
        fetchFeature();
    }

  
    const handleDelete = async (id) =>{
        await fetch(`http://localhost:8080/api/features/${id}`, {
            method: "DELETE"
        });
        fetchFeature();
    }


  return (
    <div className='feature-admin-container'>
        <h2 className='feature-admin-tittle'>Gestion de carcaterísticas</h2>

        <div className='feature-form'>
            <input 
            type="text"
            placeholder='Nombre'
            value={newFeature.name}
            onChange={(e)=>
                setNewFeature({...newFeature, name: e.target.value})
            }
            className='feature-input'
            />

            <input 
            type="text"
            placeholder='Ícono (Ej: fa-shield-alt)'
            alt='copiar iconos de https://fontawesome.com/icons'
            value={newFeature.icon}
            onChange={(e)=>
                setNewFeature({...newFeature, icon: e.target.value})
            }
            className='feature-input'
            />

            <button className='feature-add-btn' onClick={handleAdd}>Añadir</button>
        </div>
        <ul className='feature-list'>
            <li className='feature-list-icon'><strong>Iconos para cada característica:</strong></li>
            <li className='feature-list-icon'>Garantia: fa-solid fa-award</li>
            <li className='feature-list-icon'>Certificado: fa-solid fa-certificate</li>
            <li className='feature-list-icon'>Disponibilidad 24/7: fa-solid fa-clock</li>
            <li className='feature-list-icon'>viajar: fa-solid fa-plane</li>
            {feature.map((feature) =>(
                <li key={feature.id} className='feature-item'>
                    <span>
                        <strong>{feature.name}</strong> - {feature.icon}
                    </span>
                    <button className='feature-delete-btn' onClick={() => handleDelete(feature.id)}>
                    Eliminar
                    </button>
                </li>
            ))}
        </ul>
    </div>
  )
}
