// Declaramos el componente funcional AddProductForm

import { useEffect, useState } from "react";
import "../styles/AddProductForm.css"

function AddProductForm() {
    
    const [name, setname] = useState("");
    const [description, setDescription] = useState("");
    const [image, setimage] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [features, setFeatures] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    
    useEffect(() => {
      fetch("http://localhost:8080/api/categories", {credentials: "include"})
        .then((res) => res.json())
        .then((data) => setCategoryList(data))
        .catch((err) => console.error("Error al cargar categorías:", err));
    }, []);
    

  useEffect(() => {// Cargar características desde el backend al montar el componente
    fetch("http://localhost:8080/api/features", {credentials: "include"})
    .then((res) => res.json())
    .then((data) => setFeatures(data))
    .catch((err) => console.error("Error al cargar características:", err));
  }, []);

    // Función que se ejecuta cuando el usuario selecciona imágenes
    const handleImagenChange = (e) => {
    const newImage = Array.from(e.target.files)
        setimage((pre) => [...pre, ...newImage]);// Guardamos las imágenes seleccionadas en el estado como un array
  };

  //control de checkbox de caracteristicas:
  const handleFeatureChange = (e) => {
    const featuresId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setSelectedFeatures((prev)=> 
      isChecked ? [...prev, featuresId] : // Agrega el id si está marcado
      prev.filter((id) => id !== featuresId)// Elimina si se desmarca
    );
  };


   // Función que se ejecuta al enviar el formulario
   const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const formData = new FormData();
    formData.append("name", name); // Agregamos el name al formulario
    formData.append("description", description); // Agregamos la descripción
    if(categoryId){
      formData.append("category", categoryId);
    }

    image.forEach((img) => formData.append("image", img)); // Agregamos imagen al formulario

    //agregar id  de features seleccionados:
    selectedFeatures.forEach((featuresId) =>
    formData.append("features", featuresId)
  );
   
    try {
        
        const res = await fetch("http://localhost:8080/api/product", {
          method: "POST",
          credentials: "include",
          body: formData
        });

      // validar , ya existe un producto con ese name
      if (res.status === 409) {
        setError("Ese nombre ya está en uso.");
        setMessage("");
      }
      
      else if (res.ok) {// Si todo salió bien 
        setMessage("Producto agregado exitosamente."); 
        setError(""); 
        setname("");
        setDescription("");
        setCategoryId("");
        setimage([]);
        setSelectedFeatures([]);
      } else {
        throw new Error("Error inesperado"); 
      }
    } catch (err) {
      console.error(err); 
      setError("Ocurrió un error al agregar el producto."); // Mensaje visible al usuario
    }
  };

  return(
    <form className='add-product-form' onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h2>Agregar Producto</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {message && <p style={{ color: "green" }}>{message}</p>}
     
     <label htmlFor="name">Nombre:</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
        required
      />
      <br />
     
      <label htmlFor="description">Descripción:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <br />
     
      <label htmlFor="category">Categoría:</label>
      <select
        id="category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Selecciona una categoría</option>
        {Array.isArray(categoryList) &&
          categoryList.map((ctgo) => (
            <option key={ctgo.id} value={ctgo.id}>
              {ctgo.name}
            </option>
          ))}
      </select>
      <br />

      
      <fieldset>
        <legend>Características:</legend>
        <div className="features-container">
          {features.map((feature) => (
            <div key={feature.id} className="feature-item">
              <input
                id={`feature-${feature.id}`}
                type="checkbox"
                value={feature.id}
                checked={selectedFeatures.includes(feature.id)}
                onChange={handleFeatureChange}
              />
              <label htmlFor={`feature-${feature.id}`}>{feature.name}</label>
            </div>
          ))}
        </div>
      </fieldset>
      <br />

      
      <label htmlFor="image">Imágenes:</label>
      <input id="image" type="file" multiple onChange={handleImagenChange} />
      <div className="preview-container">
        {image.map((img, index) => (
          <div key={index} className="preview-item">
            <p>{img.name + ","}</p>
          </div>
        ))}
      </div>
      <br />

      <button type="submit">Guardar</button>
    </form>
  );

}


export default AddProductForm;