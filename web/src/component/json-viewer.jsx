/*
* A copoment to display content in the a modal
*/

import React, { PropTypes } from 'react';
import { Menu } from 'antd';
import ReactDOM from 'react-dom';
import JSONTree from 'react-json-tree';
import Style from './json-viewer.less';

const PageIndexMap = {
    'JSON_STRING': 'JSON_STRING',
    'JSON_TREE': 'JSON_TREE'
};

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

class JsonViewer extends React.Component {
    constructor () {
        super();

        this.state = {
            pageIndex: PageIndexMap.JSON_TREE
        };

        this.getMenuDiv = this.getMenuDiv.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    static propTypes = {
        data: PropTypes.string
    }

    handleMenuClick(e) {
        this.setState({
            pageIndex: e.key,
        });
    }

    getMenuDiv () {
        return (
            <Menu onClick={this.handleMenuClick} mode="horizontal" selectedKeys={[this.state.pageIndex]} >
                <Menu.Item key={PageIndexMap.JSON_STRING}>Source</Menu.Item>
                <Menu.Item key={PageIndexMap.JSON_TREE}>Preview</Menu.Item>
            </Menu>
        );
    }

    render () {
        if (!this.props.data) {
            return null;
        }

        let jsonTreeDiv = <div>{this.props.data}</div>;

        try {
            // In an invalid JSON string returned, handle the exception
            const jsonObj = JSON.parse(this.props.data);
            jsonTreeDiv = <JSONTree data={jsonObj} theme={theme} invertTheme={false} shouldExpandNode={()=>true}  />;
        } catch (e) {
            console.warn('Failed to get JSON Tree:', e);
        }

        const jsonStringDiv = <textarea defaultValue={this.props.data} cols="60" rows="20"></textarea>;
        return (
            <div className={Style.wrapper} >
                {this.getMenuDiv()}
                <div className={Style.contentDiv} >
                    {this.state.pageIndex === PageIndexMap.JSON_STRING ? jsonStringDiv : jsonTreeDiv}
                </div>
            </div>
        );
    }
}

export default JsonViewer;
