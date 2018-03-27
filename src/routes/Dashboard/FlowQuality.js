import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Form, Input, Card, Icon, Button, Radio, Select, Row, Col, Table, Divider, InputNumber } from 'antd';
import { connect } from 'dva';
import { routerRedux, Route, Switch } from 'dva/router';
import StandardTable from 'components/StandardTable';
import barrageService from '../../services/barrage';
import { getRoutes } from '../../utils/utils';

import styles from './FlowQuality.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect()
@Form.create()
export default class FlowQuality extends PureComponent {
  handleTabChange = (key) => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'instance/info':
        dispatch(routerRedux.push(`${match.url}/instance`));
        break;
      case 'history':
        dispatch(routerRedux.push(`${match.url}/history`));
        break;
      default:
        break;
    }
  }

  render() {
    const tabList = [{
      key: 'instance/info',
      tab: '实例',
    }, {
      key: 'history',
      tab: '历史',
    }];

    const { match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);

    return (
      <PageHeaderLayout
        title="推流质量"
        content="监测推流个例质量，以及推流质量历史报告。"
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        <Switch>
          {
            routes.map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )
          }
        </Switch>
      </PageHeaderLayout>
    )
  }
}

