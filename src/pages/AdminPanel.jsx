import { useNavigate } from 'react-router-dom';
import "../styles/AdminPanel.css"
import { useEffect, useState } from 'react';

function AdminPanel(){
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    //verificamos que el ancho de la pantalla es menos a 768px aprox. pantallas móviles.
    useEffect(() => {

      const checkScreenSize = () =>{
        setIsMobile(window.innerWidth < 768);
      }

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return ()=> window.removeEventListener("resize", checkScreenSize);
    }, []);

    if(isMobile){
        return(
            <div className='admin-container'>
                <p>Este panel no está disponible en dispositivos móviles.</p>
                <p>Debes ingresar desde tu computadora.</p>
            </div>
        )
    }

    return(
        <div className='admin-container' style={{ padding: "20px" }}>
            <h2>Panel de Administrador</h2>
            <div className='admin-menu'>
                <button onClick={() => navigate("/admin/add-product")}>Agregar Producto</button>
                <button onClick={() => navigate("/admin/all-product")}>Lista de Productos</button>
                <button onClick={() => navigate("/admin/manage-categories")}>Gestionar Categorías</button>
                <button onClick={() => navigate("/admin/manage-features")}>Gestionar Características</button>
                <button onClick={() => navigate("/admin/manage-users")}>Gestionar Usuarios</button>
                <button onClick={() => navigate("/admin/Policies")}>Gestionar Políticas de servicio</button>
                
                <button className="back-button" onClick={() => navigate("/")} >Home
               
                </button>
            </div>

    </div>
  );
    
}

export default AdminPanel;