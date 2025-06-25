import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ProductDetail.css"
import { ImageGallery } from "../components/ImageGallery";
import { FeatureBlock } from "../components/FeatureBlock";
import { AvailabilityCalendar } from "../components/AvailabilityCalendar";
import { ProductPolicies } from "../components/ProductPolicies";
import { RatingStarts } from "../components/RatingStarts";
import { ReviewForm } from "../components/ReviewForm";
import { addDays } from "date-fns";
import { ReservationForm } from "../components/ReservationForm";
import { WhatsappButton } from "../components/WhatsappButton";



  export default function ProductDetail(){

      const {id} = useParams();// para obtener el parametro de la url
      const navigate = useNavigate();//redirigir al usuario
      const [product, setProduct] = useState(null);
      const [reviews, setReviews] = useState([]);
      const [average, setAverage] = useState(0)
      const [total, setTotal] = useState(0)
      const [selectedRange, setselectedRange] = useState({startDate: null, endDate: null});
      const [dateRange, setDateRange] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 1),
          key: "selection"
        }
      ]);

      

      //usuario autenticado:
      const user= JSON.parse(localStorage.getItem("user"));

      const handleDateRangeSelect = ({startDate, endDate}) =>{
        setselectedRange({startDate, endDate});
      };

      
      // aqui llamp al backend para obtener los datos del producto por su id
      useEffect(() => {
        fetch(`http://localhost:8080/api/product/${id}`, {credentials:"include"}) 
          .then((res) => res.json())
          .then((data) => setProduct(data))
          .catch((err) => console.error("Error al obtener detalles del producto:" , err))
      }, [id]);

      

      //cargamos las reseñas:
      useEffect(() => {
        fetch(`http://localhost:8080/api/reviews/product/${id}`, {credentials:"include"})
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((err)=> console.error("Error al cargar las reseñas", err))
        
        //promedio
        fetch(`http://localhost:8080/api/reviews/product/${id}/average`, {
          credentials:"include"
        })
        .then((res) => {
          if (!res.ok) throw new Error("Respuesta del servidor no OK");
          return res.text(); // <-- primero obtenemos el texto
        })
      
        .then((data) => setAverage(data || 0))
        .catch((err)=> console.error("Error al cargar el promedio", err))
        
        //total de reseñas
        fetch(`http://localhost:8080/api/reviews/product/${id}/count`, {credentials:"include"})
        .then((res) => res.json())
        .then((data) => setTotal(data || 0))
        .catch((err)=> console.error("Error al cargar el total de reseñas", err))
      }, [id])

    
      
  //correspondiente a la reseña
      const handleNewReview= (newReview) =>{
          setReviews(prev => [...prev, newReview]);
          const updateAverage = ((average * total) + newReview.rating) / (total + 1);
          setAverage(updateAverage);
          setTotal(prev => prev + 1);
      }



      

      return (
          <div className="product-detail-container">
            {!product ? (
              <p>Cargando Servicio...</p>
            ) : (
              <>
                <header className="product-detail-header">
                  <h1 className="product-tittle">{product.name}</h1>
                  <button className="back_button" onClick={() => navigate(-1)} >
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                </header>
        
                <section className="product-detail-body">
                  <p className="product-description">{product.description}</p>
                  {product.image && Array.isArray(product.image) && (<ImageGallery images = {product.image}/>)}
                  <hr />

                      
                  <section className="availability-section">
                      <h3>Disponibilidad</h3>

                      <AvailabilityCalendar 
                      productId={id} 
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                      onRangeSelect={handleDateRangeSelect}
                      
                      />
                      {selectedRange.startDate && selectedRange.endDate && (
                        <p className="selected-dates">
                          Rango seleccionado:{" "}
                          <strong>
                            {new Date(selectedRange.startDate).toLocaleDateString()} -{" "}
                            {new Date(selectedRange.endDate).toLocaleDateString()}
                          </strong>
                        </p>
                      )}
                      
                      <ReservationForm 
                        productId={id}
                        dateRange={dateRange}
                        user={user}
                        />
                  </section>

                  
                  
                  <hr />
                  <FeatureBlock features = {product.featureList}/>
                </section>
                
                <ProductPolicies />
        
                
                <section className="review-section">
                  <h2>Reseñas</h2>
                  <div className="rating-summary">
                    <strong>Valoración media:</strong><RatingStarts rating={Math.round(average)}/>
                    <span>({total} reseñas)</span>
                  </div>
        
                  <div className="reviews-list">
                    {reviews.map((review, index) => (
                      <div className="review-card" key={index}>
                        <RatingStarts rating={review.rating}/>
                        <p><strong>{review.user.name}</strong> - {review.date}</p>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                  </div>
        
                  {user && (
                    <ReviewForm productId={id} userId={user.id} onReviewSubmit={handleNewReview}/>
                  )}
                </section>
                <WhatsappButton 
                phoneNumber={product.providerPhone || "3264582125"} 
                message={`¡Hola! Estoy interesado en tu servicio de ${product.name} en jobix. ¿Podemos conversar?`} />
              </>
            )}
          </div>
        )
      }