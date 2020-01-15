import React from 'react';
import { Icon, Form, Input, Card } from 'antd';

const { TextArea } = Input;

const FormComment = Form.create({ name: 'form-comment' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {}

    render() {
      const { form } = this.props;
      const { handlePrice, handleDesc, handleUpload, linkFileDemo } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form layout='vertical'>
          <Card className='text-align-left'>
            <Form.Item label='Uploaded :'>
              <p>{linkFileDemo}</p>
            </Form.Item>
            <div className='row'>
              <div className='col-sm-6'>
                <Form.Item label='Price Asset'>
                  {getFieldDecorator('price', {
                    initialValue: '',
                    rules: [{ required: true, message: 'Please input the Price of Asset!' }]
                  })(
                    <Input
                      type='number'
                      prefix={<Icon type='dollar' theme='twoTone' />}
                      placeholder=' 0.5 (Ocean Token)'
                      onChange={handlePrice}
                      size='large'
                    />
                  )}
                </Form.Item>
              </div>
              <div className='col-sm-6'>
                <Form.Item label='File'>
                  {getFieldDecorator('file', {
                    rules: [{ required: true, message: 'Please input the File of Asset!' }]
                  })(
                    <Input
                      type='file'
                      onChange={(e) => {
                        handleUpload(e);
                      }}
                    />
                  )}
                </Form.Item>
              </div>
            </div>

            <Form.Item label='Description'>
              {getFieldDecorator('description', {
                initialValue: '',
                rules: [{ required: true, message: 'Please input the Description of Asset!' }]
              })(
                <TextArea
                  rows={4}
                  placeholder='Description for data submit'
                  onChange={handleDesc}
                />
              )}
            </Form.Item>
          </Card>
        </Form>
      );
    }
  }
);

export default FormComment;
