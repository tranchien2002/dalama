import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './index.scss';
import { Layout, Button, Comment, Avatar, Input, List, Form, Tabs, Icon, message } from 'antd';
import { Card, Spin } from 'antd';
import moment from 'moment';
import store from 'store';
import * as actions from 'actions';
import filesize from 'filesize';
import { streamFiles } from 'utils/checkFileUpload.js';
import { ipfsNodeUri, ipfsGatewayUri } from 'config.js';
import getIpfs from 'utils/getIpfs';
import LabeledModel from 'models/LabeledModel';
import axios from 'axios';
import cleanupContentType from 'utils/cleanUpContentType.js';
var JSZip = require('jszip');

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;

const antIcon = <Icon type='loading' style={{ fontSize: 30 }} spin />;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout='horizontal'
    renderItem={(props) => <Comment {...props} />}
  />
);

class DetailAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [
        {
          author: 'Han Solo',
          avatar: <Avatar style={{ backgroundColor: '#87d068' }} icon='user' />,
          content: (
            <p>
              We supply a series of design principles, practical patterns and high quality design
              resources (Sketch and Axure), to help people create their product prototypes
              beautifully and efficiently.
            </p>
          ),
          datetime: moment().fromNow()
        }
      ],
      submitting: false,
      price: '',
      description: '',
      btnLoading: [],
      urlData: '',
      urlGateway: '',
      loadingFile: false
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.addToIpfs = this.addToIpfs.bind(this);
  }

  signal = axios.CancelToken.source();

  addToIpfs = async (data) => {
    try {
      const { hostname, port, protocol } = new URL(ipfsNodeUri);
      const ipfsConfig = {
        protocol: protocol.replace(':', ''),
        host: hostname,
        port: port || '443'
      };
      const { ipfs, ipfsVersion, ipfsMessage } = await getIpfs(ipfsConfig);
      console.log(ipfs, ipfsVersion, ipfsMessage);
      const cid = await streamFiles(ipfs, data);
      console.log(`File added: ${cid}`);
      return cid;
    } catch (error) {
      console.log(error);
      // setError(`Adding to IPFS failed: ${error.message}`);
      // setLoading(false);
    }
  };

  handleUpload = async (e) => {
    let demoZip = new JSZip();
    let dataFile = e.target.files[0];
    let fileDemo = null;
    let context = this;
    this.setState({ loadingFile: true });
    await JSZip.loadAsync(dataFile, context).then(
      function(zip) {
        let allFileNames = [];
        zip.forEach(function(relativePath, zipEntry) {
          // _ la MACOS auto file
          if (
            zipEntry.name[0] !== '_' &&
            (zipEntry.name.includes('.jpeg') ||
              zipEntry.name.includes('.png') ||
              zipEntry.name.includes('.txt'))
          ) {
            allFileNames.push(zipEntry.name);
          }
        });
        if (allFileNames.length < 1) return;
        let demoFileCount = Math.max(1, parseInt(allFileNames.length / 4));
        let demoFileNames = allFileNames
          .sort(() => {
            return 0.5 - Math.random();
          })
          .slice(0, demoFileCount);

        zip.forEach(function(relativePath, zipEntry) {
          if (demoFileNames.includes(zipEntry.name)) {
            demoZip.file(zipEntry.name, zipEntry._data);
          }
        });
        demoZip.generateAsync({ type: 'blob' }).then(async (blob) => {
          // https://stackoverflow.com/questions/46581488/how-to-download-and-upload-zip-file-without-saving-to-disk
          // https://stackoverflow.com/questions/45512546/failed-to-construct-file-iterator-getter-is-not-callable-in-chrome-60-when-us
          fileDemo = new File([blob], 'demoZip.zip', { type: 'application/zip' });
          let demo_cid = await context.addToIpfs({ path: fileDemo.name, content: fileDemo });
          let data_cid = await context.addToIpfs({ path: dataFile.name, content: dataFile });
          // console.log('fileDemo', `${ipfsGatewayUri}/ipfs/${demo_cid}/${fileDemo.name}`);

          context.setState({
            urlGateway: `${ipfsGatewayUri}/ipfs/${demo_cid}/${fileDemo.name}`,
            urlData: `ipfs://${data_cid}/${dataFile.name}`,
            loadingFile: false
          });
        });
      },
      function(e) {
        this.setState({ loadingFile: false });
        alert('error while read file');
      }
    );
  };

  getLink = async (url) => {
    let file = {
      url,
      contentType: '',
      found: false
    };

    try {
      const response = await axios({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://commons-server.oceanprotocol.com/api/v1/urlcheck',
        data: { url },
        cancelToken: this.signal.token
      });

      let { contentLength, contentType, found } = response.data.result;
      if (contentLength) file.contentLength = contentLength;
      if (contentType) {
        file.contentType = contentType;
        file.compression = cleanupContentType(contentType);
      }

      file.found = found;

      return file;
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmit = async () => {
    let files = [];
    const file = await this.getLink(this.state.urlData);
    if (file) {
      files.push(file);
    }
    files = files.map(({ found, ...keepAttrs }) => keepAttrs);
    const newData = {
      main: {
        ...LabeledModel.main,
        name: this.state.detailAsset.service['0'].attributes.main.name + ' labeled',
        type: 'dataset',
        dateCreated: new Date().toISOString().split('.')[0] + 'Z',
        price: (this.state.price * 10 ** 18).toString(),
        files: files
      },
      additionalInformation: {
        ...LabeledModel.additionalInformation,
        demo: this.state.urlGateway,
        description: this.state.description
      }
    };
    try {
      this.setState({ loading: true });
      const accounts = await this.props.ocean.accounts.list();
      const asset = await this.props.ocean.assets.create(newData, accounts[0]);
      store.dispatch(actions.insertLabeledData(this.props.match.params.did, asset));
      console.log(asset);
      this.setState({ loading: false });
      message.success('Processing complete!');
    } catch (e) {
      this.setState({ loading: false });
      console.error(e);
    }
  };

  handlePrice = (e) => {
    this.setState({
      price: e.target.value
    });
  };

  handleDesc = (e) => {
    this.setState({
      description: e.target.value
    });
  };

  purchaseAsset = async (ddo, index) => {
    const ocean = this.props.ocean;
    try {
      const accounts = await ocean.accounts.list();
      const service = ddo.findServiceByType('access');
      const agreements = await ocean.keeper.conditions.accessSecretStoreCondition.getGrantedDidByConsumer(
        accounts[0].id
      );
      const agreement = agreements.find((element) => {
        return element.did === ddo.id;
      });
      let agreementId;
      if (agreement) {
        ({ agreementId } = agreement);
      } else {
        agreementId = await ocean.assets.order(ddo.id, service.index, accounts[0]);
      }
      const path = await ocean.assets.consume(
        agreementId,
        ddo.id,
        service.index,
        accounts[0],
        '',
        index
      );
      this.setState({
        btnLoading: this.state.btnLoading.filter(function(ele) {
          return ele !== index;
        })
      });
      console.log('path', path);
    } catch (error) {
      alert(error.message);
      this.setState({
        btnLoading: this.state.btnLoading.filter(function(ele) {
          return ele !== index;
        })
      });
    }
  };

  async componentDidMount() {
    let did = this.props.match.params.did;
    this.setState({ loading: true });
    await store.dispatch(actions.web3Connect());
    let asset = await this.props.ocean.assets.resolve(did);
    this.setState({ loading: false, detailAsset: asset });
  }

  render() {
    const { comments } = this.state;
    const { loading, detailAsset } = this.state;

    return (
      <Spin spinning={loading} indicator={antIcon}>
        <Content className='content-detail'>
          <div className='detail-title'>
            <h1 className='detail-title-h1'>
              {detailAsset ? detailAsset.service['0'].attributes.main.name : null}
            </h1>
            <img
              alt=''
              src={require('assets/images/asset-0.png')}
              className='width-100 detail-image-header'
            />
          </div>
          <hr />
          <div className='detail-description'>
            <div className='row'>
              <div className='col-md-4 detail-description-date'>
                <p>{detailAsset ? detailAsset.service['0'].attributes.main.dateCreated : null}</p>
              </div>
              <div className='col-md-4 detail-description-category'></div>
              <div className='col-md-4 detail-description-numberFile'>
                <p>
                  {detailAsset ? detailAsset.service['0'].attributes.main.files.length : null} Files
                </p>
              </div>
            </div>
            <div className='detail-description-content'>
              <h2 className='text-align-justify'>
                {detailAsset
                  ? detailAsset.service['0'].attributes.additionalInformation.description
                  : null}
              </h2>
            </div>
          </div>
          <hr />
          {/* <h2 className='detail-goals'>Development Goals: Data Market Assets</h2> */}
          <div className='detail-author'>
            <Card className='text-align-left'>
              <div className='row detail-author-author'>
                <div className='col-md-4'>
                  <h3>
                    <b>Author</b>
                  </h3>
                </div>
                <div className='col-md-8'>
                  <p>{detailAsset ? detailAsset.service['0'].attributes.main.author : null}</p>
                </div>
              </div>
              <div className='row detail-author-license'>
                <div className='col-md-4'>
                  <h3>
                    <b>License</b>
                  </h3>
                </div>
                <div className='col-md-8'>
                  <p>{detailAsset ? detailAsset.service['0'].attributes.main.license : null}</p>
                </div>
              </div>
              <div className='row detail-author-did'>
                <div className='col-md-4'>
                  <h3>
                    <b>DID</b>
                  </h3>
                </div>
                <div className='col-md-8'>
                  <p>{detailAsset ? detailAsset.id : null}</p>
                </div>
              </div>
            </Card>
          </div>
          <div className='detail-files row'>
            {detailAsset
              ? detailAsset.service['0'].attributes.main.files.map((file, index) => (
                  <div className='col-md-4 margin-0-auto' key={index}>
                    <div className='detail-files-file'>
                      <div className='detail-files-file-capacity'>
                        <p>{file.contentType.split('/')[1]}</p>
                        <p>{filesize(file.contentLength)}</p>
                      </div>
                      <Button
                        type='primary'
                        icon='download'
                        onClick={() => {
                          this.purchaseAsset(detailAsset, file.index || 0);
                          this.setState({ btnLoading: [...this.state.btnLoading, index] });
                        }}
                        loading={this.state.btnLoading.includes(index) ? true : false}
                      >
                        Get File
                      </Button>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className='detail-upload'>
            <h1 className='text-align-left'>Exchange - Comment</h1>
            <Tabs defaultActiveKey='1'>
              <TabPane
                tab={
                  <span>
                    <Icon type='cloud-upload' />
                    Upload-asset
                  </span>
                }
                key='1'
              >
                <Card className='text-align-left'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <p>{this.state.urlData ? 'Uploaded: ' + this.state.urlData : ''}</p>
                      <Form.Item label='Price Asset'>
                        <Input
                          type='number'
                          prefix={<Icon type='dollar' theme='twoTone' />}
                          placeholder=' 0.5 (Ocean Token)'
                          onChange={this.handlePrice}
                          value={this.state.price}
                        />
                      </Form.Item>
                      <Form.Item label='Description'>
                        <TextArea
                          row='8'
                          placeholder='Description for data submit'
                          onChange={this.handleDesc}
                          value={this.state.description}
                        />
                      </Form.Item>
                    </div>
                    <div className='col-md-8'>
                      <input type='file' onChange={this.handleUpload} />
                    </div>
                  </div>
                </Card>
                <div className='btn-submit-asset'>
                  <Button
                    type='primary'
                    onClick={this.handleSubmit}
                    loading={this.state.loadingFile}
                  >
                    Submit
                  </Button>
                </div>
              </TabPane>
            </Tabs>
            {comments.length > 0 && <CommentList comments={comments} />}
          </div>
        </Content>
      </Spin>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ocean: state.ocean
  };
};

export default compose(connect(mapStateToProps))(DetailAsset);
