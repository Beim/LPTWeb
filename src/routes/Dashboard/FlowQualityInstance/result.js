import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, message } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style1.less';
import flowQualitySerivce from '../../../services/flowquality';

class InstanceResult extends React.PureComponent {
  handleSave = async () => {
    const { dispatch, data } = this.props;
    const requestData = {
      ...data.queryData,
      serviceid: data.queryByPidResult.serviceid,
    };
    const ret = await flowQualitySerivce.saveFlowQuality(requestData);
    if (!ret || ret['retcode'] !== 0) {
      message.error('保存失败');
      return console.log('saveFlowQuality error');
    }
    message.success('保存成功');
    dispatch(routerRedux.push('/dashboard/flowquality/history'));
  }
  render() {
    const { dispatch, data } = this.props;
    console.log('render data: ')
    console.log(data)
    const onPrev = () => {
      dispatch(routerRedux.push('/dashboard/flowquality/instance/list'));
    };
    const summaryData = data.queryByPidResult.summary;
    const information = (
      <div className={styles.information}>
        <Row>
          <Col span={8} className={styles.label}>推流环境信息</Col>
          <Col span={16}>{summaryData.envSummary}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>cpu</Col>
          <Col span={16}>{summaryData.cpuSummary}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>帧率</Col>
          <Col span={16}>{summaryData.fpsSummary}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>分辨率</Col>
          <Col span={16}>{summaryData.resolutionSummary}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>码率</Col>
          <Col span={16}>{summaryData.bitrateSummary}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>内存</Col>
          <Col span={16}>{summaryData.pssSummary}</Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button onClick={onPrev}>
          上一步
        </Button>
        <Button type="primary" onClick={this.handleSave}>
          保存
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="分析成功"
        description="推流数据分析成功，概述如下。数据图表请保存后查看。"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form }) => ({
  data: form.flowquality,
}))(InstanceResult);
