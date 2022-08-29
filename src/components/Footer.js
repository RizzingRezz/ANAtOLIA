import React from 'react';
import '../styles/Footer.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Join the Adventure newsletter to receive the news
        </p>
        <p className='footer-subscription-text'>
          You can unsubscribe at any time.
        </p>
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
            <Button buttonStyle='btn--outline'>Subscribe</Button>
          </form>
        </div>
      </section>
      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>About</h2>
            <Link to='/presentation'>Presentation</Link>
            <Link to='/instruments'>Instruments</Link>
            <Link to='/consortium'>Consortium</Link>
            <Link to='/data'>Data</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Contact Us</h2>
            <Link to='/contact'>Contact</Link>
          </div>
        </div>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <a href='https://lagrange.oca.eu/fr/'
              target='_blank'
              rel="noreferrer"
              className='social-logo'
            >
              <img src='/images/lagrange.jpg' alt='Lagrange' />
            </a>
          </div>
          <small className='website-rights'>oca.eu © 2022 - Tout droit réservé</small>
          <div className='social-icons'>
            <a
              className='social-icon-link twitter'
              href='https://twitter.com/LagrangeLab'
              rel="noreferrer"
              target='_blank'
              aria-label='Twitter'
            >
              <i className='fab fa-twitter' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
