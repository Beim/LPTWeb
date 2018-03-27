import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Form, Input, Card, Icon, Button, Radio, Select, Row, Col, Table, Divider, InputNumber } from 'antd';
import { connect } from 'dva';
import StandardTable from 'components/StandardTable';
import barrageService from '../../services/barrage'

import styles from './BarrageRobot.less';

const FormItem = Form.Item;
const { Option } = Select;


@Form.create()
export default class BarrageRobot extends PureComponent {
  state = {
    data: [],
    fetchTasksTimer: null,
  };

  async componentDidMount() {
    this.updateData();
    const fetchTasksTimer = setInterval(this.updateData, 5000);
    this.setState({fetchTasksTimer});
  }
  componentWillUnmount() {
    clearInterval(this.state.fetchTasksTimer);
    this.setState({
      fetchTasksTimer: null,
    });
  }
  // 更新table 的数据
  updateData = async () => {
    const ret = await barrageService.queryAllTasks();
    if (!ret || ret['retcode'] !== 0) {
      return console.log('barrageService.queryAllTasks errro');
    }
    const rawData = ret.data;
    const data = rawData.reverse().map((val, idx) => {
      let obj = {key: 'tableDataItem' + idx};
      obj['id'] = parseInt(val['taskId']);
      obj['roomNo'] = parseInt(val['anchorId']);
      obj['barrageMode'] = parseInt(val['threadNum']) === 1 ? '普通模式' : '加强模式';
      obj['duration'] = parseInt(val['duration']);
      obj['status'] = val['isRunning'] ? '运行中' : '已停止';
      obj['action'] = val['isRunning'] ? '暂停' : '启动';
      return obj;
    });
    this.setState({data});
  }
  // 上传表单，新建任务
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const anchorId = values['roomNo'];
        const threadNum = values['barrageMode'] === "0" ? 1 : 2;
        const duration = values['duration'];
        const ret = await barrageService.createTask(anchorId, threadNum, duration);
        if (!ret || ret['retcode'] !== 0) {
          return console.log(`barrageService.createTask(${anchorId}, ${threadNum}, ${duration}) error`);
        }
        this.props.form.resetFields();
        this.updateData();
      }
    });
  }
  // 启动/暂停任务
  handleRunTask = async ([text, taskId]) => {
    let ret = null;
    let func = text === '启动' ? 'startTask' : 'stopTask';
    ret = await barrageService[func](String(taskId));
    if (!ret || ret['retcode'] !== 0) {
      console.log(`barrageService.${func}(${taskId}) error`);
    }
    this.updateData();
  }
  // 删除任务
  handleRemoveTask = async (taskId) => {
    const ret = await barrageService.delTask(String(taskId));
    if (!ret || ret['retcode'] !== 0) {
      return console.log(`barrageService.delTask(${taskId}) error`);
    }
    this.updateData();
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 16 },
      },
      style: {
        width: '100%',
      }
    };
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Row gutter={{ md: 2, lg: 6, xl: 12 }} type="flex" align="center">
          <Col md={5} sm={24}>
            <FormItem {...formItemLayout} label="房间号">
              {getFieldDecorator('roomNo', {
                rules: [{
                  required: true, message: '请输入房间号',
                }],
              })(
                <InputNumber style={{width: '100%'}} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem {...formItemLayout} label="时长/s">
              {getFieldDecorator('duration', {
                rules: [{
                  required: true, message: '请输入时长',
                }],
              })(
                <InputNumber style={{width: '100%'}} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem {...formItemLayout} label="模式">
              {getFieldDecorator('barrageMode', {
                initialValue: "0",
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="0">普通模式</Option>
                  <Option value="1">加强模式</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={3} offset={2} sm={24}>
            <span>
              <Button icon="plus" type="primary" htmlType="submit" >新建任务</Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }
  renderTable() {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '房间号',
        dataIndex: 'roomNo',
        key: 'roomNo',
      },
      {
        title: '弹幕频率',
        dataIndex: 'barrageMode',
        key: 'barrageMode',
      },
      {
        title: '限时/s',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <a onClick={this.handleRunTask.bind(this, [text, record['id']])}>{text}</a>
              <Divider type="vertical" />
              <a onClick={this.handleRemoveTask.bind(this, record['id'])}>移除</a>
            </span>
          )
        }
      },
    ];
    return (
      <Table
        dataSource={this.state.data}
        columns={columns}
      />
    )
  }
  render() {
    return (
      <PageHeaderLayout title="弹幕机器人" content="自动发送弹幕，用于直播间弹幕压测。">
        <Card>
          {this.renderForm()}
        </Card>
        <Card>
          {this.renderTable()}
        </Card>
      </PageHeaderLayout>
    )
  }
}

