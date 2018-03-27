import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '../services/api';
import flowQualityService from '../services/flowquality';

export default {
  namespace: 'form',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
    flowquality: {
      queryData: {
        env: 'debug',
      },
      // env: 'debug',
    }
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitInfoForm({ payload }, { call, put }) {
      const data = {
        uid: parseInt(payload['uid']),
        env: payload['env'],
        starttime: parseInt(payload['dateRange'][0].format('x')),
        endtime: parseInt(payload['dateRange'][1].format('x')),
      };
      const ret = yield call(flowQualityService.queryBroadCastRecords, data['uid'], data['env'], data['starttime'], data['endtime']);
      if (!ret || ret['recode'] !== 0) {
        return message.error('flowQualityService.queryBroadCastRecords error');
      }
      if (ret['count'] === -1) {
        return message.info('查询无结果，请修改参数重试');
      }
      yield put({
        type: 'saveFlowQualityData',
        payload: {
          queryData: {
            ...data,
            mailReciver: payload['mailReciver'],
          },
          queryResult: {
            count: ret['count'],
            data: ret['data'],
          },
        },
      });
      yield put(routerRedux.push('/dashboard/flowquality/instance/list'));
    },
    *submitFlowQualityListForm({ payload }, { call, put }) {
      const queryByPidData = payload;
      const queryByPidRet = yield call(flowQualityService.queryFlowQualityByPid, queryByPidData);
      if (!queryByPidRet || queryByPidRet['retcode'] !== 0) {
        return message.error(`flowQualityService.queryFlowQualityByPid error，retcode = ${queryByPidRet['retcode']}`);
      }
      yield put({
        type: 'saveFlowQualityData',
        payload: {
          queryByPidResult: {
            serviceid: queryByPidRet['serviceid'],
            summary: queryByPidRet['summary'],
          },
        },
      });
      yield put(routerRedux.push('/dashboard/flowquality/instance/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveFlowQualityData(state, { payload }) {
      return {
        ...state,
        flowquality: {
          ...state.flowquality,
          ...payload,
        },
      };
    }
  },
};
