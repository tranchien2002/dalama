import React from 'react';
import { Button, Icon, Form, Input, Tabs, Upload } from 'antd';
import axios from 'axios';
import cleanupContentType from 'utils/cleanUpContentType.js';

const { TabPane } = Tabs;

const Form1 = Form.create({ name: 'form_1' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        typeChooseFile: 1,
        listUrl: props.file
      };
    }

    signal = axios.CancelToken.source();

    componentDidMount() {
      this.props.form.setFieldsValue({
        file: this.props.file
      });
    }

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

    addLink = async () => {
      let url = document.getElementById('url').value;
      var expression = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
      var regex = new RegExp(expression);
      if (regex.test(url)) {
        document.getElementById('url').parentElement.classList.remove('has-error');
        var listUrl = this.state.listUrl;
        const file = await this.getLink(url);
        listUrl.push(file);
        this.setState(listUrl);
        this.setState({ typeChooseFile: 2 });
        this.setState({ typeChooseFile: 1 });
        this.props.form.setFieldsValue({
          file: this.state.listUrl
        });
        console.log(this.state.listUrl);
      } else {
        document.getElementById('url').parentElement.classList.add('has-error');
      }
    };

    render() {
      const { form, title } = this.props;
      const { getFieldDecorator } = form;
      return (
        <div className='ant-modal-body'>
          <Form layout='vertical'>
            <h2 className='ant-typography'>Essentials</h2>
            <Form.Item label='Name'>
              {getFieldDecorator('title', {
                initialValue: title,
                rules: [{ required: true, message: 'Please input the Title of Asset!' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label='File'>
              {getFieldDecorator('file', {
                rules: [{ required: true, message: 'Please input the File of Asset!' }]
              })(<Input className='display-none' />)}
              {this.state.listUrl.map((file, index) => (
                <div key={index} className='pl-3'>
                  <hr />
                  <div className='row mt-2 mb-2'>
                    <div className='text-align-left col-10'>
                      <a href={file.url} target='_blank' rel='noopener noreferrer'>
                        {file.url}
                      </a>
                    </div>
                    <div
                      className='col-2 text-align-right pr-4 cursor-pointer'
                      onClick={() => {
                        var listUrl = this.state.listUrl;
                        listUrl.splice(index, 1);
                        this.setState({ listUrl });
                        this.props.form.setFieldsValue({
                          file: this.state.listUrl
                        });
                      }}
                    >
                      <Icon type='close-circle' />
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </Form.Item>
            <Tabs
              defaultActiveKey='1'
              onChange={(e) => {
                this.setState({ typeChooseFile: parseInt(e) });
              }}
            >
              <TabPane
                tab={
                  <span>
                    <Icon type='link' />
                    From URL
                  </span>
                }
                key='1'
              >
                {this.state.typeChooseFile === 1 ? (
                  <div className='row'>
                    <div className='col-12 col-sm-9'>
                      <Input type='text' id='url' />
                      <div className='ant-form-explain message-err-custom display-none'>
                        Please enter a valid URL!
                      </div>
                    </div>
                    <div className='col-12 col-sm-3'>
                      <Button
                        type='primary'
                        shape='round'
                        icon='plus-circle'
                        className='float-left mt-sm-2'
                        onClick={this.addLink}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ) : null}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type='cloud-upload' />
                    Add to IPFS
                  </span>
                }
                key='2'
              >
                {this.state.typeChooseFile === 2 ? (
                  <Upload>
                    <Button>
                      <Icon type='upload' /> Upload
                    </Button>
                  </Upload>
                ) : null}
              </TabPane>
            </Tabs>
          </Form>
        </div>
      );
    }
  }
);

export default Form1;
