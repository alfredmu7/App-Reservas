import React, { useState } from 'react'
import { ShareModal } from '../pages/ShareModal';
import "../styles/ShareButton.css"
import { useNavigate } from 'react-router-dom';




export const ShareButton = ({product, user}) => {

     // Estado para controlar la visibilidad del modal
     const [isModalOpen, setIsModalOpen] = useState(false);
     const navigate = useNavigate();

     // Si no hay user, preguntar si quiere iniciar sesión
  const handleShareClick = () => {
    if (!user) {
      const confirmLogin = window.confirm("Debes iniciar sesión para compartir. ¿Deseas iniciar sesión ahora?");
      if (confirmLogin) {
        navigate("/login"); 
      }
      return;
    }

    // Si está autenticado, abrimos el modal
    setIsModalOpen(true);
  };

     const closeModal = () => setIsModalOpen(false);


  return (
    <div className='share-button-container'>
        <i className="fa-solid fa-share-from-square share-icon"
        onClick={handleShareClick}
        title='Compartir producto'
        >
        </i>
        {isModalOpen && (<ShareModal 
        product={product} 
        onClose={closeModal}/>)}
    </div>
  )
}
