/**
 * The panel to edit the filter
 *
 */

import React, { PropTypes } from 'react';
import ClassBind from 'classnames/bind';
import { Menu, Table, notification, Spin, Button, Input, Collapse } from 'antd';
import clipboard from 'clipboard-js'
import JsonViewer from 'component/json-viewer';
import ModalPanel from 'component/modal-panel';
import { hideRecordDetail } from 'action/recordAction';
import { selectText } from 'common/CommonUtil';
import { curlify } from 'common/CurlUtil';
import JSONTree from 'react-json-tree';

const { TextArea } = Input;
const Panel  = Collapse.Panel;

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
  constructor (props) {
    super(props);
    const { recordDetail } = props;

    this.state = {
      userModifiedJson: {
        protocol: recordDetail.protocol,
        requestOptions: {
          headers: recordDetail.reqHeader,
          path: recordDetail.path,
          hostname: recordDetail.host,
          method: recordDetail.method
        },
        requestData: recordDetail.reqBody
      }
    };
    this.sendModifiedRequest = this.sendModifiedRequest.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
    this.handleHostnameChange = this.handleHostnameChange.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);
    this.handleHeaderChange = this.handleHeaderChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleRequestDataFormChange = this.handleRequestDataFormChange.bind(this);
  }

  static propTypes = {
    requestRecord: PropTypes.object
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.sendModifiedRequest();
  }

  handleMethodChange(event) {
    this.state.userModifiedJson.requestOptions.method = event.target.value;
    this.setState(this.state);
  }

  handlePathChange(event) {
    this.state.userModifiedJson.requestOptions.path = event.target.value;
    this.setState(this.state);
  }

  handleHostnameChange(event) {
    this.state.userModifiedJson.requestOptions.hostname = event.target.value;
    this.setState(this.state);
  }

  handleHeaderChange(event) {
    const key = event.target.dataset.key;
    this.state.userModifiedJson.requestOptions.headers[key] = event.target.value;
    this.setState(this.state);
  }
  handleRequestDataFormChange(event) {
    const key = event.target.dataset.key;
    let parsedData = this.parseFormUrlEncode(this.state.userModifiedJson.requestData);
    parsedData[key] = event.target.value;
    this.state.userModifiedJson.requestData = this.encodeFormUrlEncode(parsedData);
    this.setState(this.state);
  }

  handleRequestChange(event) {
    try {
      const newVals = JSON.parse(event.target.value);
      this.setState({userModifiedJson: newVals});
    } catch(e) {}
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

  getHeaders() {
    const dom = Object.keys(this.state.userModifiedJson.requestOptions.headers).map((key) => {
      return (
        <div key={key} className={Style.liItem} >
          <Input addonBefore={key} data-key={key} value={this.state.userModifiedJson.requestOptions.headers[key]} onChange={this.handleHeaderChange}/>
        </div>
      );
    });

    return dom;
  }

  getContentType() {
    return this.state.userModifiedJson.requestOptions.headers['Content-Type'] ||
      this.state.userModifiedJson.requestOptions.headers['content-type']
  }

  getBody() {
    switch(this.getContentType()) {
      case 'application/x-www-form-urlencoded':
        const data = this.parseFormUrlEncode(this.state.userModifiedJson.requestData)
        const dom = Object.keys(data).map((key) => {
          return (
            <div key={key} className={Style.liItem} >
              <Input addonBefore={key} data-key={key} value={data[key]} onChange={this.handleRequestDataFormChange}/>
            </div>
          );
        });

        return dom;
    }
  }

  parseFormUrlEncode(data) {
    let o = {};
    data.split('&').forEach((v) => {
      let s = v.split('=');
      o[s[0]] = decodeURIComponent(s[1]);
    });
    return o;
  }

  encodeFormUrlEncode(data){
     return Object.keys(data).map((key) => {
       return `${key}=${encodeURIComponent(data[key])}`
     }).join('&');
  }

  render() {
    return (
      <form className={Style.section} onSubmit={this.handleFormSubmit}>
        <div >
          <span className={CommonStyle.sectionTitle}>Modify?</span>
        </div>

        <Button type="primary" htmlType="submit" onClick={this.sendModifiedRequest} >Send</Button>

        <Collapse bordered={false} defaultActiveKey={['4', '1']}>
        <Panel header="JSON Object View" key="4">
          <JSONTree data={this.state.userModifiedJson} theme={theme} invertTheme={false} shouldExpandNode={()=>true}  />
        </Panel>

        <Panel header="Basic Request Info" key="1">

          <div className={Style.liItem} >
            <Input addonBefore="Hostname (Connect)" value={this.state.userModifiedJson.requestOptions.hostname} onChange={this.handleHostnameChange}/>
          </div>

          <div className={Style.liItem} >
            <Input addonBefore="Method" value={this.state.userModifiedJson.requestOptions.method} onChange={this.handleMethodChange}/>
          </div>

          <div className={Style.liItem} >
          <Input addonBefore="Path" value={this.state.userModifiedJson.requestOptions.path} onChange={this.handlePathChange}/>
          </div>
        </Panel>
        <Panel header="Headers" key="2">
          {this.getHeaders()}
        </Panel>
        <Panel header="Request Body" key="3">
          {this.getBody()}
          <TextArea rows={10} onChange={this.handleRequestChange} value={JSON.stringify(this.state.userModifiedJson, null, 4)} />
        </Panel>
        </Collapse>

        <Button type="primary" htmlType="submit" onClick={this.sendModifiedRequest} >Send</Button>
      </form>
    );
  }
}
export default RequestModifier;
