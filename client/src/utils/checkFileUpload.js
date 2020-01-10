import axios from 'axios';
import { Logger } from '@oceanprotocol/squid';
export function streamFiles(ipfs, files) {
  return new Promise((resolve, reject) => {
    const stream = ipfs.addReadableStream({
      wrapWithDirectory: true
      // progress: (length: number) =>
      //     setFileSizeReceived(formatBytes(length, 0))
    });

    stream.on('data', (data) => {
      Logger.log(`Added ${data.path} hash: ${data.hash}`);
      // The last data event will contain the directory hash
      if (data.path === '') resolve(data.hash);
    });

    stream.on('error', reject);
    stream.write(files);
    stream.end();
  });
}

export async function pingUrl(url) {
  debugger;
  try {
    const response = await axios(url);
    if (response.status !== 200) console.log(`Not found: ${url}`);
    console.log(`File found: ${url}`);
    return true;
  } catch (error) {
    console.log(error.message);
  }
  return false;
}
