import React from 'react'
import "../styles/RatingStarts.css"

export const RatingStarts = ({rating}) => {

  return (
    <div className='rating-stars'>
        {[...Array(5)].map((_, index) => (
            <span 
            key={index} 
            className={index < rating ? "filled-star" : "empty-star"}>★</span>
        ))}
    </div>
  )
}
