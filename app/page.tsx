const event = {
  dateEn: "Monday, September 14, 2026",
  dateEs: "Lunes, 14 de septiembre de 2026",
  time: "6:30 PM–8:00 PM",
  street: "1433 Aversboro Rd",
  city: "Garner, NC 27529",
};

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="event-title">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <nav aria-label="Language navigation">
          <a href="#details">Details</a>
          <span aria-hidden="true">•</span>
          <a href="#detalles">Detalles</a>
        </nav>

        <div className="eyebrow">An evening to share what makes you shine · Una noche para compartir tu talento</div>
        <h1 id="event-title">
          <span>COMMUNITY</span>
          <span className="accent">TALENT NIGHT</span>
        </h1>
        <p className="titleEs">NOCHE DE TALENTOS DE LA COMUNIDAD</p>

        <div className="eventLine">
          <div>
            <span className="label">Date · Fecha</span>
            <strong>{event.dateEn}</strong>
            <span>{event.dateEs}</span>
          </div>
          <div className="timeBlock">
            <span className="label">Time · Hora</span>
            <strong>{event.time}</strong>
          </div>
          <div>
            <span className="label">Location · Lugar</span>
            <strong>{event.street}</strong>
            <span>{event.city}</span>
          </div>
        </div>

        <a className="primaryButton" href="#participate" data-form-link>Share your talent · Comparte tu talento</a>
        <p className="free">Free community event · Evento comunitario gratuito</p>
      </section>

      <section className="welcome" id="details">
        <div className="sectionIntro">
          <span className="kicker">Everyone belongs on our stage</span>
          <h2>Bring your talent.<br />Bring your people.</h2>
        </div>
        <div className="bilingualCopy">
          <p>Music, dance, comedy, poetry, art, and delightful surprises—we’re gathering neighbors of every age for a joyful evening of creativity and connection.</p>
          <p lang="es" id="detalles">Música, baile, comedia, poesía, arte y sorpresas maravillosas—reuniremos a vecinos de todas las edades para una noche alegre de creatividad y amistad.</p>
        </div>
      </section>

      <section className="participate" id="participate">
        <div className="card performer">
          <span className="cardNumber">01</span>
          <h3>Take the stage</h3>
          <p>Solo acts, groups, and talents of every kind are welcome. Family-friendly performances, please.</p>
          <p lang="es">Solistas, grupos y talentos de todo tipo son bienvenidos. Las presentaciones deben ser apropiadas para toda la familia.</p>
          <span className="comingSoon">Performer sign-up coming soon · Inscripción próximamente</span>
        </div>
        <div className="card audience">
          <span className="cardNumber">02</span>
          <h3>Come cheer</h3>
          <p>No talent required—just bring your family, friends, and applause. Everyone in the community is invited.</p>
          <p lang="es">No necesitas presentar un talento—solo trae a tu familia, amigos y aplausos. Toda la comunidad está invitada.</p>
          <span className="comingSoon">No ticket needed · No se necesita boleto</span>
        </div>
      </section>

      <section className="location" aria-labelledby="location-title">
        <div>
          <span className="kicker">Save the date · Reserva la fecha</span>
          <h2 id="location-title">Meet us in Garner</h2>
          <p>The Church of Jesus Christ of Latter-day Saints<br />{event.street}<br />{event.city}</p>
          <a className="directions" href="https://www.google.com/maps/search/?api=1&query=1433+Aversboro+Rd+Garner+NC+27529" target="_blank" rel="noreferrer">Get directions · Cómo llegar ↗</a>
        </div>
        <div className="dateStamp" aria-label={`${event.dateEn}, ${event.time}`}>
          <span>SEP</span>
          <strong>14</strong>
          <small>2026</small>
        </div>
      </section>

      <footer>
        <p>Hosted by the Garner 2 Branch of The Church of Jesus Christ of Latter-day Saints.</p>
        <p lang="es">Organizado por la Rama Garner 2 de La Iglesia de Jesucristo de los Santos de los Últimos Días.</p>
      </footer>
    </main>
  );
}
