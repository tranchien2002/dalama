import React, { Component } from 'react';
import './index.scss';
import { Steps, Button, message, Layout, Icon } from 'antd';
import HeaderPage from 'components/HeaderPage';
import Form1 from './form-1';
import Form2 from './form-2';

const { Step } = Steps;
const { Content } = Layout;

const stepStyle = {
  marginBottom: 60,
  boxShadow: '0px -1px 0 0 #e8e8e8 inset'
};

class Asset {
  title = '';
  urlAsset = '';
  description = '';
  category = '';
  creationDate = '';
  author = '';
  copyrightHolder = '';
}

class PushAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      newAsset: new Asset()
    };
  }

  next = async () => {
    let res = await this.checkform();
    if (!res) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  };

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  checkform = async () => {
    let propsForm;
    if (this.state.current === 0) {
      propsForm = this.form1Ref.props;
    } else if (this.state.current === 1) {
      propsForm = this.form2Ref.props;
    }
    const { form } = propsForm;
    let res;
    form.validateFields((err, values) => {
      if (err) {
        res = err;
        return;
      }
      // form.resetFields();
    });
    return res;
  };

  refForm1 = (formRef) => {
    this.form1Ref = formRef;
  };
  refForm2 = (formRef) => {
    this.form2Ref = formRef;
  };

  render() {
    const { current } = this.state;
    return (
      <div>
        <HeaderPage />
        <Content className='content-new'>
          <Steps type='navigation' size='small' current={current} style={stepStyle}>
            <Step title='Essentials' />
            <Step title='Information' />
            <Step title='Authorship' />
            <Step title='Register' />
          </Steps>

          <div
            className={current === 0 ? 'steps-content' : 'steps-content display-none'}
            id='step-1'
          >
            <Form1 wrappedComponentRef={this.refForm1} />
          </div>
          <div
            className='steps-content'
            className={current === 1 ? 'steps-content' : 'steps-content display-none'}
            id='step-2'
          >
            <Form2 wrappedComponentRef={this.refForm2} />
          </div>
          <div
            className='steps-content'
            className={current === 2 ? 'steps-content' : 'steps-content display-none'}
            id='step-3'
          ></div>
          <div
            className='steps-content'
            className={current === 3 ? 'steps-content' : 'steps-content display-none'}
            id='step-4'
          ></div>
          <div className='steps-action'>
            {current > 0 && (
              <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                <Icon type='arrow-left' /> Previous
              </Button>
            )}
            {current < 4 - 1 && (
              <Button type='primary' onClick={() => this.next()}>
                Next <Icon type='arrow-right' />
              </Button>
            )}
            {current === 4 - 1 && (
              <Button type='primary' onClick={() => message.success('Processing complete!')}>
                Done
              </Button>
            )}
          </div>
        </Content>
      </div>
    );
  }
}

export default PushAsset;
