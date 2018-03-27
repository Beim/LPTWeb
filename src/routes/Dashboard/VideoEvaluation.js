import React, { PureComponent, Fragment } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Form, Input, Card, Icon, Button, Radio, Select, Row, Col, Table, Divider, InputNumber, message, Badge, Modal } from 'antd';
import { routerRedux, Route, Switch } from 'dva/router';
import StandardTable from 'components/StandardTable';
import videoEvaluationService from '../../services/videoevaluation';
import { getRoutes } from '../../utils/utils';
import { connect } from 'dva';
import VideoEvaluationLineChart from '../../components/Charts/VideoEvaluationLineChart';

import styles from './VideoEvaluation.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['完成', '等待', '运行中', '未知'];
const statusTrans = {
  '0': '等待', // waiting
  '1': '运行中', // running
  '2': '完成', // finish
  '3': '未知', // ???
}


const CreateFormModal = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建任务"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      okText="提交"
    >
      <FormItem
        {...formItemLayout}
        label="视频"
      >
        {form.getFieldDecorator('videoName', {
          initialValue: 'herokill',
          rules: [{ required: true, message: '请选择视频' }],
        })(
          <Select style={{width: '100%'}}>
            <Option value="herokill">英雄杀</Option>
            <Option value="wangzhe">王者荣耀</Option>
            <Option value="kupao">天天酷跑</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="分辨率"
      >
        {form.getFieldDecorator('resolution', {
          initialValue: '360',
          rules: [{ required: true, message: '请选择分辨率' }],
        })(
          <Select style={{width: '100%'}}>
            <Option value="360">360</Option>
            <Option value="540">540</Option>
            <Option value="720">720</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="码率上限"
      >
        {form.getFieldDecorator('maxCode', {
          initialValue: 2000,
          rules: [{ required: true, message: '请输入码率上限' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="码率下限"
      >
        {form.getFieldDecorator('minCode', {
          initialValue: 100,
          rules: [{ required: true, message: '请输入码率下限' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="码率步长"
      >
        {form.getFieldDecorator('stepSize', {
          initialValue: 500,
          rules: [{ required: true, message: '请输入码率步长' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="MainProfile"
      >
        {form.getFieldDecorator('mainProfile', {
          initialValue: '0',
          rules: [{ required: true, message: '请选择MainProfile' }],
        })(
          <Select style={{width: '100%'}}>
            <Option value="0">否</Option>
            <Option value="1">是</Option>
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

const CompareChartModal = (props) => {
  /**
   [
     {
       psnr: [
         { bitrate: 100, '360p': 24, '540p': 66, '720p1': 88 },
         ...
       ],
       ssim: [
         { bitrate: 100, '360p': 24, '540p': 66, '720p1': 88 },
         ...
       ]
     },
     ...
   ]
   */
  const parseTaskData = (taskData) => {
    const map = {};
    taskData = taskData.map((v) => {
      return {
        ...v,
        key: v.dev_id + '&' + v.video_name.split('-')[0]
      }
    });
    for (let item of taskData) {
      if (!map[item.key]) {
        map[item.key] = [item];
      }
      else {
        map[item.key].push(item);
      }
    }
    const resData = [];
    for (let k in map) {
      let arr = map[k];
      const psnr = [];
      const ssim = [];
      for (let item of arr) {
        let scoreList = item.score_list;
        let resolution = item.resolution;
        for (let idx in scoreList) {
          let score = scoreList[idx];
          if (!psnr[idx] || !ssim[idx]) {
            psnr[idx] = { bitrate: score.bit_rate };
            ssim[idx] = { bitrate: score.bit_rate };
          }
          psnr[idx][`${resolution}p`] = score.psnr;
          ssim[idx][`${resolution}p`] = score.ssim;
        }
      }
      resData.push({ 
        psnr,
        ssim, 
        devName: arr[0].dev_name,
        devId: arr[0].dev_id,
        videoName: arr[0].video_name,
      });
    }
    return resData;
  }
  
  const { modalVisible, handleModalVisible, getTaskListData } = props;
  const taskListData = getTaskListData();
  let modalContent = <span>加载中...</span>;
  if (modalVisible && taskListData.length > 0) {
    const chartData = parseTaskData(taskListData);
    modalContent = chartData.map((val, idx) => {
      return (
        <div key={`modalContentDiv${idx}`}>
          <Row type="flex" align="center">
            <div>{val.videoName}</div>
          </Row>
          <Row type="flex" align="center">
            <div>{`${val.devName}(${val.devId})`}</div>
          </Row>
          <Row gutter={{ md: 2, lg: 6, xl: 12 }} type="flex" align="center">
            <Col md={12} sm={24}>
              <VideoEvaluationLineChart 
                data={val.psnr} 
                xfields={[ '360p', '540p', '720p' ]}
                yfield="psnr"
                height={350}
              />
            </Col>
            <Col md={12} sm={24}>
              <VideoEvaluationLineChart 
                data={val.ssim} 
                xfields={[ '360p', '540p', '720p' ]}
                yfield="ssim"
                height={350}
              />
            </Col>
          </Row>
          <Divider />
        </div>
      )
    });
  }
  return (
    <Modal
      title="图表"
      visible={modalVisible}
      onOk={() => handleModalVisible()}
      onCancel={() => handleModalVisible()}
      style={{ minWidth: '800px' }}
    >
      {modalContent}
    </Modal>
  )
};

@connect(({ videoform, loading }) => ({
  videoform,
  loading: loading.models.videoform,
}))
@Form.create()
export default class VideoEvaluation extends PureComponent {
  state = {
    createModalVisible: false,
    compareChartModalVisible: false,
    selectedRows: [],
    formValues: {},
    taskListData: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'videoform/fetch',
      payload: {
        pageid: 1,
        pagesize: 10,
      }
    });
  }
  
  getTaskListData = () => {
    return this.state.taskListData;
  }
  handleShowCharts = async (taskIds) => {
    message.info('数据加载中...');
    const response = await videoEvaluationService.getCharts(taskIds);
    if (!response || !response.task_list || response.task_list.length < 1) {
      console.error(`videoEvaluationService.getCharts(${taskIds.toString()}) error`);
      return message.error('图表加载失败');
    }
    this.setState({ 
      taskListData: response.task_list,
      compareChartModalVisible: true,
    });
  }
  handleCompareTask = () => {
    const selectedRows = this.state.selectedRows;
    if (selectedRows.length < 1) {
      return message.info('请选择任务');
    }
    for (let row of selectedRows) {
      if (row.taskState !== '完成') {
        return message.info('请选择已完成的任务');
      }
    }
    this.handleShowCharts(selectedRows.map(v => v.id));
  }
  handleViewTask = (task) => {
    if (task.taskState !== '完成') {
      return message.info('请选择已完成的任务');
    }
    this.handleShowCharts([task.id]);
  }
  handleCreateModalVisible = (flag) => {
    this.setState({
      createModalVisible: !!flag,
    });
  }
  handleCompareChartModalVisible = (flag) => {
    this.setState({
      compareChartModalVisible: !!flag,
    });
  }
  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'videoform/add',
      payload: {
        video_name: fields.videoName,
        dev_name: 'unknow',
        resolution: String(fields.resolution),
        max_code: String(fields.maxCode),
        min_code: String(fields.minCode),
        step_size: String(fields.stepSize),
        main_profile: fields.mainProfile,
        trigger_platform: 'LPT',
        dev_id: 'unknow',
        dev_os_version: 'unknow',
        cpu: 'unknow',
        apk_version: 'unknow',
        yuv_size: 'unknow',
        task_state: 0,
        fps: 20,
        vbr: 0,
      },
      callback: (res) => {
        if (!res || res['retcode'] !== 0) {
          message.error('添加失败，请修改参数重试');
        }
        else {
          message.success(`任务 ${res['taskid']} 添加成功`);
        }
        this.setState({
          createModalVisible: false,
        });
      }
    });
  }
  handleSearch = async () => {
    message.info('功能待完善');
  }
  handleStandardTableChange = async (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
  
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageid: pagination.current,
      pagesize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'videoform/fetch',
      payload: params,
    });

  }
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  renderForm = () => {
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
      <Form layout="inline" onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >

          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('state', {
                initialValue: "0",
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="0">等待</Option>
                  <Option value="1">运行中</Option>
                  <Option value="2">完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="画面">
              {getFieldDecorator('videoType', {
                initialValue: "0",
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="0">英雄杀</Option>
                  <Option value="1">王者荣耀</Option>
                  <Option value="2">天天酷跑</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit" >查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }
  render() {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '机型',
        dataIndex: 'devName',
        key: 'devName',
      },
      {
        title: '源文件',
        dataIndex: 'videoName',
        key: 'videoName',
      },
      {
        title: '分辨率',
        dataIndex: 'resolution',
        key: 'resolution',
      },
      {
        title: 'MainProfile',
        dataIndex: 'mainProfile',
        key: 'mainProfile',
        render: val => <span>{val === 1 ? '是' : '否'}</span>
      },
      {
        title: '状态',
        dataIndex: 'taskState',
        key: 'taskState',
        render(val) {
          const idx = status.indexOf(val);
          return <Badge status={statusMap[idx]} text={val} />;
        }
      },
      {
        title: '触发时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render(val) {
          const d = new Date(val);
          const t = `${d.toLocaleDateString()} ${d.toLocaleTimeString('zh-cn', {hour12: false})}`;
          return (
            <span>{t}</span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (
            <Fragment>
              <a onClick={() => this.handleViewTask(record)}>查看</a>
            </Fragment>
          )
          
        }
      },
    ];
    const { videoform: { data }, loading } = this.props;
    const { selectedRows, createModalVisible, compareChartModalVisible } = this.state;

    return (
      <PageHeaderLayout title="清晰度测评">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreateModalVisible(true)}>
                新建
              </Button>
              <Button onClick={this.handleCompareTask}>
                对比报告
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateFormModal
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleCreateModalVisible}
          modalVisible={createModalVisible}
        />
        <CompareChartModal
          handleModalVisible={this.handleCompareChartModalVisible}
          modalVisible={compareChartModalVisible}
          getTaskListData={this.getTaskListData}
        />
      </PageHeaderLayout>
    )
  }
}

