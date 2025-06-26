import React, { useEffect, useRef } from 'react'
import "../styles/WhatsappButton.css"

// Este componente recibe un número de WhatsApp y un mensaje opcional
export const WhatsappButton = ({phoneNumber, message}) => {

  const buttonRef = useRef(null);//se referencia boton

  // Cada 5 segundos , añadimos la clase 'jump' para animar el botón
  useEffect (()=> { 
  const interval = setInterval(() => {

    const btn = buttonRef.current;
    if(btn){
      btn.classList.add("jump");// Añade la clase que activa la animación

      setTimeout(() => {
        btn.classList.remove("jump")// Luego de que termina la animación (0.6s), la removemos para poder reiniciarla
      }, 600);
    }
  }, 5000);// salta cada 5 seg

  // Limpiamos el intervalo cuando se desmonta el componente
  return () => clearInterval(interval);
},[]);



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
    ref={buttonRef}
    className='whatsapp-btn'
    onClick={handleClick}
    title='Chatea con el proveedor'>
        <i className="whatsapp-icon fa-brands fa-whatsapp" alt="Boton de whatsapp"></i>
    </button>
  )
}
