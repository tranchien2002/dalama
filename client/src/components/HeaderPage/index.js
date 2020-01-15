import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import './index.scss';

function HeaderPage() {
  const [classHeader, setClassHeader] = useState('');
  const [classShowMenu, setClassShowMenu] = useState('');
  const [classMenuToggle, setClassMenuToggle] = useState('');
  const [menuToggle, setMenuToggle] = useState(true);

  let { account, eth, ocn } = useSelector((state) => ({
    account: state.account,
    eth: state.eth,
    ocn: state.ocn
  }));

  const menu = (
    <Menu>
      <Menu.Item key='1'>Account: {account}</Menu.Item>
      <Menu.Item key='2'>Eth: {eth}</Menu.Item>
      <Menu.Item key='3'>Ocean: {ocn}</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    let scrollPage = () => {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
          setClassHeader('navShadow');
          document.getElementById('ul-subMenu').classList.add('top-100');
        } else {
          setClassHeader('');
          document.getElementById('ul-subMenu').classList.remove('top-100');
        }
      });
    };
    scrollPage();
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
          <div id='word-mark'>
            <img src={require('assets/images/word.png')} alt='work-mark' />
          </div>
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
              <Link to='/'>
                <h3>Home</h3>
              </Link>
            </li>
            <li>
              <Link to='/new-asset'>
                <h3>Publish</h3>
              </Link>
            </li>
            <li>
              <Link to='/my-assets'>
                <h3>MyAssets</h3>
              </Link>
            </li>
            <li>
              <Dropdown overlay={menu}>
                <p className='ant-dropdown-link'>
                  <h3 id='my-account'>
                    My Account
                    <Icon type='down' />
                  </h3>
                </p>
              </Dropdown>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default HeaderPage;
