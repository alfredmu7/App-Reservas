import { useState } from "react";
import "../styles/RegisterForm.css"


export const RegisterForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email:"",
        password:"",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    //actualizamos el estado cada vez que se escribe en el input
    const handleChange = (e)=>{
        const{name, value} = e.target;

        // Actualizamos formData, manteniendo los valores anteriores y cambiando solo el campo que editamos
        setFormData(prevData => ({...prevData, [name]: value,}));

        // Limpiamos el error del campo que está escribiendo
        setErrors(prevErrors => ({
            ...prevErrors, [name]:"",
        }));

        
        setMessage("");
    };
    
    // Función para validar cada campo según reglas definidas
    const validate=()=>{
        const newErrors ={};

        // Validar nombre: no vacío, solo letras y espacios
        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio."
        }else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.name)){
            newErrors.name = "El nombre solo puede contener letras y espacios."
        }

         // Validar apellido: no vacío, solo letras y espacios
         if(!formData.lastName.trim()){
            newErrors.lastName = "El apellido es obligatorio."
         }else if(!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.lastName)){
            newErrors.lastName = "El apellido solo puede contener letras y espacios."
         }

         // Validar email: no vacío, formato válido
         if(!formData.email.trim()){
            newErrors.email = "El correo electronico es obligatorio."
         }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
            newErrors.email = "El correo electronico no es valido.";
         }
         // Validar password: mínimo 8 caracteres, mayúscula, minúscula, número y especial
         if(!formData.password.trim()){
            newErrors.password = "La contraseña es obligatoria."
         }else if(
            !/(?=.*[a-z])/.test(formData.password) ||
            !/(?=.*[A-Z])/.test(formData.password) ||
            !/(?=.*\d)/.test(formData.password) ||
            !/(?=.*[@$!%*?&])/.test(formData.password) ||
            formData.password.length < 8
         ){
            newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
         }

         setErrors(newErrors);

          // Retornamos true si no hay errores, false si sí
         return Object.keys(newErrors).length === 0;

        };
        //__________________________________________________________________________________________________________
         // Función que se ejecuta al enviar el formulario
         const handleSubmit = async (e)=>{
            e.preventDefault();

            //validamos datos
            if(validate()){// Si todo está bien, podemos simular un envío o llamar a API para registrar

                try{
                    const response = await fetch("http://localhost:8080/api/auth/register",{
                        method: "POST",
                        headers:{
                            "Content-type": "application/json", 
                        },
                        credentials:"include",
                        body:JSON.stringify(formData),
                    });

                    const data = await response.text();
                    if(response.ok){
                        
                        setMessage("Registro exitoso. ¡Bienvenido!");
                        
                        setFormData({
                            name: "",
                            lastName:"",
                            email: "",
                            password:"",
                        });
                        setErrors({});
                    }else{
                        
                        setMessage(data || "Error al registrar usuario.");
                    }

                }catch(error){
                    console.error("Error al registrar:",error);
                    setMessage("Error de conexión con el servidor.");
                }
            }else{
                setMessage("Por favor corregir los errores  antes de  enviar.");
            }
         }
//__________________________________________________________________________________________________________________________
  return (
    <div className="register-container">
        <h2>Registro de usuario</h2>
        {message && (
            <div className={`message ${message.includes("error") ? "error" : "success"}`}>
                {message}
            </div>      
        )}

        <form onSubmit={handleSubmit} noValidate className="register-form">
            <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre:</label><br />
                <input 
                    type= "text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    />
                {errors.name && <small className="error-text">{errors.name}</small>}
            </div>

           <div className="form-group">
                <label className="form-label" htmlFor="lastName">Apellidos:</label><br />
                <input 
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                    />
                {errors.lastName && <small className="error-text">{errors.lastName}</small>}
           </div>

           <div className="form-group">
                <label className="form-label" htmlFor="email">Correo electrónico:</label><br />
                <input 
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    />
                {errors.email && <small className="error-text">{errors.email}</small>}
           </div>

            <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña:</label><br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    />
                {errors.password && <small className="error-text">{errors.password}</small>}
            </div>

            <button type="submit" className="btn-submit">Registrarse</button>
        </form>
    </div>
  )
}
