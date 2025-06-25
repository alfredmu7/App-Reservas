import React, { useState } from 'react'
import "../styles/ShareModal.css"

export const ShareModal = ({product, onClose}) => {

    const [customMessage, setCustomMessage] = useState("");

    // Función para manejar el clic en una red social
    const handleShare= (platform) => {
        
        const url = `${window.location.origin}/product/${product.id}`;
        const  message = encodeURIComponent(`${customMessage} ${url}`);
        let shareUrl = "";

        //  url según la red social elegida
        switch (platform) {
            case "facebook":
                shareUrl = "https://www.facebook.com";
                break;
            case "instagram":
                shareUrl = "https://www.instagram.com";
                break;
            case "whatsapp":
                shareUrl = "https://api.whatsapp.com";
                break;
        
            default:
                break;
        }

        window.open(shareUrl, "_black");
    }

  return (
    <div className='share-modal-overlay'>
        <div className='share-modal'>
            <button className='close-btn' onClick={onClose}>X</button>
        
        <h2>Compartir producto</h2>
       
        <h3 className='product-title'>{product.name}</h3>
      
        <p className="products-description">{product.description}</p>
        <img 
        src={`http://localhost:8080/img_uploads/${product.image[0]}`} 
        alt={product.name} 
        className="product-image" />


        
        <textarea
          className="custom-message"
          placeholder="Agrega un mensaje personalizado..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
        />

       
        <div className="share-buttons">
          <button onClick={() => handleShare('facebook')} className="social-btn fb">Facebook</button>
          <button onClick={() => handleShare('instagram')} className="social-btn ig">Instagram</button>
          <button onClick={() => handleShare('whatsapp')} className="social-btn wa">WhatsApp</button>
        </div>
      </div>
    </div>
  );
};