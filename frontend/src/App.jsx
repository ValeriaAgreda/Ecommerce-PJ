import { useEffect, useState } from 'react';

const slides = [
  {
    image: '/images/hero-transporte.png',
    kicker: 'Logística que mueve tu negocio',
    title: 'Tu carga, en ruta segura hacia su destino.',
    text: 'Coordinamos el transporte de tus importaciones con control, experiencia y acompañamiento en cada etapa.',
  },
  {
    image: '/images/hero-puerto.png',
    kicker: 'Conexión internacional',
    title: 'Del puerto a tu empresa, sin perder el control.',
    text: 'Integramos cada punto de la operación para que tus mercancías avancen con eficiencia y trazabilidad.',
  },
  {
    image: '/images/hero-monitoreo.png',
    kicker: 'Seguimiento permanente',
    title: 'Decisiones rápidas. Entregas confiables.',
    text: 'Nuestro equipo monitorea tus operaciones y te mantiene informado para anticiparnos a cualquier desafío.',
  },
];

const services = [
  { icon: 'truck', number: '01', title: 'Transporte de importaciones', text: 'Traslado terrestre de carga desde puertos y fronteras hasta el punto de entrega que tu operación necesita.' },
  { icon: 'box', number: '02', title: 'Carga contenerizada', text: 'Coordinación de contenedores completos con planificación de rutas, tiempos y recursos especializados.' },
  { icon: 'route', number: '03', title: 'Coordinación logística', text: 'Gestión integral con transportistas, operadores y puntos de recepción para mantener tu carga en movimiento.' },
  { icon: 'radar', number: '04', title: 'Seguimiento de carga', text: 'Información oportuna sobre el avance de tu operación y comunicación directa durante todo el trayecto.' },
  { icon: 'clipboard', number: '05', title: 'Asesoría operativa', text: 'Analizamos cada requerimiento y diseñamos una alternativa de transporte adecuada para tu mercancía.' },
  { icon: 'shield', number: '06', title: 'Gestión segura', text: 'Procesos orientados a reducir riesgos y proteger la continuidad de tu cadena de abastecimiento.' },
];

function Icon({ name }) {
  const paths = {
    truck: <><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    route: <><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h3a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/></>,
    radar: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m12 12 6-6"/></>,
    clipboard: <><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function App() {
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: 'idle', message: '' });
  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    const timer = setInterval(() => setSlide((current) => (current + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const submitQuote = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormStatus({ type: 'loading', message: 'Enviando solicitud…' });
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No pudimos enviar la solicitud.');
      form.reset();
      setFormStatus({ type: 'success', message: '¡Solicitud enviada! Nos pondremos en contacto contigo.' });
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message || 'Ocurrió un error. Inténtalo nuevamente.' });
    }
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="PJ Services inicio">
          <span className="brand-mark"><i></i><i></i></span>
          <span><b>PJ</b> SERVICES<small>LOGÍSTICA & TRANSPORTE</small></span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
          <span></span><span></span><span></span>
        </button>
        <nav className={menuOpen ? 'open' : ''}>
          <a href="#inicio" onClick={closeMenu}>Inicio</a>
          <a href="#nosotros" onClick={closeMenu}>Nosotros</a>
          <a href="#servicios" onClick={closeMenu}>Servicios</a>
          <a href="#proceso" onClick={closeMenu}>Cómo trabajamos</a>
          <a className="nav-cta" href="#contacto" onClick={closeMenu}>Solicitar cotización</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          {slides.map((item, index) => (
            <div className={`hero-slide ${index === slide ? 'active' : ''}`} key={item.title} style={{ backgroundImage: `url(${item.image})` }}>
              <div className="hero-shade"></div>
              <div className="hero-content page-width">
                <span className="kicker"><i></i>{item.kicker}</span>
                <h1>{item.title}</h1>
                <p>{item.text}</p>
                <div className="hero-actions">
                  <a className="button primary" href="#contacto">Cotiza tu transporte <span>→</span></a>
                  <a className="button ghost" href="#servicios">Conoce nuestros servicios</a>
                </div>
              </div>
            </div>
          ))}
          <div className="slider-controls page-width">
            <button onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} aria-label="Imagen anterior">←</button>
            <div className="slider-dots">
              {slides.map((_, index) => <button key={index} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={`Ver imagen ${index + 1}`}></button>)}
            </div>
            <button onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Imagen siguiente">→</button>
          </div>
          <div className="hero-stats">
            <div><strong>Atención</strong><span>personalizada</span></div>
            <div><strong>Control</strong><span>en cada etapa</span></div>
            <div><strong>Soluciones</strong><span>a tu medida</span></div>
          </div>
        </section>

        <section className="about section page-width" id="nosotros">
          <div className="about-copy">
            <span className="section-label">Quiénes somos</span>
            <h2>Movemos más que carga.<br/><em>Movemos oportunidades.</em></h2>
            <p className="lead">En PJ Services entendemos que cada importación es una pieza importante para el crecimiento de tu empresa.</p>
            <p>Somos una empresa especializada en logística de transporte para importaciones. Coordinamos cada operación con responsabilidad, comunicación clara y atención cercana, para que puedas concentrarte en hacer crecer tu negocio.</p>
            <a className="text-link" href="#contacto">Conversemos sobre tu próxima operación <span>↗</span></a>
          </div>
          <div className="about-visual">
            <div className="route-card">
              <div className="route-top"><span>OPERACIÓN EN CURSO</span><i></i></div>
              <div className="route-line"><b>Puerto / Frontera</b><span></span><b>Destino final</b></div>
              <div className="route-detail"><Icon name="truck"/><div><small>TRANSPORTE COORDINADO</small><strong>Seguimiento de principio a fin</strong></div></div>
            </div>
            <div className="experience-badge"><strong>PJ</strong><span>Tu aliado<br/>logístico</span></div>
          </div>
        </section>

        <section className="services section" id="servicios">
          <div className="page-width">
            <div className="section-heading">
              <div><span className="section-label light">Nuestros servicios</span><h2>Soluciones que mantienen<br/>tu negocio <em>en movimiento.</em></h2></div>
              <p>Diseñamos operaciones logísticas adaptadas a las características de tu carga, tu ruta y tus tiempos.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <span className="service-number">{service.number}</span>
                  <div className="service-icon"><Icon name={service.icon}/></div>
                  <h3>{service.title}</h3><p>{service.text}</p>
                  <span className="card-line"></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process section page-width" id="proceso">
          <div className="process-heading"><span className="section-label">Cómo trabajamos</span><h2>Una ruta clara para<br/><em>cada operación.</em></h2></div>
          <div className="steps">
            {[
              ['01', 'Escuchamos', 'Conocemos tu carga, origen, destino y requerimientos.'],
              ['02', 'Planificamos', 'Definimos la ruta y los recursos adecuados para tu operación.'],
              ['03', 'Coordinamos', 'Articulamos cada punto y mantenemos comunicación constante.'],
              ['04', 'Entregamos', 'Acompañamos la carga hasta completar el servicio acordado.'],
            ].map(([number, title, text]) => <article key={number}><span>{number}</span><div className="step-dot"></div><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="promise">
          <div className="page-width promise-inner">
            <div><span className="section-label light">Nuestro compromiso</span><h2>Tu operación merece<br/>un aliado <em>confiable.</em></h2></div>
            <div className="promise-list">
              <p><span>✓</span> Comunicación directa y oportuna</p>
              <p><span>✓</span> Planificación adaptada a tu carga</p>
              <p><span>✓</span> Seguimiento durante toda la operación</p>
              <p><span>✓</span> Atención profesional y cercana</p>
            </div>
          </div>
        </section>

        <section className="contact section" id="contacto">
          <div className="page-width contact-grid">
            <div className="contact-copy"><span className="section-label">Hablemos</span><h2>¿Tienes una carga<br/>por transportar?</h2><p>Cuéntanos sobre tu próxima importación. Nuestro equipo se pondrá en contacto contigo para analizar la mejor alternativa logística.</p><div className="contact-note"><span>↗</span><p><b>Respuesta personalizada</b><small>Revisamos cada solicitud de acuerdo con sus necesidades.</small></p></div></div>
            <form className="contact-form" onSubmit={submitQuote}>
              <div className="field-row"><label>Nombre<input name="name" type="text" placeholder="Tu nombre" autoComplete="name" required/></label><label>Empresa<input name="company" type="text" placeholder="Nombre de tu empresa" autoComplete="organization" required/></label></div>
              <div className="field-row"><label>Teléfono<input name="phone" type="tel" placeholder="Ej. +59170000000" autoComplete="tel" inputMode="tel" pattern="\+?[0-9]{7,15}" maxLength="16" title="Ingresa entre 7 y 15 números; el signo + solo puede ir al inicio." onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/(?!^)\+|[^\d+]/g, '').slice(0, 16); }} required/></label><label>Correo<input name="email" type="email" placeholder="nombre@empresa.com" autoComplete="email" required/></label></div>
              <div className="field-row"><label>Origen<input name="origin" type="text" placeholder="Ciudad, puerto o frontera" required/></label><label>Destino<input name="destination" type="text" placeholder="Lugar de entrega" required/></label></div>
              <div className="field-row"><label>Tipo de carga<input name="cargoType" type="text" placeholder="Ej. carga general" required/></label><label>Incoterm<input name="incoterm" type="text" placeholder="Ej. FOB, CIF, EXW" required/></label></div>
              <div className="field-row"><label>Volumen (m³)<input name="volume" type="number" inputMode="decimal" min="0.01" step="any" placeholder="Ej. 12.5" required/></label><label>Peso (kg)<input name="weight" type="number" inputMode="decimal" min="0.01" step="any" placeholder="Ej. 2500.5" required/></label></div>
              <label>Fecha estimada para su entrega<input name="estimatedDeliveryDate" type="date" min={today} required/></label>
              <button className="button primary" type="submit" disabled={formStatus.type === 'loading'}>{formStatus.type === 'loading' ? 'Enviando…' : 'Enviar solicitud'} <span>→</span></button>
              <small className={`form-note ${formStatus.type}`} role="status" aria-live="polite">{formStatus.message || 'Tus datos serán enviados de forma segura a PJ Services.'}</small>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="page-width footer-main">
          <div className="brand footer-brand"><span className="brand-mark"><i></i><i></i></span><span><b>PJ</b> SERVICES<small>LOGÍSTICA & TRANSPORTE</small></span></div>
          <p>Soluciones de transporte para importaciones, coordinadas con experiencia y compromiso.</p>
          <div className="footer-links"><a href="#nosotros">Nosotros</a><a href="#servicios">Servicios</a><a href="#proceso">Cómo trabajamos</a><a href="#contacto">Contacto</a></div>
        </div>
        <div className="footer-bottom page-width"><span>© {new Date().getFullYear()} PJ Services. Todos los derechos reservados.</span><span>Logística que conecta oportunidades.</span></div>
      </footer>
    </>
  );
}
