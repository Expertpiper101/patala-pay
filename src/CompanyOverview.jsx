import brandLogo from '../assets/patala-pay-logo.svg';
import {EnquiriesView} from './App.jsx';
import {COMPANY_PATH,POS_PATH} from './routes.js';
import './company.css';

function ConnectedBusiness(){
  return <div className="company-illustration" aria-label="Patala-Pay connects point of sale, Web Admin and your online store">
    <div className="company-visual-top"><span>YOUR BUSINESS. CONNECTED.</span><span className="company-live-dot">The Patala-Pay approach</span></div>
    <svg className="company-terminal" viewBox="0 0 500 330" role="img" aria-label="Illustration of a point-of-sale counter with a screen, receipt and payment terminal">
      <defs><pattern id="company-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#d6d3cc"/></pattern></defs>
      <rect x="10" y="10" width="480" height="300" fill="url(#company-dots)"/>
      <circle cx="280" cy="151" r="125" fill="#ee302b"/>
      <path d="M211 237h66l18 46H193z" fill="#252525"/><rect x="173" y="275" width="143" height="14" rx="3" fill="#151515"/>
      <rect x="80" y="48" width="319" height="200" rx="11" fill="#151515"/><rect x="92" y="61" width="295" height="174" rx="3" fill="white"/>
      <rect x="107" y="76" width="38" height="8" rx="2" fill="#ee302b"/><text x="151" y="84" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="12" fill="#151515">patala-pay</text>
      <path d="M107 98h265" stroke="#e4e2dc"/><rect x="107" y="112" width="76" height="87" rx="3" fill="#f2f0eb"/><path d="M127 131h35m-35 14h35m-35 14h24" stroke="#a4a19a" strokeWidth="4"/>
      <rect x="195" y="112" width="176" height="25" rx="3" fill="#f2f0eb"/><rect x="195" y="146" width="176" height="25" rx="3" fill="#f2f0eb"/><rect x="195" y="180" width="176" height="30" rx="3" fill="#151515"/>
      <text x="210" y="129" fontFamily="Arial,sans-serif" fontSize="11" fill="#555">Products &amp; stock</text><text x="210" y="163" fontFamily="Arial,sans-serif" fontSize="11" fill="#555">Sales &amp; receipts</text><text x="210" y="199" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="11" fill="white">Ready for your next customer</text>
      <rect x="345" y="205" width="77" height="94" rx="9" fill="#333"/><rect x="355" y="216" width="57" height="32" rx="3" fill="#dbe8d9"/><path d="M359 260h10m11 0h10m11 0h6m-48 11h10m11 0h10m11 0h6m-48 11h10m11 0h10" stroke="white" strokeWidth="4"/>
      <path d="M24 225h86v-78H24v78l9-6 9 6 9-6 9 6 9-6 9 6 9-6 11 6z" fill="white" stroke="#ccc8bf"/><path d="M38 165h57m-57 12h57m-57 12h36m-36 17h57" stroke="#bbb7ad" strokeWidth="3"/>
      <path d="M16 300h460" stroke="#151515" strokeWidth="3"/>
    </svg>
    <div className="company-tool-strip"><span><b>01</b> Point of sale</span><span><b>02</b> Web Admin</span><span><b>03</b> Online store</span></div>
    <p className="company-visual-note">An illustration of our connected business tools.</p>
  </div>;
}

export default function CompanyOverview(){
  return <div className="company-site">
    <a className="company-skip" href="#company-main">Skip to content</a>
    <header className="company-header">
      <a href={COMPANY_PATH} className="company-brand" aria-label="Patala-Pay home"><img src={brandLogo} alt="Patala-Pay"/></a>
      <nav aria-label="Company navigation"><a href="#about">Our story</a><a href="#services">What we do</a><a href={POS_PATH}>Point of sale <span aria-hidden="true">↗</span></a><a className="company-nav-contact" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a></nav>
    </header>
    <main id="company-main" className="company-main">
      <section className="company-hero" aria-labelledby="company-title">
        <div className="company-hero-copy"><p className="company-kicker">PAYMENT IDEAS. PRACTICAL BUSINESS TOOLS.</p><h1 id="company-title">Small business.<br/><span>Bigger</span><br/><span>possibilities.</span></h1><p className="company-intro">We’re Patala-Pay, a South African payment solutions startup. We’re working towards new ways to pay—and making the tools to run a small business more affordable today.</p><div className="company-actions"><a className="company-button" href={POS_PATH}>Explore our point of sale <span aria-hidden="true">↗</span></a><a className="company-text-link" href="#contact">Tell us about your business <span aria-hidden="true">→</span></a></div><p className="company-origin">LOCAL THINKING. <span/> SOUTH AFRICAN AMBITION.</p></div>
        <ConnectedBusiness/>
      </section>
      <section id="about" className="company-story" aria-labelledby="company-story-title">
        <div><p className="company-kicker">OUR STORY / JUST GETTING STARTED</p><h2 id="company-story-title">A big ambition.<br/>A practical place to start.</h2></div>
        <div className="company-story-copy"><p>Good business ideas deserve a chance to grow. We’re building Patala-Pay around that belief: simpler tools, accessible technology and a closer understanding of the businesses using them.</p><p>Our starting point is affordable point-of-sale software for small businesses across South Africa, with Web Admin and online store tools to support everyday selling.</p><p>Our ambition goes further. We’re exploring how new payment systems could make paying and getting paid simpler for businesses and their customers.</p></div>
      </section>
      <section id="services" className="company-services" aria-labelledby="company-services-title">
        <div className="company-section-heading"><div><p className="company-kicker">WHAT WE OFFER TODAY</p><h2 id="company-services-title">From the counter<br/>to the online customer.</h2></div><p>Practical tools to help you sell, manage your business and reach more customers.</p></div>
        <div className="company-services-layout">
          <article className="company-pos-service"><span className="company-service-number">01 / POINT OF SALE</span><h3>A better-equipped<br/>business starts here.</h3><p>Affordable POS software for your everyday sales. Manage products, track stock, issue receipts and review your business activity.</p><ul><li>Desktop point of sale</li><li>Sales, stock and reporting</li><li>Licences, packages and hardware options</li></ul><a className="company-button company-button-light" href={POS_PATH}>See POS packages <span aria-hidden="true">↗</span></a></article>
          <div className="company-service-rows">
            <article><span className="company-service-number">02 / WEB ADMIN</span><h3>See the bigger picture.</h3><p>Keep your product catalogue organised and view business records and reports through a web interface. Put the details you need within reach.</p></article>
            <article><span className="company-service-number">03 / ONLINE STORE</span><h3>Take your shop further.</h3><p>Give customers a place to browse your products and place orders online. Connect your shop’s catalogue with your online store, including product photos, sizes and colours.</p></article>
            <article><span className="company-service-number">04 / SETUP &amp; SUPPORT</span><h3>Get started with a conversation.</h3><p>Talk to us about choosing a package, suitable hardware, setting up your system or connecting checkout to a supported payment provider.</p><a className="company-text-link" href="#contact">Ask us what fits your business <span aria-hidden="true">→</span></a></article>
          </div>
        </div>
      </section>
      <section className="company-innovation" aria-labelledby="company-innovation-title"><div><p className="company-kicker">WHERE WE’RE HEADING</p><h2 id="company-innovation-title">Better payment ideas<br/>start with real people.</h2><p>We’re a startup with a long-term ambition: to develop innovative payment solutions shaped by South African needs. We’re interested in the everyday friction businesses and customers experience, and the ideas that could make a difference.</p><a className="company-text-link" href="#contact">Share an idea or explore a partnership <span aria-hidden="true">→</span></a></div><div className="company-innovation-mark" aria-hidden="true"><span>PAY.</span><span>CONNECT.</span><span>GROW.</span><small>LOCAL IDEAS. NEW POSSIBILITIES.</small></div></section>
      <section className="company-start" aria-labelledby="company-start-title"><div><p className="company-kicker">MADE FOR EVERYDAY BUSINESS</p><h2 id="company-start-title">Your next step<br/>can be a small one.</h2><p>Starting a shop, improving your counter setup or bringing your products online? Tell us where you are, and we’ll help you explore the right Patala-Pay tools.</p><a className="company-text-link" href={POS_PATH}>Already looking for a POS? Start here <span aria-hidden="true">↗</span></a></div><ol><li><span>01</span><div><h3>Tell us about your business.</h3><p>Your shop, your day-to-day needs and what you want to do next.</p></div></li><li><span>02</span><div><h3>Find a setup that fits.</h3><p>Explore software, hardware and online selling options with us.</p></div></li><li><span>03</span><div><h3>Get ready for the everyday.</h3><p>Discuss setup and support so you can focus on serving customers.</p></div></li></ol></section>
      <div id="contact" className="company-contact"><EnquiriesView embedded/></div>
    </main>
    <footer className="company-footer"><a className="company-footer-brand" href={COMPANY_PATH}><img src={brandLogo} alt="Patala-Pay home"/></a><p>A South African startup.<br/>Payment ideas. Practical business tools.</p><div><a href={POS_PATH}>Point of sale ↗</a><a href="mailto:info@primon.co.za">info@primon.co.za</a><a href="tel:+27727752083">072 775 2083</a></div><a className="company-to-top" href="#company-main">Back to top ↑</a></footer>
  </div>;
}
