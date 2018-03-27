import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, DatePicker } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style1.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Info extends React.PureComponent {
  render() {
    const { form, dispatch, data, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/submitInfoForm',
            payload: values,
          });
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label='主播uid'
          >
            {getFieldDecorator('uid', {
              initialValue: data.queryData.uid,
              rules: [{ required: true, 'message': '请输入主播uid' }],
            })(
              <Input placeholder="请输入主播uid" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='环境'
          >
            {getFieldDecorator('env', {
              initialValue: data.queryData.env,
              rules: [{ required: true, message: '请选择环境' }],
            })(
              <Select>
                <Option value="debug">测试环境</Option>
                <Option value="release">正式环境</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="直播时间段"
          >
            {getFieldDecorator('dateRange', {
              initialValue: data.queryData.dateRange,
              rules: [{ required: true, message: '请选择直播时间段' }],
            })(
              <RangePicker 
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
              />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='关注人'
          >
            {getFieldDecorator('mailReciver', {
              initialValue: data.queryData.mailReciver,
              rules: [{ required: false }],
            })(
              <Input placeholder="默认只发管理员" />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm} loading={submitting}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
      </Fragment>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitInfoForm'],
  data: form.flowquality,
}))(Info);
