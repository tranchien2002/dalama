import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';
import './index.scss';
import { Card, Col, Row, Icon, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const antIcon = <Icon type='loading' style={{ fontSize: 30 }} spin />;

function Home() {
  const dispatch = useDispatch();
  let { listAssets } = useSelector((state) => ({
    listAssets: state.allAssets
  }));

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetWeb3Asset() {
      setLoading(true);
      await dispatch(actions.web3Connect());
      await dispatch(actions.fetchAsset());
      setLoading(false);
      console.log(listAssets);
    }
    fetWeb3Asset();
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
          <Spin spinning={loading} indicator={antIcon}>
            <Row gutter={16}>
              {listAssets.map((item, index) => (
                <Link key={index} to={'detail/' + item.id}>
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
                      <Meta
                        title={'' + item.findServiceByType('metadata').attributes.main.name}
                        description={
                          'Published: ' +
                          item.findServiceByType('metadata').attributes.main.datePublished
                        }
                      />
                    </Card>
                  </Col>
                </Link>
              ))}
            </Row>
          </Spin>
        </div>
      </section>
      {/* <FooterPage /> */}
    </div>
  );
}

export default Home;
