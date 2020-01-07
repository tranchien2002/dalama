import React, { Component } from 'react';
import { Layout } from 'antd';
import './index.scss';
const { Footer } = Layout;

class FooterPage extends Component {
  render() {
    return (
      <div>
        <Footer style={{ textAlign: 'center' }} className='footer-home'>
          <div className='div-footer'>
            Dalama - Data Label Market ©2020 Created by Team BlockChain Research / R&D Sun -
            Asterisk
          </div>
        </Footer>
      </div>
    );
  }
}

export default FooterPage;
