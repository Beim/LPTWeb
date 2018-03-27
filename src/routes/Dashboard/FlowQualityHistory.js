import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Select, List, Tag, Icon, Avatar, Row, Col, Button, Divider, Table } from 'antd';

import flowQualityService from '../../services/flowquality'

@Form.create()
export default class FlowQualityHistory extends Component {
  state = {
    data: [],
  }

  componentDidMount = async () => {
    this.updateData();
  }
  updateData = async () => {
    const ret = await flowQualityService.getreportlist();
    if (!ret || ret['retcode'] !== 0) {
      return console.log(`flowQualityService.getreportlist error`);
    }
    const rawData = ret.data;
    const data = rawData.map((val, idx) => {
      const qt = new Date(val['queryTime'].time);
      const st = new Date(val['startTime'].time);
      const et = new Date(val['endTime'].time);
      return {
        id: val['id'],
        uid: val['uid'],
        av: val['av'],
        queryTime: `${qt.toLocaleDateString()} ${qt.toLocaleTimeString('zh-cn', {hour12: false})}`,
        startTime: `${st.toLocaleDateString()} ${st.toLocaleTimeString('zh-cn', {hour12: false})}`,
        endTime: `${et.toLocaleDateString()} ${et.toLocaleTimeString('zh-cn', {hour12: false})}`,
        action: '查询',
        key: 'flowQualityTable' + idx,
      }
    });
    this.setState({data: data.reverse()});
  }
  handleDetailReport = async (reportid) => {
    window.open(`/PushFlowPlatform/reportdetails.html?reportid=${reportid}`);
  }
  handleDelReport = async (reportid) => {
    const ret = await flowQualityService.delReport(String(reportid));
    if (!ret || ret['retcode'] !== 0) {
      return console.log(`flowQualityService.delReport(${reportid}) error`);
    }
    this.updateData();
  }
  renderTable() {
    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '主播uid',
      dataIndex: 'uid',
      key: 'uid',
    }, {
      title: '版本',
      dataIndex: 'av',
      key: 'av',
    }, {
      title: '查询时间',
      dataIndex: 'queryTime',
      key: 'queryTime',
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a onClick={this.handleDetailReport.bind(this, record['id'])}>{text}</a>
            <Divider type="vertical" />
            <a onClick={this.handleDelReport.bind(this, record['id'])}>移除</a>
          </span>
        )
      }
    }];

    return (
      <Table
        dataSource={this.state.data}
        columns={columns}
      />
    )
  }
  render() {

    return (
      <Fragment>
        <Card>
          {this.renderTable()}
        </Card>
      </Fragment>
    );
  }
}
