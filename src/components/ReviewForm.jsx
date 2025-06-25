import React, { useState } from 'react'
import "../styles/ReviewForm.css"

export const ReviewForm = ({productId, userId, onReviewSubmit}) => {

    const [rating, setRating] = useState(0);

    const [comment, setComment] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        const review = {
            rating,
            comment,
            product: {id: productId},
            user: {id: userId}
        };

        const res = await fetch("http://localhost:8080/api/reviews", {
            method: "POST",
            credentials:"include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(review)
        });

        if(res.ok){
            const data = await res.json();
            onReviewSubmit(data);
            setRating(0);
            setComment("");
        }
    }

  return (
    <form className='review-form' onSubmit={handleSubmit}>
        <h3>Escribe tu reseña</h3>

        <label>Puntuación:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
            <option value="">Elige una puntuación</option>
            {[1,2,3,4,5].map((num) => (
                <option key={num} value={num}>{num} estrella{num > 1 && "s"}</option>
            ))}
        </select>

        <label>Comentario:</label>
        <textarea 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Comparte tu experiencia...'
        // required
        ></textarea>

        <button type='submit'>Enviar reseña</button>
    </form>
  )
}
