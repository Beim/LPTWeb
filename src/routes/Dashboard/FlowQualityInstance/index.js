import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Steps, Select, List, Tag, Icon, Avatar, Row, Col, Button } from 'antd';
import { Route, Redirect, Switch } from 'dva/router';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';
import styles from './style.less';

const { Step } = Steps;


@Form.create()
export default class FlowQualityInstance extends Component {

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info': return 0;
      case 'list': return 1;
      case 'result': return 2;
      default: return 0;
    }
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <Fragment>
        <Card>
          <Steps current={this.getCurrentStep()} className={styles.steps}>
            <Step title="填写查询信息" />
            <Step title="选择直播记录" />
            <Step title="查询结果" />
          </Steps>
          <Switch>
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))
            }
            <Redirect exact from="/dashboard/flowquality/instance" to="/dashboard/flowquality/instance/info" />
            <Route render={NotFound} />
          </Switch>
        </Card>
      </Fragment>
    );
  }
}
