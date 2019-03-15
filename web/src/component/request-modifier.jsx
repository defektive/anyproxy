/**
 * The panel to edit the filter
 *
 */

import React, { PropTypes } from 'react';
import ClassBind from 'classnames/bind';
import { Menu, Table, notification, Spin, Button} from 'antd';
import clipboard from 'clipboard-js'
import JsonViewer from 'component/json-viewer';
import ModalPanel from 'component/modal-panel';
import { hideRecordDetail } from 'action/recordAction';
import { selectText } from 'common/CommonUtil';
import { curlify } from 'common/CurlUtil';
import JSONTree from 'react-json-tree';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};

import Style from './request-modifier.less';
import CommonStyle from '../style/common.less';

const StyleBind = ClassBind.bind(Style);

class RequestModifier extends React.Component {
  constructor () {
    super();
    this.state = {userModifiedJson: false}
    this.sendModifiedRequest = this.sendModifiedRequest.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
  }

  static propTypes = {
    requestRecord: PropTypes.object
  }

  handleRequestChange(event) {
    this.setState({userModifiedJson: JSON.parse(event.target.value)});
  }
  sendModifiedRequest(e) {
    fetch(`/api/request/${this.props.recordDetail.id}`, {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modifiedRequest: this.state.userModifiedJson
      })
    })
  }


  render() {

    const { recordDetail } = this.props;
    const modifiable = this.state.userModifiedJson || {
      protocol: recordDetail.protocol,
      requestOptions: {
        headers: recordDetail.reqHeader,
        path: recordDetail.path,
        hostname: recordDetail.host,
        method: recordDetail.method
      },
      requestData: recordDetail.reqBody
    };

    return (
      <div className={Style.section} >
        <div >
          <span className={CommonStyle.sectionTitle}>Modify?</span>
        </div>
        <div className={CommonStyle.whiteSpace10} />
        <div className={Style.reqBody} >
          <JSONTree data={modifiable} theme={theme} invertTheme={false} shouldExpandNode={()=>true}  />
          <textarea style={{width: '100%', height: '400px'}} onChange={this.handleRequestChange} value={JSON.stringify(modifiable, null, 4)} />
        </div>
        <Button type="primary" onClick={this.sendModifiedRequest} >Send</Button>
      </div>
    );
  }
}
export default RequestModifier;
