import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Form, Input, Button, Select, Divider, DatePicker, message } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style1.less';

const { Option } = Select;
// const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class List extends React.PureComponent {
  handleChooseRecord = (index) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({index});
    message.success('已选择');
    
  }
  renderTable = () => {
    const { data } = this.props;
    const queryResult = data.queryResult.data;
    const columns = [{
      title: '序列号',
      dataIndex: 'index',
      key: 'index',
    }, {
      title: 'pid',
      dataIndex: 'pid',
      key: 'pid',
    }, {
      title: '开始时间',
      dataIndex: 'starttime',
      key: 'starttime',
    }, {
      title: '结束时间',
      dataIndex: 'endtime',
      key: 'endtime',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, records) => {
        return (
          <a onClick={this.handleChooseRecord.bind(this, text)}>选择</a>
        )
      }, 
    }];
    const tableData = queryResult.map((val, idx) => {
      const st = new Date(val['startTime']['time']);
      const et = new Date(val['endTime']['time']);
      return {
        key: `flowQualityInstanceListTableData${idx}`,
        index: idx,
        pid: val['pid'],
        starttime: `${st.toLocaleDateString()} ${st.toLocaleTimeString('zh-cn', {hour12: false})}`,
        endtime: `${et.toLocaleDateString()} ${et.toLocaleTimeString('zh-cn', {hour12: false})}`,
        action: idx,
      }
    });
    return (
      <Table columns={columns} dataSource={tableData} />
    )
  }
  render() {
    const { form, dispatch, data, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/dashboard/flowquality/instance/info'));
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const queryResult = data.queryResult.data;
          if (parseInt(values.index) + 1 > queryResult.length) {
            return message.error('序列号输入有误');
          }
          const infoRetData = queryResult[parseInt(values.index)];
          const infoData = data.queryData;
          const queryByPidData = {
            pid: infoRetData.pid,
            uid: infoData.uid,
            env: infoData.env,
            serviceid: 0,
            starttime: infoData.starttime,
            endtime: infoData.endtime,
          };
          dispatch({
            type: 'form/submitFlowQualityListForm',
            payload: queryByPidData,
          });
        }
      });
    };
    return (
      <Fragment>        
        <Divider style={{ margin: '40px 0 24px' }} />
        { this.renderTable() }
        <Divider style={{ margin: '40px 0 24px' }} />
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        
          <Form.Item
            {...formItemLayout}
            label='序列号'
          >
            {getFieldDecorator('index', {
              initialValue: data.index,
              rules: [{ required: true, 'message': '请输入直播记录序列号' }],
            })(
              <Input placeholder="请输入序列号" />
            )}
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button onClick={onPrev}>
              上一步
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={onValidateForm} loading={submitting}>
              提交
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        
      </Fragment>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitFlowQualityListForm'],
  data: form.flowquality,
}))(List);
