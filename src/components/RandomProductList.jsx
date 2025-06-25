import React, { useEffect, useState } from 'react'
import "../styles/RandomProductList.css"
import { Link } from 'react-router-dom';
import { FavoriteProductCard } from './FavoriteProductCard';
import { ShareButton } from './ShareButton';


export function RandomProductList({user}) {

    const [product, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);//con esto manejamos la paginacion

    const productPerPage = 4;

    const [userFavorite, setUserFavorite] = useState([]);//para los favoritos del usuario 

    //cragamos del back, para obtener los productos
    useEffect(() => {
        fetch("http://localhost:8080/api/product/randomProducts", {credentials:"include"})
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Error al obtener producto: ", err));
    }, [])

    //obtenemos los favoritos del usuario
    useEffect(() => {
      
      fetch("http://localhost:8080/api/favorites", {
        credentials: "include"
      })
      .then((res)=>{
        if(!res.ok) throw new Error("Error al obtener favoritos");
        return res.json();
      })
      .then((data) => setUserFavorite(data))
      .catch((err)=> console.error("Error al cargar favoritos", err));
    }, [user]);

    //agregamos o eliminamos los favoritos con esta funcion
    const handleToogleFavorite = (productId, isCurrenlyFavorite) => {

      if(!user){
        // revisamos si esta registrado, sino lanzamos una advertencia
        console.warn("Intento de favorito sin iniciar sesión.");
        return;
      }

      const url = `http://localhost:8080/api/favorites/${productId}`;
      const method= isCurrenlyFavorite ? 'DELETE' : 'POST';

      fetch(url, {method, credentials:"include"})
      .then((res) =>{
        if(!res.ok) throw new Error("Error al actualizar favoritos");

        // Actualizar estado local para reflejar el cambio visualmente
        setUserFavorite((prevFavorite) =>
        isCurrenlyFavorite ? prevFavorite.filter((id) => id !== productId) : [...prevFavorite, productId]
        );
      })
      .catch((err) => console.error("Error al cambiar favorito", err));
    }
    
    //toda la logica de cambio de pagina
    const indexOfLastPage = currentPage * productPerPage;
    const indexOfFirstPage = indexOfLastPage - productPerPage;

    const currentProducts = product.slice(indexOfFirstPage, indexOfLastPage);
    const totalPage = Math.ceil(product.length / productPerPage);

    //funciones para cambiar de pagina 
    const goToNextPage = () =>{
      if(currentPage < totalPage) 
        setCurrentPage(currentPage + 1);
    }

    const goToPrevPage = () => {
      if(currentPage > 1)
        setCurrentPage(currentPage - 1);
    }

    const goToFirstPage= () =>{
      setCurrentPage(1);
    }

        return (
            
            <section className="random-products-section">
              <h2>Agregados recientemente</h2>

              <div className="random-products-grid">
                {currentProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <Link to={`/product/${product.id}`} className='link-product-card'>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    {product.image && product.image.length > 0 && (
                      <img
                      src={`http://localhost:8080/img_uploads/${product.image[0]}`}
                      alt={product.name}
                      className="product-img"
                    />
                  )}
                    </Link>
                  
                  
                    <FavoriteProductCard
                    key={product.id}
                    product={product}
                    isFavorite={userFavorite.includes(product.id)}
                    onToggleFavorite={handleToogleFavorite}
                    user={user}
                    />
                


                    <ShareButton 
                    product={product}
                    user={user}
                    />
                  

                  </div>
                ))}
              </div>
                <div className='page-controls'>
                  <button onClick={goToFirstPage} disabled={currentPage == 1}>Inicio</button>
                  <button onClick={goToPrevPage} disabled={currentPage == 1}>Atrás</button>
                  <span>Página {currentPage} de {totalPage}</span>
                  <button onClick={goToNextPage} disabled={currentPage == totalPage}>Siguiente</button>
                </div>
            </section>
          );
        }