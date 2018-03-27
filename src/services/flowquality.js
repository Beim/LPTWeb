import { stringify } from 'qs';
import requestServer from '../utils/requestServer';

const flowQualitySerivce = {};

flowQualitySerivce['getreportlist'] = async () => {
  return requestServer('/PushFlowPlatform/FlowQuaServlet', {
    method: 'POST',
    body: {
      method: 'getreportlist',
    },
  });
};

flowQualitySerivce['queryBroadCastRecords'] = async (uid, env, starttime, endtime) => {
  return requestServer('/PushFlowPlatform/FlowQuaServlet', {
    method: 'POST',
    body: {
      method: 'queryBroadCastRecords',
      data: {
        uid,
        env,
        starttime,
        endtime,
      },
    },
  });
};

flowQualitySerivce['queryFlowQualityByPid'] = async (data) => {
  const missingParam = ['pid', 'uid', 'env', 'serviceid', 'starttime', 'endtime'].filter(v => !(v in data));
  if (missingParam.length > 0) {
    console.log(`missing param ${missingParam.toString()}`);
    return null;
  }
  return requestServer('/PushFlowPlatform/FlowQuaServlet', {
    method: 'POST',
    body: {
      method: 'queryFlowQualityByPid',
      data,
    },
  });
};

flowQualitySerivce['delReport'] = async (reportid) => {
  return requestServer('/PushFlowPlatform/FlowQuaServlet', {
    method: 'POST',
    body: {
      method: 'delReport',
      data: {
        reportid,
      },
    },
  });
};

flowQualitySerivce['saveFlowQuality'] = async (data) => {
  const missingParam = ['uid', 'env', 'serviceid', 'starttime', 'endtime'].filter(v => !(v in data));
  if (missingParam.length > 0) {
    console.log(`missing param ${missingParam.toString()}`);
    return null;
  }
  return requestServer('/PushFlowPlatform/FlowQuaServlet', {
    method: 'POST',
    body: {
      method: 'saveFlowQuality',
      data,
    },
  });
}


export default flowQualitySerivce;