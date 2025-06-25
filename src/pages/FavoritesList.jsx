import React, { useContext, useEffect } from 'react'
import "../styles/FavoritesList.css"
import { FavoriteContext } from '../components/FavoriteContext';

export const FavoritesList = () => {

    const {favorites, setFavorites} = useContext(FavoriteContext);

    //cargar los fav 
    const fetchFavorites = async () => {
        try{
            const res = await fetch("http://localhost:8080/api/favorites", {credentials:"include"});
            if(!res.ok) throw new Error("Error al obtener productos favoritos");
            const data = await res.json();
            setFavorites(data);
        }catch(err){
            console.error(err)
        }
    }

    //quitar producto de fav
    const deleteFavorite = async (productId) => {
        try{
            const res = await fetch(`http://localhost:8080/api/favorites/${productId}`, {
                method: "DELETE",
                credentials: "include"
            });
            if(res.ok){
                setFavorites(prev => prev.filter(p => p.id !== productId));
            }
        }catch(err){
            console.error("Error al eliminar producto favorito:" , err)
        }
    }

    useEffect(() => {
    fetchFavorites();
    }, []);


  return (
    <div className='favorites-container'>
        <h2 className='favorites-tittle'>Mis productos favoritos</h2>

        {favorites.length === 0 ? (
            <p className='favorites-empty'>No tienes productos favoritos.</p>
        ) : (
            <div className='favorite-grid'>{favorites.map(product => (<div key={product.id} className='favorite-card'>
                <img 
                src={`http://localhost:8080/img_uploads/${product.image[0]}`} 
                alt={product.name}
                className='favorite-image'
                 />
                 <h3 className='favorite-name'>{product.name}</h3>
                 <p className='favorite-description'>{product.description}</p>
                 <button
                 className='remove-favorite-button'
                 onClick={() => deleteFavorite(product.id)}
                 >
                    Eliminar de favoritos
                 </button>
                 </div>
                ))}
            </div>
        )}
    </div>
  )
}
