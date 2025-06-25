import React, { useEffect, useState } from 'react'
import "../styles/UserManagementPanel.css"

export const UserManagementPanel = () => {

    const [users, setUsers] = useState([]);

    // Cargar los usuarios cuando se monta el componente
    useEffect(() => {
      fetch("http://localhost:8080/api/users", {
        credentials: "include",
        })
        .then(res => {
            if(!res.ok){
                throw new Error("Error al obtener usuario");
            }
            return res.json();
        })
        .then(data => setUsers(data))
        .catch(err => {
            console.error("Error al cargar usuarios:", err);
        });
    }, []);

    // Alternar rol de administrador
    const toggleAdmin = (id)=>{
        
        fetch(`http://localhost:8080/api/users/${id}/toggle-admin`,{
            method: "PUT",
            credentials:"include",
        })
            .then(res => {
                if(!res.ok){
                    throw new Error("Error al actualizar el rol del usuario");
                }
                return res.json()
            })
            .then(updateUser => {
                // Actualizamos la lista local con el usuario actualizado
                 setUsers(users.map(user => user.id === updateUser.id ? updateUser : user));
            })
            .catch(err => {
                console.error("Error al actualizar el usuario" , err);
            });
           }
   
  return (
    <div className="user-management-panel">
        <h2>Gestion de usuarios</h2>

        <table className="user-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user =>(
                    <tr key={user.id}>
                        <td data-label='Nombre'>{user.name} {user.lastName}</td>
                        <td data-label='Email'>{user.email}</td>
                        <td data-label='Rol'className={user.roles.includes('ADMIN') ? 'admin-role' : 'user-role'}>
                            
                            {/* mostramo ssi es admin o user */}
                            {user.roles.includes('ADMIN') ? 'Administrador' : 'Usuario'}
                        </td>
                        <td  data-label='Acción'>
                        <button
                            className='toggle-button'
                            onClick={() => toggleAdmin(user.id)}
                            >
                            {user.roles.includes('ADMIN') ? 'Quitar Admin' : 'Asignar Admin'}
                        </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}
