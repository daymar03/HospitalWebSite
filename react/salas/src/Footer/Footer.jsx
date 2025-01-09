import './Footer.css'

export function Footer() {
  return (
    <footer className="wm-footer">
      <div className="wm-footer-logo">
        <img src='/img/logo.jpg' alt="wm-logo"></img>
      </div>
      <div className="wm-footer-developers">
        <h2>Desarrolladores:</h2>
        <span>Daymar David Guerrero Santiago</span>
        <span>Christopher Frias Ramos</span>
        <span>Ramón Alejandro Mateo Ochoa</span>
        <span>Kevin Calaña Castellón</span>
      </div>
      <div className="wm-footer-socials">
        <h3>Redes Sociales:</h3>
        <ul>
          <li>
            <a href="https://facebook.com"><i class="fab fa-facebook"></i>Facebook</a>
          </li>
          <li>
            <a href="https://twitter.com"><i class="fab fa-twitter"></i>Twitter(X)</a>
          </li>
          <li>
            <a href="https://instagram.com"><i class="fab fa-instagram"></i>Instagram</a>
          </li>
        </ul>
      </div>
      <div className="wm-footer-bottom">
        <div>
          <p>Desarrollado por: <span>Development Team Web Million</span></p>
          © webmilliom@gmail.com
        </div>
      </div>
    </footer>
  )
}
