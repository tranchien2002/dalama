import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';
import './index.scss';
import { Card, Col, Row, Icon, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const antIcon = <Icon type='loading' style={{ fontSize: 30 }} spin />;

function MyAssets() {
  const dispatch = useDispatch();
  let { myAssets } = useSelector((state) => ({
    myAssets: state.myAssets
  }));

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetMyAsset() {
      setLoading(true);
      await dispatch(actions.web3Connect());
      await dispatch(actions.getMyAssets());
      setLoading(false);
    }
    fetMyAsset();
  }, [dispatch]);

  return (
    <div>
      <section id='section00' className='my-asset'>
        <div className='content-my-asset'>
          <Spin spinning={loading} indicator={antIcon}>
            <Row gutter={16}>
              {myAssets
                ? myAssets.map((item, index) => (
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
                            title={'' + item.service['0'].attributes.main.name}
                            description={
                              'Published: ' + item.service['0'].attributes.main.datePublished
                            }
                          />
                        </Card>
                      </Col>
                    </Link>
                  ))
                : null}
            </Row>
          </Spin>
        </div>
      </section>
      {/* <FooterPage /> */}
    </div>
  );
}

export default MyAssets;
