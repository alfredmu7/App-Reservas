import React, { useEffect, useState } from 'react'
import "../styles/MyProfile.css"

export const MyProfile = () => {

// Estado local para guardar los datos del usuario
const [user, setUser] = useState(null);

// Al montar el componente, obtenemos el usuario desde localStorage (puedes cambiar esto si usas contexto global)
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser)); // Parseamos el JSON para convertirlo a objeto JS
  }
}, []);

// Si no hay usuario cargado, muestra un mensaje (o podrías redirigir al login)
if (!user) {
  return <p>Cargando perfil...</p>;
}

// Calculamos las iniciales para el avatar
const initials = `${user.name[0] || ""}${user.lastName[0] || ""}`.toUpperCase();

return (
  <div className="perfil-container">
    <h1>Mi Perfil</h1>

    <div className="perfil-avatar">{initials}</div>
 
    <div className="perfil-info">
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Apellido:</strong> {user.lastName}</p>
      <p><strong>Correo:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.roles.join(", ")}</p>
    </div>
  </div>
);
}
