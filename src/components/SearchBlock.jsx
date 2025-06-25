import React, { useEffect, useState } from 'react'
import "../styles/SearchBlock.css"
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-custom.css"


export const SearchBlock = ({products}) => {

    const [query, setQuery] = useState("");//lo que se escribe en la busqueda
    const [suggestions, setSuggestions] = useState([]);//para autocompletado
    const [startDate, setStartDate] = useState(null); //desde de fechas
    const [endDate, setEndDate] = useState(null);//hasta de fechas
    const [filteredProducts, setFilteredProducts] = useState([]);//estadopara los resultados de busqueda

    //sugerencias en timepo real mientras se escribe
    useEffect(() => {
      if(query.trim() === ""){
        setSuggestions([])
      }else{
        const lowerQuery = query.toLowerCase();
        const matches = products.filter(p => p.name.toLowerCase().includes(lowerQuery))
        .map(p => p.name);
        setSuggestions(matches.slice(0,5));//para maximo 5 sugerencias
      }
    }, [query, products])

    
    //se ejecuta la busqueda cuando se hace clic en el btn
    const handleSearch = async() => {

        try{
            if(!startDate || !endDate){
                alert("Debe seleccionar un rago de fechas.");
                return;
            }

            const res= await fetch(`http://localhost:8080/api/product/available?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,{credentials:"include"});

            if(!res.ok){
                throw new Error("Error buscando disponibilidad");
            }

            const data = await res.json();

            // Filtramos por nombre 
            const lowerQuery = query.toLowerCase();
            const results = products.filter(p => 
                p.name.toLowerCase().includes(lowerQuery)
            );

                setFilteredProducts(results)
    

        }catch(err) {
            console.error("Error en la busqueda", err);
            setFilteredProducts([])
        }

    }


  return (
    <div className='search-block'>
        <h2>¿Que servicio estas buscando?</h2>

        <div className='search-controls'>
            <div className='autocomplete-wrapper'>
            <input 
            type="text"
            placeholder='Ej: Electricista, Plomero...'
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            className='search-input'
            />
            {suggestions.length > 0 && (
                <ul className='autocomplete-list'>
                    {suggestions.map((s, index) =>(
                        <li key={index} onClick={() => setQuery(s)}>
                            {s}
                        </li>
                    ))}
                </ul>
            )}
            </div>
            

            <div className='date-range'>
                <DatePicker 
                    selected = {startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Desde..."
                />
                 <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Hasta..."
                />
            </div>

            <button className='search-btn' onClick={handleSearch}>Buscar</button>
        </div>

             
             {filteredProducts.length > 0 && (
                <div className='search-result'>
                    <h3>Resultados de la busqueda:</h3>
                    <div className='result-grid'>
                        {filteredProducts.map(product => (
                            <div key={product.id} className='result-card'>
                                <Link    to={`/product/${product.id}`}>
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                {product.image && product.image.length > 0 &&(
                                    <img 
                                    src={`http://localhost:8080/img_uploads/${product.image[0]}`} 
                                    alt={product.name}
                                    className='result-img'
                                    />
                                )}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
             )}
    </div>
  );
}
