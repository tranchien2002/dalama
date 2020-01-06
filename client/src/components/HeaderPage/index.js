import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';
import './index.scss';

function HeaderPage() {
  const [classHeader, setClassHeader] = useState('');
  const [classShowMenu, setClassShowMenu] = useState('');
  const [classMenuToggle, setClassMenuToggle] = useState('');
  const [menuToggle, setMenuToggle] = useState(true);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        setClassHeader('navShadow');
        document.getElementById('ul-subMenu').classList.add('top-100');
      } else {
        setClassHeader('');
        document.getElementById('ul-subMenu').classList.remove('top-100');
      }
    });
  });

  function handleMenuToggle(e) {
    setMenuToggle(!menuToggle);
    if (menuToggle) {
      setClassMenuToggle('closeMenu');
      if (classHeader) {
        setClassShowMenu('showMenu top-100');
      } else {
        setClassShowMenu('showMenu');
      }
    } else {
      setClassMenuToggle('');
      setClassShowMenu('');
    }
  }
  return (
    <header>
      <nav className={classHeader}>
        <div id='brand'>
          <div id='logo' />
          <div id='word-mark' />
        </div>
        <div id='menu'>
          <div id='menu-toggle' onClick={handleMenuToggle} className={classMenuToggle}>
            <div id='menu-icon'>
              <div className='bar' />
              <div className='bar' />
              <div className='bar' />
            </div>
          </div>
          <ul className={'ul-menu-toggle ' + classShowMenu} id='ul-subMenu'>
            <li>
              <a href='#section00' />
            </li>
            <li>
              <a href='#section01' />
            </li>
            <li>
              <a href='#section02' />
            </li>
            <li>
              <a href='#section03' />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default HeaderPage;
