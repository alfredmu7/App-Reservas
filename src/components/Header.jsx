import { Link } from "react-router-dom"
import "../styles/Header.css"

export const Header = ({user, onLogout}) => {

  // Generar las iniciales del usuario (de nombre y apellido si existen)
const initials = user ? `${user.name[0] || ""}${user.lastName[0] || ""}`.toUpperCase() : "";

  return (
    <nav className="header-container">
  <div className="header-left">
    <a className="logo-link" href="/">
      <img src="/src/img/logoJobix.png" alt="Logo" className="logo" />
      Solución confiable en un clic
    </a>
  </div>

  <div className="header-right">
    {!user ? (
      <div className="auth-buttons">
        <Link to="/register-form">
          <button className="btn-register" type="button">Crear cuenta</button>
        </Link>
        <Link to="/login">
          <button className="btn-login" type="button">Iniciar sesión</button>
        </Link>
      </div>
    ) : (
      <div className="header-user-info">
        <span className="user-name">¡Hola, {user.name}!</span>
        <div className="avatar">{initials}</div>
        <div className="dropdown">
          <button className="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Perfil
          </button>
          <ul className="dropdown-menu" data-bs-popper>
            <li><Link to="/profile" className="dropdown-item">Mi perfil</Link></li>
            <li><Link to="/favorites" className="dropdown-item">Mis favoritos</Link></li>
            <li><Link to="/reservation-history" className="dropdown-item">Mis reservas</Link></li>
            <li>{user.roles.includes("ADMIN") && (<Link to="/admin" className="dropdown-item">Panel administrador</Link>)}</li>
            <li><button onClick={onLogout} className="dropdown-item">Cerrar sesión</button></li>
          </ul>
        </div>
      </div>
    )}
  </div>
</nav>


  )
}

