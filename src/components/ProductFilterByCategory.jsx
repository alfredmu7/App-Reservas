import React, { useEffect, useState } from 'react'
import "../styles/ProductFilterByCategory.css"
import { Link } from 'react-router-dom';

export const ProductFilterByCategory = () => {

  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [FilteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 2;

  //cargamos productos  y ctgorias al iniciar
  useEffect(() => {
    // Carga productos
    fetch("http://localhost:8080/api/product", {
      credentials: "include", 
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Error al obtener productos:", res.status);
          return [];
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => {
        console.error("Error al parsear productos:", err);
      });
  
    // Carga categorías
    fetch("http://localhost:8080/api/categories", {
      credentials: "include", 
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Error al obtener categorías:", res.status);
          return [];
        }
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Error al parsear categorías:", err);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1); //reinicia a la página 1 al aplicar filtros
  }, [FilteredProducts]);

   // Maneja la selección/deselección de categorías
   const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId)// desmarcar
      : [...prev, categoryId]);// marcar
   }


   useEffect(() => {
     if(selectedCategories.length === 0){
      setFilteredProducts(products);//sin filtros aparecen todos los productos
     }else{
      const filtered= products.filter((p) =>
      selectedCategories.includes(p.category?.id));

      setFilteredProducts(filtered);
     }
   }, [selectedCategories, products]);
   


   const clearFilter = () => {
    setSelectedCategories([]);
   }

   const indexOfLastPage = currentPage * productPerPage;
   const indexOfFirstPage = indexOfLastPage - productPerPage;
 
   const currentProducts = FilteredProducts.slice(indexOfFirstPage, indexOfLastPage);
   const totalPage = Math.ceil(FilteredProducts.length / productPerPage);


   //funciones para cambiar de pagina 
  const goToNextPage = () => {
    if (currentPage < totalPage)
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
    <div className='filter-container'>
      <aside className='filter-sidebar'>
        <h3>Filtrar por categoría</h3>
        <ul>
          {categories.map((ctgo) => (
            <li key={ctgo.id}>
              <label>
                <input 
                type="checkbox"
                checked={selectedCategories.includes(ctgo.id)}
                onChange={() => handleCategoryChange(ctgo.id)}
                />
                {ctgo.name}
              </label>
            </li>
          ))}
        </ul>
        <button className='clear-btn' onClick={clearFilter}>Limpiar Filtros</button>
      </aside>
      <section className='product-results'>

         {/*contador*/}
         <div className='results-count'>
          Mostrando {FilteredProducts.length} de {products.length} productos
         </div>

         {/*productos filtrados*/}
         <div className='product-list'>
          {currentProducts.map(p => (
            <div key={p.id} className='product-card'>
              <Link to={`/product/${p.id}`} className='link-product-card'>
              <h4>{p.name}</h4>
              <p>{p.description}</p>
              <p className='category-tag'>{p.category?.name}</p>
              {p.image && p.image.length > 0 && (
                      <img
                      src={`http://localhost:8080/img_uploads/${p.image[0]}`}
                      alt={p.name}
                      className="product-img"
                    />
                    )}
              </Link>
            </div>
          ))}
         </div>
         <div className='control-btn'>
          <button onClick={goToFirstPage} disabled={currentPage == 1}>Inicio</button>
          <button onClick={goToPrevPage} disabled={currentPage == 1}>Atrás</button>
          <span>Pagina {currentPage} de {totalPage}</span>
          <button onClick={goToNextPage} disabled={currentPage == totalPage}>Siguiente</button>
         </div>
      </section>
    </div>
  )
}
