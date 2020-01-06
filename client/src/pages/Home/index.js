import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'actions';
import './index.scss';
import HeaderPage from 'components/HeaderPage';

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
      <HeaderPage />
      <div id='hero-section'>
        {/* <div id='head-line'/> */}
        <form className='flex-form'>
          <input type='search' placeholder='Where do you want to go?' />
          <input type='submit' value='Search' />
        </form>
      </div>
      <section id='section00'>
        {listAssets.map((item, index) => (
          <div id='heading' key={index}>
            <p>{item.stt}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
