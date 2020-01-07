import React, { Component } from 'react';
import './index.scss';
import { Steps, Button, message, Layout, Icon, Spin, Switch, Alert } from 'antd';
import HeaderPage from 'components/HeaderPage';
import Form1 from './form-1';
import Form2 from './form-2';
import Form3 from './form-3';

const { Step } = Steps;
const { Content } = Layout;

const stepStyle = {
  marginBottom: 30,
  boxShadow: '0px -1px 0 0 #e8e8e8 inset'
};

class PushAsset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      newAsset: {
        title: '',
        urlAsset: [],
        description: '',
        category: '',
        creationDate: '',
        author: '',
        copyrightHolder: '',
        license: ''
      },
      loading: false
    };
  }

  componentWillMount() {
    if (localStorage.getItem('newAsset')) {
      this.setState({ newAsset: JSON.parse(localStorage.getItem('newAsset')) });
    }
  }

  next = async () => {
    let res = await this.checkform();
    if (!res) {
      const current = this.state.current + 1;
      this.setState({ current });
      localStorage.setItem('newAsset', JSON.stringify(this.state.newAsset));
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
    } else if (this.state.current === 2) {
      propsForm = this.form3Ref.props;
    }
    const { form } = propsForm;
    let res;
    form.validateFields((err, values) => {
      if (err) {
        res = err;
        return;
      }
      let newAsset = this.state.newAsset;
      if (this.state.current === 0) {
        newAsset.title = values.title;
        newAsset.urlAsset = values.file;
        this.setState({ newAsset: newAsset });
      } else if (this.state.current === 1) {
        newAsset.description = values.description;
        newAsset.category = values.category;
        newAsset.creationDate = values.creationDate;
        this.setState({ newAsset: newAsset });
      } else if (this.state.current === 2) {
        newAsset.author = values.author;
        newAsset.copyrightHolder = values.copyrightHolder;
        newAsset.license = values.license;
        this.setState({ newAsset: newAsset });
      }
    });
    return res;
  };

  refForm1 = (formRef) => {
    this.form1Ref = formRef;
  };
  refForm2 = (formRef) => {
    this.form2Ref = formRef;
  };
  refForm3 = (formRef) => {
    this.form3Ref = formRef;
  };

  completeForm = () => {
    console.log(this.state.newAsset);
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      message.success('Processing complete!');
    }, 3000);
  };

  render() {
    const { current } = this.state;
    const antIcon = <Icon type='loading' style={{ fontSize: 30 }} spin />;
    return (
      <div>
        <Spin spinning={this.state.loading} indicator={antIcon}>
          <HeaderPage />
          <Content className='content-new'>
            <div className='box-shadow'>
              <Steps type='navigation' size='small' current={current} style={stepStyle}>
                <Step title='Essentials' />
                <Step title='Information' />
                <Step title='Authorship' />
              </Steps>

              <div
                className={current === 0 ? 'steps-content' : 'steps-content display-none'}
                id='step-1'
              >
                <Form1
                  wrappedComponentRef={this.refForm1}
                  title={this.state.newAsset.title}
                  file={this.state.newAsset.urlAsset}
                />
              </div>
              <div
                className='steps-content'
                className={current === 1 ? 'steps-content' : 'steps-content display-none'}
                id='step-2'
              >
                <Form2
                  wrappedComponentRef={this.refForm2}
                  description={this.state.newAsset.description}
                  category={this.state.newAsset.category}
                  creationDate={this.state.newAsset.creationDate}
                />
              </div>
              <div
                className='steps-content'
                className={current === 2 ? 'steps-content' : 'steps-content display-none'}
                id='step-3'
              >
                <Form3
                  wrappedComponentRef={this.refForm3}
                  author={this.state.newAsset.author}
                  copyrightHolder={this.state.newAsset.copyrightHolder}
                  license={this.state.newAsset.license}
                />
              </div>
              <div className='steps-action'>
                {current > 0 && (
                  <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                    <Icon type='arrow-left' /> Previous
                  </Button>
                )}
                {current < 3 - 1 && (
                  <Button type='primary' onClick={() => this.next()}>
                    Next <Icon type='arrow-right' />
                  </Button>
                )}
                {current === 3 - 1 && (
                  <Button type='primary' onClick={this.completeForm}>
                    Done
                  </Button>
                )}
              </div>
            </div>
          </Content>
        </Spin>
      </div>
    );
  }
}

export default PushAsset;
