import { useState } from "react";
import "../styles/ImageGallery.css"

export function ImageGallery({images}){

    const [seeMore, setSeeMore] = useState(false)

    //validamos que haya una imagen, si no, no renderice nada
    if(!images || images.length ==0)
        return null;

    // Seleccionamos la primera imagen como principal
    const mainImage = images[0];

   
    const secondaryImages = images.slice(1);

    const ImageToShow = seeMore ? secondaryImages : secondaryImages.slice(4);

    return(
        <div className="gallery-container">
            <div className="main-image">
            <img src={`http://localhost:8080/img_uploads/${mainImage}`} alt="Main Image" />

            </div>

            <div className="secondary-images">
                {ImageToShow.map((img, index) => (
                <div key={index} className="secondary-image">
                <img src={`http://localhost:8080/img_uploads/${img}`} alt={`Imagen ${index + 2}`} />

            </div>
            ))}

            
                <div className="see-more" onClick={() => setSeeMore(!seeMore)}>
                    {seeMore ? "Ver menos" : "Ver más"}
                    </div>
            </div>
        </div>


    )





}