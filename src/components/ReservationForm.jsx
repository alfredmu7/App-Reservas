import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import "../styles/ReservationForm.css"

export const ReservationForm = ({productId, dateRange, user}) => {

    //estados para manejar exito y errores
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();


    
  // Función para manejar el envío de la reserva
  const handleSubmit = async(e) =>{
    e.preventDefault();

     // Validamos que el rango de fechas no esté vacío
     const startDate = dateRange?.[0]?.startDate;
     const endDate = dateRange?.[0]?.endDate;

    if (!startDate || !endDate) {
        setError("Selecciona un rango de fechas válido");
        return;
    }

    if(!user){
        const confirm = window.confirm("Debes iniciar sesión para hacer una reserva. ¿Deseas hacerlo?");
        if(confirm){
            navigate("/login");
    }
        return;
    }

    navigate(`/reserve/${productId}`, {
        state:{
            productId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        }
    });

    
}
  return (
    <div className='reservation-form-container'>
        <h3>Confirmar fechas de reserva</h3>

        <form onSubmit={handleSubmit}>
            <p className='reservation-before-after'>
                <strong>Desde:</strong>{dateRange[0].startDate.toLocaleDateString()}<br />
                <strong>Hasta:</strong>{dateRange[0].endDate.toLocaleDateString()}
            </p>

            {/* MENSAJE DE ERROR O EXITO */}
            {error && <p className='error-msg'>{error}</p>}
            {successMsg && <p className='success-msg'>{successMsg}</p>}

            <button className='reservation-btn' type='submit'>Reservar</button>
        </form>
    </div>
  )
}
