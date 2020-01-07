import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';
import './index.scss';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;

function Home() {
  const dispatch = useDispatch();
  let { listAssets } = useSelector((state) => ({
    listAssets: state.listAssets
  }));

  useEffect(() => {
    async function fetWeb3Init() {
      await dispatch(actions.web3Connect());
    }
    async function fetchAssest() {
      await dispatch(actions.fetchAssest());
    }
    fetWeb3Init();
    fetchAssest();
  }, [dispatch]);

  return (
    <div>
      <div id='hero-section'>
        <form className='flex-form'>
          <input type='search' placeholder='What assets do you need to find?' />
          <input type='submit' value='Search' />
        </form>
      </div>
      <section id='section00'>
        <div className='content-home'>
          <Row gutter={16}>
            {listAssets.map((item, index) => (
              <Link key={index} to={'detail/' + item.stt}>
                <Col xs={24} sm={12} md={12} lg={8} className='col-card-home'>
                  <Card
                    className='card-home'
                    hoverable
                    cover={
                      <img
                        alt='example'
                        height='181px'
                        src={
                          index % 2 === 0
                            ? require('assets/images/images-default-2.png')
                            : require('assets/images/images-default-1.png')
                        }
                      />
                    }
                  >
                    <Meta title={'' + item.stt} description='www.instagram.com' />
                  </Card>
                </Col>
              </Link>
            ))}
          </Row>
        </div>
      </section>
      {/* <FooterPage /> */}
    </div>
  );
}

export default Home;
