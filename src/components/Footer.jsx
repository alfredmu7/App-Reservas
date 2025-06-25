import "../styles/Footer.css"

export const Footer = () => {



  return (
    <footer className='footer'>
        <div className='footer-content'>
            <div className='footer-left'>
                <img src="/src/img/logo2.png" 
                     alt="Logo jobix"
                     className='footer-logo' 
                     />
                <p className='footer-text'>
                    2025 Jobix. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </footer>
  )
}
