import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import SatelliteAltSharpIcon from '@mui/icons-material/SatelliteAltSharp';
import '../styles/Navbar.css';
import Dropdown from './Dropdown';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            ANATOLIA
            <SatelliteAltSharpIcon sx={{ display: "inline-block", height: 45, width: 45, pl: 2 }} />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li
              className='nav-item'
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <Link
                to='/presentation'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Presentation <i className='fas fa-caret-down' />
              </Link>
              {dropdown && <Dropdown />}
            </li>
            <li className='nav-item'>
              <Link
                to='/calendar'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Calendar
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/contact'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
            <li>
              <a
                href='https://www.oca.eu/fr/home-anatolia'
                target="_blank"
                rel="noreferrer"
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Sign In
              </a>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>SIGN IN</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
