import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './index.scss';
import { Layout, Button, Comment, Avatar, Input, List, Form, Tabs, Icon, Upload } from 'antd';
import { Card, Spin } from 'antd';
import moment from 'moment';
import store from 'store';
import * as actions from 'actions';
import filesize from 'filesize';

import { saveAs } from 'file-saver';
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

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType='submit' loading={submitting} onClick={onSubmit} type='primary'>
        Add Comment
      </Button>
    </Form.Item>
  </div>
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
      value: '',
      btnLoading: []
    };

    this.handleUpload = this.handleUpload.bind(this);
  }

  // Ant Design Upload handler
  // handleUpload = info => {
  //   let demoZip = new JSZip();
  //   let dataFile = info.file;
  //   JSZip.loadAsync(dataFile).then(
  //     function(zip) {
  //       zip.forEach(function(relativePath, zipEntry) {
  //         console.log(relativePath);
  //         if (zipEntry.name.includes('.png')) {
  //           demoZip.file(zipEntry.name, zipEntry._data);
  //         }
  //       });
  //       demoZip.generateAsync({ type: 'blob' }).then(blob => {
  //         saveAs(blob, 'all_pngs.zip');
  //       });
  //     },
  //     function(e) {
  //       alert('error while read file');
  //     }
  //   );
  // };

  handleUpload = (e) => {
    let demoZip = new JSZip();
    let dataFile = e.target.files[0];
    JSZip.loadAsync(dataFile).then(
      function(zip) {
        let allFileNames = [];
        zip.forEach(function(relativePath, zipEntry) {
          // _ la MACOS auto file
          if (zipEntry.name[0] !== '_' && zipEntry.name.includes('.png')) {
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
        // console.log(allFileNames.length, demoFileCount, demoFileNames);

        zip.forEach(function(relativePath, zipEntry) {
          if (demoFileNames.includes(zipEntry.name)) {
            demoZip.file(zipEntry.name, zipEntry._data);
          }
        });
        demoZip.generateAsync({ type: 'blob' }).then((blob) => {
          console.log(blob);
          // TODO: day la file upload
          // https://stackoverflow.com/questions/46581488/how-to-download-and-upload-zip-file-without-saving-to-disk
          // https://stackoverflow.com/questions/45512546/failed-to-construct-file-iterator-getter-is-not-callable-in-chrome-60-when-us
          const file = new File([blob], 'demoZip.zip', { type: 'application/zip' });
          saveAs(file);
          console.log(file);
        });
      },
      function(e) {
        alert('error while read file');
      }
    );
  };

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true
    });

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: '',
        comments: [
          {
            author: 'Han Solo',
            avatar: <Avatar style={{ backgroundColor: '#87d068' }} icon='user' />,
            content: <p>{this.state.value}</p>,
            datetime: moment().fromNow()
          },
          ...this.state.comments
        ]
      });
    }, 1000);
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
      detailAsset: null,
      loading: false
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
          return ele != index;
        })
      });
      console.log('path', path);
    } catch (error) {
      alert(error);
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
    const { comments, submitting, value } = this.state;
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
                        <p>.{file.contentType}</p>
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
            {comments.length > 0 && <CommentList comments={comments} />}
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
                      <Form.Item label='Price Asset'>
                        <Input
                          type='number'
                          prefix={<Icon type='dollar' theme='twoTone' />}
                          placeholder=' 0.5 (Token)'
                        />
                      </Form.Item>
                    </div>
                    <div className='col-md-6'>
                      <input type='file' onChange={this.handleUpload} />
                      <Form.Item label='Files'>
                        <Upload onChange={this.handleUpload} listType='picture'>
                          <Button>
                            <Icon type='upload' /> Upload
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </div>
                </Card>
                <div className='btn-submit-asset'>
                  <Button
                    type='primary'
                    shape='round'
                    icon='check-circle'
                    className='float-left mt-sm-2'
                  >
                    Submit
                  </Button>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type='edit' />
                    Comment
                  </span>
                }
                key='2'
              >
                <Comment
                  avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon='user' />}
                  content={
                    <Editor
                      onChange={this.handleChange}
                      onSubmit={this.handleSubmit}
                      submitting={submitting}
                      value={value}
                    />
                  }
                />
              </TabPane>
            </Tabs>
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
