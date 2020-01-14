import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';
import './index.scss';
import { Card, Col, Row, Icon, Spin, Pagination } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const antIcon = <Icon type='loading' style={{ fontSize: 30 }} spin />;

function Home() {
  const dispatch = useDispatch();
  let { listAssets } = useSelector((state) => ({
    listAssets: state.allAssets
  }));

  const [loading, setLoading] = useState(false);
  const [assetsPagination, setAssetsPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetWeb3Asset() {
      setLoading(true);
      await dispatch(actions.web3Connect());
      await dispatch(actions.fetchAsset());
      setLoading(false);
    }
    fetWeb3Asset();
  }, [dispatch]);

  useEffect(() => {
    let paginationAssetsFirst = async (page) => {
      setCurrentPage(page);
      let startRecord = (page - 1) * 9;
      let endRecord = startRecord + 8;
      setAssetsPagination(
        listAssets.filter((data, index) => index >= startRecord && index <= endRecord)
      );
    };
    paginationAssetsFirst(currentPage);
  }, [currentPage, listAssets]);

  let paginationAssets = async (page) => {
    setCurrentPage(page);
    let startRecord = (page - 1) * 9;
    let endRecord = startRecord + 8;
    setAssetsPagination(
      listAssets.filter((data, index) => index >= startRecord && index <= endRecord)
    );
  };

  let search = async (e) => {
    e.preventDefault();
    await dispatch(actions.searchAssets(searchTerm));
  };

  return (
    <div>
      <div id='hero-section'>
        <form className='flex-form'>
          <input
            type='search'
            placeholder='What assets do you need to find?'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input type='submit' value='Search' onClick={search} />
        </form>
      </div>
      <section id='section00'>
        <div className='content-home'>
          <Spin spinning={loading} indicator={antIcon}>
            <Row gutter={16}>
              {assetsPagination.map((item, index) => (
                <Link key={index} to={'detail/' + item.id}>
                  <Col xs={24} sm={12} md={12} lg={8} className='col-card-home'>
                    <Card
                      className='card-home'
                      hoverable
                      cover={
                        <img
                          alt='example'
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
            <Pagination
              defaultCurrent={1}
              total={listAssets ? listAssets.length : 0}
              onChange={paginationAssets}
              pageSize={9}
              showTotal={(total) => `Total ${total} items`}
            />
          </Spin>
        </div>
      </section>
    </div>
  );
}

export default Home;
