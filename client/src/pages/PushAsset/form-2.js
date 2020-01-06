import React from 'react';
import { Icon, Form, Input, Row } from 'antd';

const Form2 = Form.create({ name: 'form_2' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <div className='ant-modal-body'>
          <Form layout='vertical'>
            <h2 className='ant-typography'>Information</h2>
            <Form.Item label='Description'>
              {getFieldDecorator('description', {
                rules: [{ required: true, message: 'Please input the Description of Asset!' }]
              })(<Input type='textarea' />)}
            </Form.Item>
            <Form.Item label='Category'>
              {getFieldDecorator('category', {
                rules: [{ required: true, message: 'Please input the Category of Asset!' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label='Creation Date'>
              {getFieldDecorator('creationDate', {
                rules: [{ required: true, message: 'Please input the Creation Date of Asset!' }]
              })(<Input />)}
            </Form.Item>
          </Form>
        </div>
      );
    }
  }
);

export default Form2;
