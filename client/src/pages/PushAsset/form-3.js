import React from 'react';
import { Form, Input, Select } from 'antd';
import { OPTIONS_LICENSE } from 'constant/ListOption.js';

const { Option } = Select;
const Form3 = Form.create({ name: 'form_3' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedItems: []
      };
    }

    render() {
      const { form, author, copyrightHolder, license } = this.props;
      const { getFieldDecorator } = form;
      const { selectedItems } = this.state;
      const filteredOptions = OPTIONS_LICENSE.filter((o) => !selectedItems.includes(o));
      return (
        <div className='ant-modal-body'>
          <Form layout='vertical'>
            <h2 className='ant-typography'>Authorship</h2>
            <Form.Item label='Author'>
              {getFieldDecorator('author', {
                initialValue: author,
                rules: [{ required: true, message: 'Please input the Author of Asset!' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label='Copyright Holder'>
              {getFieldDecorator('copyrightHolder', {
                initialValue: copyrightHolder,
                rules: [{ required: true, message: 'Please input the Copyright Holder of Asset!' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label='License'>
              {getFieldDecorator('license', {
                initialValue: license ? license : '',
                rules: [{ required: true, message: 'Please input the license of Asset!' }]
              })(
                <Select showSearch className='width-100'>
                  <Option value=''>---</Option>
                  {filteredOptions.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
        </div>
      );
    }
  }
);

export default Form3;
