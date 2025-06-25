import { useEffect, useState } from "react";
import "../styles/Main.css"
import { ProductFilterByCategory } from "./ProductFilterByCategory"
import { RandomProductList } from "./RandomProductList"
import { SearchBlock } from "./SearchBlock";

export const Main = ({user}) => {

const [allProducts, setAllProducts] = useState([]);

//cragamos todos los productos desde el back al iniciar
useEffect(() => {
  fetch("http://localhost:8080/api/product", {credentials:"include"})
  .then((res) => res.json())
  .then((data) => setAllProducts(data))
  .catch((err) => console.error("Error al obtener productos:" , err))
}, [])

  return (
    <main className="main">
      <section className="search-section">
      <SearchBlock products ={allProducts}/>
      </section>
  

    <ProductFilterByCategory/>

    
    
    <section className="recommendations-section">
      <h3>Recomendaciones</h3>
      <p>Los más solicitados por nuestros usuarios:</p>
      
        <div className="recommendations-grid">
        <div className="recommendations">
            <img src="/src/img/electrico 1.jpg" alt="Tecnico Electricista" className="recommendations-img" />
            Juan, Electricista (Bogotá)
        </div>
        <div className="recommendations">
            <img  src="/src/img/limpieza_2.jpg" alt="Aseadora" className="recommendations-img" />
            Lucía, Limpieza (Medellín)
            </div>
        <div className="recommendations">
            <img  src="/src/img/mensajero 1.jpg" alt="mensajero" className="recommendations-img" />
            Carlos, Mensajero (Cali)
            </div>
        <div className="recommendations">
            <img  src="/src/img/mecanico_1.jpg" alt="mecanico" className="recommendations-img" />
            Valeria, Mecanico (Armenia)
            </div>
        <div className="recommendations">
            <img   src="/src/img/plomero 1.jpg" alt="plomero" className="recommendations-img" />
            Ruben, Plomero (Bogotá)
            </div>
      </div>
    </section>

    <RandomProductList 
    user={user}
    />

  </main>
  )
}
