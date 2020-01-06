import React from 'react';
import { Form, Input, DatePicker, Row, Col, Select } from 'antd';
import moment from 'moment';
import { OPTIONS_CATEGORY } from 'constant/ListOption.js';

const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;

const Form2 = Form.create({ name: 'form_2' })(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedItems: []
      };
    }

    render() {
      const { form, description, category, creationDate } = this.props;
      const { getFieldDecorator } = form;
      const { selectedItems } = this.state;
      const filteredOptions = OPTIONS_CATEGORY.filter((o) => !selectedItems.includes(o));
      return (
        <div className='ant-modal-body'>
          <Form layout='vertical'>
            <h2 className='ant-typography'>Information</h2>
            <Form.Item label='Description'>
              {getFieldDecorator('description', {
                initialValue: description,
                rules: [{ required: true, message: 'Please input the Description of Asset!' }]
              })(<TextArea rows={4} />)}
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={15} md={16} className='gutter-row'>
                <Form.Item label='Category'>
                  {getFieldDecorator('category', {
                    initialValue: category,
                    rules: [{ required: true, message: 'Please input the Category of Asset!' }]
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
              </Col>
              <Col xs={24} sm={9} md={8}>
                <Form.Item label='Creation Date'>
                  {getFieldDecorator('creationDate', {
                    initialValue: creationDate
                      ? moment(new Date(creationDate), dateFormat)
                      : moment(new Date(), dateFormat),
                    rules: [{ required: true, message: 'Please input the Creation Date of Asset!' }]
                  })(<DatePicker size='default' format={dateFormat} className='width-100' />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      );
    }
  }
);

export default Form2;
