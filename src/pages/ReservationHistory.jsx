import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/ReservationHistory.css"

export const ReservationHistory = () => {

    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchReservations = async() => {
            try{
                const res = await fetch("http://localhost:8080/api/reservations/user",{
                    method: "GET",
                    credentials:"include"
                });
                if(!res.ok){
                    throw new Error("No se pudo obtener el historial de reservas");
                };
    
                const data = await res.json();
                setReservations(data);
    
            }catch(err){
                console.error("Error al obtener las reservas:" , err);
                setError(err.message || "Error desconocido.")
            };
        };
    
        fetchReservations();
    },[]);
    

  return (
    <div className='reservation-history-container'>
        <h2>Mi historial de reservas</h2>

        {/* mostramos el error */}
        {error && <p className='error-msg'>{error}</p>}

        {/* si no hay reservas */}
        {!error && reservations.length === 0 && (
            <p>No tienes reservas realizadas aún.</p>
        )}

        {/* lista de reservas */}
        <ul className='reservation-list'>
            {reservations.map((res)=>(
                <li 
                key={res.id}
                className='reservation-item'
                >
                    <h3>{res.product?.name || "Producto desconocido"}</h3>
                    <p><strong>Fecha de reserva:</strong>{new Date(res.createdAt).toLocaleDateString()}</p>
                    <p><strong>Desde:</strong>{new Date(res.startDate).toLocaleDateString()}</p>
                    <p><strong>Hasta:</strong>{new Date(res.endDate).toLocaleDateString()}</p>
                </li>
            ))}
        </ul>

            <button className='reservation-history-btn' onClick={()=> navigate("/")}>Volver al inicio</button>
    </div>
  )
}
