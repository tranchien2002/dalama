import React from 'react';
import { Button, Icon, Form, Input, Tabs, Upload } from 'antd';

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

    componentDidMount() {
      this.props.form.setFieldsValue({
        file: this.props.file
      });
    }

    addLink = async () => {
      let url = document.getElementById('url').value;
      var expression = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
      var regex = new RegExp(expression);
      if (regex.test(url)) {
        document.getElementById('url').parentElement.classList.remove('has-error');
        var listUrl = this.state.listUrl;
        listUrl.push(url);
        this.setState({ listUrl });
        this.setState({ typeChooseFile: 2 });
        this.setState({ typeChooseFile: 1 });
        this.props.form.setFieldsValue({
          file: this.state.listUrl
        });
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
            <Form.Item label='Title'>
              {getFieldDecorator('title', {
                initialValue: title,
                rules: [{ required: true, message: 'Please input the Title of Asset!' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label='File'>
              {getFieldDecorator('file', {
                rules: [{ required: true, message: 'Please input the File of Asset!' }]
              })(<Input className='display-none' />)}
              {this.state.listUrl.map((url, index) => (
                <div key={index} className='pl-3'>
                  <hr />
                  <div className='row mt-2 mb-2'>
                    <div className='text-align-left col-10'>
                      <a href={url} target='_blank' rel='noopener noreferrer'>
                        {url}
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
