import { stringify } from 'qs';
import requestServer from '../utils/requestServer';

const barrageService = {};

barrageService['queryAllTasks'] = async () => {
  return requestServer('/PushFlowPlatform/BarrageMgr', {
    method: 'POST',
    body: {
      method: 'queryAllTasks',
    }
  });
};

barrageService['createTask'] = async (anchorId, threadNum, duration) => {
  return requestServer('/PushFlowPlatform/BarrageMgr', {
    method: 'POST',
    body: {
      method: 'createTask',
      data: {
        anchorId,
        threadNum,
        duration,
      },
    },
  });
};

barrageService['delTask'] = async (taskId) => {
  return requestServer('/PushFlowPlatform/BarrageMgr', {
    method: 'POST',
    body: {
      method: 'delTask',
      data: {
        taskId,
      },
    },
  });
};

barrageService['startTask'] = async (taskId) => {
  return requestServer('/PushFlowPlatform/BarrageMgr', {
    method: 'POST',
    body: {
      method: 'startTask',
      data: {
        taskId,
      },
    },
  });
};

barrageService['stopTask'] = async (taskId) => {
  return requestServer('/PushFlowPlatform/BarrageMgr', {
    method: 'POST',
    body: {
      method: 'stopTask',
      data: {
        taskId,
      },
    },
  });
};



export default barrageService;