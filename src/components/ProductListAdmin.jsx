
import { useEffect, useState } from "react";
import "../styles/ProductListAdmin.css"


export const ProductListAdmin = () => {

    const [product, setProduct] = useState([]);
    const [selectProduct, setSelectProduct] = useState(null);
    const [formData, setFormData] = useState({
        name:"",
        description: "",
        categoryId: "",
        images: [],
        
    });


    const [categories, setCategories] = useState([]);
    useEffect(()=>{
      fetch("http://localhost:8080/api/categories",{credentials:"include"})
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("No se pudo cargar lista de categorías", err));
    },[]);

    const [previewImages, setPreviewImages] = useState([])
    useEffect(() => {
      fetch("http://localhost:8080/api/product/randomProducts",{credentials:"include"})
      .then((res) => res.json())
      .then((data)=> setProduct(data))
      .catch((err) => console.error("Error al cargar lista de productos: ", err));
    },[]);

    const DeleteProduct=(id)=>{
        const confirmation = window.confirm("¿Estás seguro de eliminar este producto?");

        if(!confirmation){
            return;
        }

        fetch(`http://localhost:8080/api/product/${id}`,{
            method: "DELETE",
            credentials:"include"
        })
        .then((res) => {
            if(!res.ok){
                throw new Error("No se pudo eliminar el producto");
            }

            
            setProduct(product.filter((product) => product.id !== id));
        })
        .catch((err)=> console.error("Error al eliminar el producto: ", err));
    }
    
    const handleEditClick = (product) => {
        setSelectProduct(product);
        setFormData({
            name: product.name,
            description: product.description || "",
            categoryId: product.category?.id || "",
            images: [],
        });
        setPreviewImages([]);
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
    
      //categoryId, convierte el valor a número
      const newValue = name === "categoryId" ? Number(value) : value;
    
      setFormData(prev => ({
        ...prev,
        [name]: newValue,
      }));
    };

      const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
          ...prev,
          images: files,
        }));
    
        // Mostrar vistas previas
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
      };
    
      const handleSave = () => {
        const form = new FormData();
        form.append("name", formData.name);
        form.append("description", formData.description);
        
        if(formData.categoryId){
        form.append("category", formData.categoryId);
        }
              
        // Validamos que images sea un array antes de usar forEach
        if(Array.isArray(formData.images) && formData.images.length > 0){
          formData.images.forEach((image)=> {
            form.append("image", image);
          });
        }

  

        fetch(`http://localhost:8080/api/product/${selectProduct.id}`, {
          method: "PUT",
          credentials:"include",
          body: form,
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al actualizar el producto");
            return res.json();
          })
          .then((updatedProduct) => {
            setProduct(prev =>
              prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setSelectProduct(null);
            setPreviewImages([]);
          })
          .catch((err) => console.error("Error al actualizar:", err));
      };
    

      return (
        <div className="product-list-admin">
        <h2>Lista de productos</h2>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {product.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>
                            
                            <button className="blue-button" onClick={()=> handleEditClick(product)}>Editar</button>
                            <button className="red-button" onClick={()=>DeleteProduct(product.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {selectProduct && (
        <div className="edit-form">
          <h3>Editar producto: {selectProduct.name}</h3>

          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
         
            <label className="category-form">Categoría:</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
              <option value="">--Selecciona categoría--</option>
              {Array.isArray && categories.map(ctgo =>(
                <option key={ctgo.id} value={ctgo.id}>
                  {ctgo.name}
                </option>
              ))};
            </select>
            <br />

         

          <div className="img-form">
          <label>Nuevas imágenes:</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
          />
          </div>

          {/* Vista previa de imágenes nuevas */}
          {previewImages.length > 0 && (
            <div className="image-preview">
              {previewImages.map((src, index) => (
                <img key={index} src={src} alt={`preview-${index}`} height="100px" />
              ))}
            </div>
          )}

          <div style={{ marginTop: "10px" }}>
            <button className="green-button" onClick={handleSave}>Guardar</button>
            <button className="gray-button" onClick={() => setSelectProduct(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};
 
