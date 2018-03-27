import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, track } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '../autoHeight';

track(false);
@autoHeight()
export default class VideoEvaluationLineChart extends React.Component {
  render() {
    
    const data = this.props.data;
    const xfields = this.props.xfields; // ['360p', '540p', '720p']
    const yfield = this.props.yfield; // 'score' || 'psnr' || 'asmr'

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: xfields,
      key: 'resolution',
      value: yfield,
    });
    const cols = {
      bitrate: {
        range: [0, 1],
      },
    };
    return (
      <Chart height={this.props.height} data={dv} scale={cols} padding='auto' forceFit>
        <Legend />
        <Axis name="bitrate"
          title={{
            offset: 40,
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
              fill: '#999',
              fontWeight: 'bold',
            }
          }}
        />
        <Axis name={yfield} label={{formatter: val => `${val}'`}} 
          title={{
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
              fill: '#999',
              fontWeight: 'bold',
            }
          }}
        />
        <Tooltip crosshairs={{type: "y"}}/>
        <Geom type="line" position={`bitrate*${yfield}`} size={2} color={'resolution'} shape={'smooth'} />
        <Geom type="point" position={`bitrate*${yfield}`} size={4} color={'resolution'} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1 }} />
      </Chart>
    )

  }
}
