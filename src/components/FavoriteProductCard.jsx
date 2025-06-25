import React, { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import "../styles/FavoriteProductCard.css"
import { useNavigate } from 'react-router-dom';

export const FavoriteProductCard = ({product, isFavorite, onToggleFavorite, user}) => {

    const navigate = useNavigate();
    
    
     const handleFavoriteClick = () => {
        
            if(!user){
                const confirm = window.confirm("Debes iniciar sesión para guardar tus favoritos. ¿Deseas hacerlo?");
                if(confirm){
                    navigate("/login");
            }
            return;
            }
            
            onToggleFavorite(product.id, isFavorite);
        }


  return (
    <div className='product-cards'>
        <button className='favorite-btn' onClick={handleFavoriteClick} aria-label='Marcar como favorito'>
            {
                isFavorite 
                ? <FaHeart className='heart-icon favorite'/> : <FaRegHeart className='heart-icon'/>
            }
        </button>
    </div>
  )
}
