import { queryRule, removeRule, addRule } from '../services/api';
import videoEvaluationService from '../services/videoevaluation';
import { message } from 'antd';

const statusTrans = {
  '0': '等待', // waiting
  '1': '运行中', // running
  '2': '完成', // finish
  '3': '未知', // ???
}
export default {
  namespace: 'videoform',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const ret = yield call(videoEvaluationService.getTaskList, payload);
      if (!ret || ret['retcode'] !== 0) {
        console.error(`videoEvaluationService.getTaskList error`);
        return message.error('获取列表失败')
      }
      const data = {
        list: [],
        pagination: {
          current: parseInt(ret.currentPage),
          pageSize: parseInt(payload.pagesize),
          total: parseInt(ret.total),
        },
      };
      data.list = ret.taskList.map((val, idx) => {
        return {
          key: `videoformtasklist${idx}`,
          id: val.id,
          devName: val.dev_name,
          videoName: val.video_name,
          resolution: val.resolution,
          mainProfile: val.main_profile,
          taskState: statusTrans[val.task_state],
          createTime: (!!val.create_time && !!val.create_time.time) ? val.create_time.time : null,
          action: val.id,
        };
      });
      yield put({
        type: 'save',
        payload: data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      const response = yield call(videoEvaluationService.saveTask, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
