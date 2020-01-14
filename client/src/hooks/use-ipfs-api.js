/* eslint-disable no-console */

import { useEffect, useState } from 'react';
import ipfsClient from 'ipfs-http-client';

let ipfs = null;
let ipfsMessage = '';
let ipfsVersion = '';

export default async function useIpfsApi(config) {
  try {
    // eslint-disable-next-line require-atomic-updates
    ipfs = await ipfsClient(config);
    const version = await ipfs.version();
    ipfsVersion = version.version;
    ipfsMessage = `Connected to ${config.host}`;
  } catch (error) {
    console.log(error);
    // setIpfsError(`IPFS connection error: ${error.message}`);
  }

  // useEffect(() => {
  //   return function cleanup() {
  //     if (ipfs) {
  //       setIpfsReady(false);
  //       ipfs = null;
  //       ipfsMessage = '';
  //       ipfsVersion = '';
  //       setIpfsError('');
  //     }
  //   };
  // }, []);

  return { ipfs, ipfsVersion, ipfsMessage };
}
