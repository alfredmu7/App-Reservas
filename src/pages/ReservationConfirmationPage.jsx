import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import "../styles/ReservationConfirmationPage.css"

export const ReservationConfirmationPage = () => {

    const {productId} = useParams();// id del producto desde la url
    const navigate = useNavigate();
    const location = useLocation();// Para acceder a fechas seleccionadas que se pasan desde ProductDetail.jsx
    const {startDate, endDate} = location.state || {};// Extraemos las fechas desde location.state

    //estados locales
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState({
        start:null,
        end: null
    });
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [showConfirmReservationModal, setShowConfirmReservationModal] = useState(false)
    const [loading, setLoading] = useState(false);


    //hacemos una validacion inicial
    if(!productId || !startDate || !endDate){
        return <p>No hay datos de reserva. Volveras a la pagina del producto.</p>
    }
    

    useEffect(() => {
        if (startDate && endDate) {
          setSelectedDate({
            start: new Date(startDate),
            end: new Date(endDate),
          });
        }
      }, [startDate, endDate]);

    
    useEffect(() => {
      fetch(`http://localhost:8080/api/product/${productId}`, {credentials:"include"})
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Error al cargar producto", err));
      
    }, [productId]);


    
  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autenticado");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Error al obtener usuario:", err);
        setError("No se pudo cargar el usuario. Inicia sesión.");
      });
  }, []);


const handleConfirmReservation = async () =>{

    setLoading(true);//se muestra el estado cargando
    setError(null);
    

    try{
        const params = new URLSearchParams({
            productId,
            startDate: selectedDate.start.toISOString().split("T")[0],//formato yyyy-MM-dd
            endDate: selectedDate.end.toISOString().split("T")[0]
        });

        const res = await fetch(`http://localhost:8080/api/reservations?${params.toString()}`,{
            method: "POST",
            credentials: "include" 
        });

        if(!res.ok){
            const msg = await res.text();
            throw new Error(msg || "No se pudo crear la reserva");
        }

        // Si llega aquí, la reserva fue exitosa
        const data = await res.json();
        setShowConfirmReservationModal(true);
        //redirigimos 
        setTimeout(() => navigate("/"), 6000);

    }catch(err){
        console.error(err)
        setError(err.message);
    }finally{
        setLoading(false);
    }
  }

    // Mostrar una espera si no hay datos todavía
    if(!product || !user) 
        return <div>Cargando...</div>;


  return (
    <div className='reservation-container'>
        <h2>Verificar datos de la reserva</h2>

        <section className='product-info'>
        <h3>{product.name}</h3>
        <p>{product.location}</p>
        <div className='product-image'>
            {product?.image?.length > 0 ? (
                    <img 
                    
                    src={`http://localhost:8080/img_uploads/${product.image[0]}`} 
                    alt={"imagen del producto"} />
  ) : (
    <p>No hay imágenes disponibles</p>
  )}
            </div>
            <p>{product.description}</p>
        </section>

        {/* Seccion de usuario */}
        <section className='user-info'>
            <h4>Datos del usuario</h4>
            <p><strong>Nombre: </strong>{user.name}</p>
            <p><strong>Apellido: </strong>{user.lastName}</p>
            <p><strong>Correo: </strong>{user.email}</p>
        </section>

        {/* Sección de fechas */}
        <section className='date-info'>
            <h4>Fechas seleccionadas</h4>
            <p><strong>Desde:</strong> {selectedDate.start.toLocaleDateString()}</p>
            <p><strong>Hasta:</strong> {selectedDate.end.toLocaleDateString()}</p>
        </section>

        {error && <p className='error-msg'>{error}</p>}
            {successMsg && <p className='success-msg'>{successMsg}</p>}

        <button 
        onClick={handleConfirmReservation} 
        disabled={loading}
        className='confirm-button'>
            {loading ? "Confirmando..." : "Confirmar Reserva"}
        </button>
        {!successMsg &&(
            <button onClick={()=> navigate(-1)} className='back-button'>Volver atrás</button>
        )}

        {showConfirmReservationModal &&(
            <div className='modal-overlay'>
                <div className='modal-content'>
                    <h3>¡Reserva confirmada exitosamente!</h3>
                    <p>Serás redirigido al inicio en unos segundos.</p>
                    <button onClick={()=> navigate("/")}>Ir ahora</button>
                </div>
                </div>
        )}

    </div>
  )
}
