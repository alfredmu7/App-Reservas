import React, { useState } from 'react'
import"../styles/LoginForm.css"
import { useLocation, useNavigate } from 'react-router-dom';

export const LoginForm = ({onLogin}) => {

    const [formData, setFormData] = useState(
        {
            email:"",
            password:"",
        });

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // accedemos a la URL actual

    
    const fromReserva = new URLSearchParams(location.search).get("fromReserva");
    

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]:value}));
        setError("");
    };


    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        
        try{
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method:"POST",
                credentials: "include",
                headers:{"Content-type": "application/json"},
                body: JSON.stringify(formData)
                
            });

            if(!response.ok){
                const message = await response.text();
                setError(message);
                return;
            }
            //Guardamos el usuario logueado
            const userData = await response.json();
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("user", JSON.stringify(userData));

            // Verificamos si el usuario está autenticado correctamente
            if (
                !localStorage.getItem("isAuthenticated") ||
                localStorage.getItem("isAuthenticated") !== "true"
            ) {
                throw new Error("El usuario debe estar autenticado. Por favor, registrese.");
            }

            onLogin(userData);

            // Redirigimos al home según el origen
            const redirect = new URLSearchParams(location.search).get("redirect");
            navigate(redirect || "/");
            
        }catch(err){
            setError("Error en el servidor. Intenta luego.");
        }
    };

  return (
    <div className='login-container'>
        <h2>Iniciar sesion</h2>
       
       {/*Mensaje si viene desde intento de reservar */}
      {fromReserva && (
        <div className='info-msg'>
          Para continuar con tu reserva, debes iniciar sesión o registrarte.
        </div>
      )}

        {error && <div className='error-text'>{error}</div>}

        <form onSubmit={handleSubmit} className='login-form'>
            <div className='form-group'>
                <label htmlFor="email">Correo Electrónico:</label>
                <input 
                    type="text"
                    name= "email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='form-input'
                />
            </div>

            <div className='form-group'>
                <label htmlFor="password">Password:</label>
                <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='form-input'
                    />
            </div>

            <button type='submit' className='btn-submit'>Ingresar</button>
        </form>
    </div>
  )
}

