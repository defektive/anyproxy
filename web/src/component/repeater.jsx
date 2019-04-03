/**
 * The panel to edit the filter
 *
 */

import React, { PropTypes } from 'react';
import ClassBind from 'classnames/bind';
import { Menu, Table, notification, Spin, Button, Input, Collapse } from 'antd';
import clipboard from 'clipboard-js'
import JsonViewer from 'component/json-viewer';
import { connect } from 'react-redux';
import { MenuKeyMap } from 'common/Constant';

import ResizablePanel from 'component/resizable-panel';
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

import Style from './repeater.less';
import CommonStyle from '../style/common.less';

const StyleBind = ClassBind.bind(Style);

class Repeater extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {

  const panelVisible = this.props.globalStatus.activeMenuKey === MenuKeyMap.REPEATER;

    return (
      <ResizablePanel onClose={this.onClose} visible={panelVisible} >
          <div className={Style.filterWrapper} >
          sdfsdfsdf
          </div>
      </ResizablePanel>
    );
  }
}

function select (state) {
  return {
    globalStatus: state.globalStatus
  };
}

export default connect(select)(Repeater);
