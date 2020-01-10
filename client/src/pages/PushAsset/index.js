import React, { Component } from 'react';
import './index.scss';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Steps, Button, message, Layout, Icon, Spin } from 'antd';
import Form1 from './form-1';
import Form2 from './form-2';
import Form3 from './form-3';
import AssetModel from 'models/AssetModel';
import store from 'store';
import * as actions from 'actions';

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
        files: [],
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
        newAsset.files = values.file;
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

  completeForm = async () => {
    this.next();
    let files = this.state.newAsset.files.map(({ found, ...keepAttrs }) => keepAttrs);
    this.setState({ loading: true });

    const newAsset = {
      main: Object.assign(AssetModel.main, {
        type: 'dataset',
        name: this.state.newAsset.title,
        dateCreated: new Date(this.state.newAsset.creationDate).toISOString().split('.')[0] + 'Z',
        author: this.state.newAsset.author,
        license: this.state.newAsset.license,
        files
      }),
      additionalInformation: Object.assign(AssetModel.additionalInformation, {
        description: this.state.newAsset.description,
        copyrightHolder: this.state.newAsset.copyrightHolder,
        categories: [this.state.newAsset.category, 'dalama']
      })
    };
    try {
      // this.setState({ loading: true });
      const accounts = await this.props.ocean.accounts.list();
      const asset = await this.props.ocean.assets.create(newAsset, accounts[0]);
      console.log('asset', asset);
      store.dispatch(actions.insertDidToUser(accounts[0].id, asset));
      message.success('Processing complete!');
      this.props.history.push('/my-assets');
      // this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
      console.error(e.message);
    }
  };

  render() {
    const { current } = this.state;
    const antIcon = <Icon type='loading' style={{ fontSize: 30 }} spin />;
    return (
      <div>
        <Spin spinning={this.state.loading} indicator={antIcon}>
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
                  file={this.state.newAsset.files}
                />
              </div>
              <div
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
const mapStateToProps = (state) => {
  return {
    ocean: state.ocean
  };
};

export default compose(connect(mapStateToProps))(PushAsset);
