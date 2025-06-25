import React from 'react'
import "../styles/WhatsappButton.css"

// Este componente recibe un número de WhatsApp y un mensaje opcional
export const WhatsappButton = ({phoneNumber, message}) => {


    const handleClick = () => {

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message || "")}`;// encodeURIComponent asegura que los espacios y caracteres especiales se codifiquen correctamente

        try{

            // Abre la URL de WhatsApp en una nueva pestaña
            window.open(url, "_blank");

            //alerta de confirmación 
            alert("Se ha abierto Whatsapp correctamente.")
      

        }catch(err){
        alert("Hubo un error al intentar abrir WhatsApp. Verifica tu conexión o número.");
        console.error("Error al abrir Whatsapp:", err);
        }
    }

  return (
    <button
    className='whatsapp-btn'
    onClick={handleClick}
    title='Chatea con el proveedor'>
        <i className="whatsapp-icon fa-brands fa-whatsapp" alt="Boton de whatsapp"></i>
    </button>
  )
}
