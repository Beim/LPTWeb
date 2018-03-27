import { stringify } from 'qs';
import requestServer from '../utils/requestServer';

const videoEvaluationService = {};

videoEvaluationService['getTaskList'] = async (data) => {
  const missingParam = ['pageid', 'pagesize'].filter(v => !(v in data));
  if (missingParam.length > 0) {
    console.log(`missing param ${missingParam.toString()}`);
    return null;
  }
  return requestServer('/PushFlowPlatform/VideoEvaluation', {
    method: 'POST',
    body: {
      method: 'getTaskList',
      data,
    },
  });
};

videoEvaluationService['saveTask'] = async (data) => {
  const missingParam = [
    'video_name',
    'dev_name',
    'resolution',
    'max_code',
    'min_code',
    'step_size',
    'main_profile',
    'trigger_platform',
    'dev_id',
    'dev_os_version',
    'cpu',
    'apk_version',
    'yuv_size',
    'task_state',
    'fps',
    'vbr',
  ].filter(v => !(v in data));
  if (missingParam.length > 0) {
    console.log(`missing param ${missingParam.toString()}`);
    return null;
  }
  return requestServer('/PushFlowPlatform/VideoEvaluation', {
    method: 'POST',
    body: {
      method: 'saveTask',
      data,
    },
  });
}

videoEvaluationService['getCharts'] = async (tasks) => {
  const params = {
    path: 'charts',
    tasks: tasks.join(','),
  };
  return requestServer(`/PushFlowPlatform/VideoEvaluation?${stringify(params)}`);
}




export default videoEvaluationService;