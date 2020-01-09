import React, { Component } from 'react';
import './index.scss';
import { Layout, Button, Comment, Avatar, Input, List, Form, Tabs, Icon, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import moment from 'moment';
import { saveAs } from 'file-saver';
var JSZip = require('jszip');

const { Content } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout='horizontal'
    renderItem={props => <Comment {...props} />}
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
      listFiles: [1, 2, 3, 4, 5, 6],
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
      value: ''
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

  handleUpload = e => {
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
        console.log(allFileNames.length, demoFileCount, demoFileNames);

        zip.forEach(function(relativePath, zipEntry) {
          if (demoFileNames.includes(zipEntry.name)) {
            demoZip.file(zipEntry.name, zipEntry._data);
          }
        });
        demoZip.generateAsync({ type: 'blob' }).then(blob => {
          // TODO: day la file upload
          // https://stackoverflow.com/questions/46581488/how-to-download-and-upload-zip-file-without-saving-to-disk
          const file = new File(blob, 'demoZip.zip', { type: 'application/zip' });
          // UPLOAD HERE
          // saveAs(blob, 'demoFile.zip');
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

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <div>
        <Content className='content-detail'>
          <div className='detail-title'>
            <h1 className='detail-title-h1'>Title Of Asset</h1>
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
                <p>01/01/2020</p>
              </div>
              <div className='col-md-4 detail-description-category'>
                <Link to='/'>Category</Link>
              </div>
              <div className='col-md-4 detail-description-numberFile'>
                <p>6 Files</p>
              </div>
            </div>
            <div className='detail-description-content'>
              <h2 className='text-align-justify'>
                What a Waste is a global project to aggregate data on solid waste management from
                around the world. This database features the statistics collected through the
                effort, covering nearly all countries and over 330 cities. The metrics included
                cover all steps from the waste management value chain, including waste generation,
                composition, collection, and disposal, as well as information on user fees and
                financing, the informal sector, administrative structures, public communication, and
                legal information. The information presented is the best available based on a study
                of current literature and limited conversations with waste agencies and authorities.
                While there may be variations in the definitions and quality of reporting for
                individual data points, general trends should reflect the global reality. All
                sources and any estimations are noted.
              </h2>
            </div>
          </div>
          <hr />
          <h2 className='detail-goals'>Development Goals: Data Market Assets</h2>
          <div className='detail-author'>
            <Card className='text-align-left'>
              <div className='row detail-author-author'>
                <div className='col-md-4'>
                  <h3>
                    <b>Author</b>
                  </h3>
                </div>
                <div className='col-md-8'>
                  <p>World Development Indicators, The World Bank</p>
                </div>
              </div>
              <div className='row detail-author-license'>
                <div className='col-md-4'>
                  <h3>
                    <b>License</b>
                  </h3>
                </div>
                <div className='col-md-8'>
                  <p>CC-BY 4.0</p>
                </div>
              </div>
              <div className='row detail-author-did'>
                <div className='col-md-4'>
                  <h3>
                    <b>DID</b>
                  </h3>
                </div>
                <div className='col-md-8'>
                  <p>did:op:d00f6e8f6d184b0eb543494bd927116bedfc86eb83e24e539a5247f34c35ed33</p>
                </div>
              </div>
            </Card>
          </div>
          <div className='detail-files row'>
            {this.state.listFiles.map((item, index) => (
              <div className='col-md-4 ' key={index}>
                <div className='detail-files-file'>
                  <div className='detail-files-file-capacity'>
                    <p>.csv</p>
                    <p>111.33 KB</p>
                  </div>
                  <Button type='primary' icon='download'>
                    Get File
                  </Button>
                </div>
              </div>
            ))}
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
      </div>
    );
  }
}

export default DetailAsset;
