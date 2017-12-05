/** @babel */
/** @jsx etch.dom */

import path from 'path';
import etch from 'etch';
import React from 'react';
import fs from 'fs-plus';
import git from './git-cmd';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';

export default class CoracleCloud{
  constructor(uri) {
    this.uri = uri;
    etch.initialize(this);
    this.path = fs.getHomeDirectory()+"/Documents/Atom/"
    this.emitter = new Emitter();
    // this.refs.projectPath.setText(this.path);
    /* 监听项目名称输入 */
    // this.refs.projectName.onDidChange(this.onDidChange.bind(this));
    // this.refs.projectName.onWillInsertText(this.onWillInsertText.bind(this));
    // this.refs.projectName.setPlaceholderText('请输入项目名称');

  }

  render () {
    return (
      <iframe id="coracle" src='http://127.0.0.1:8080/module_cloudcompil/' style="display:none" width='800px' height = '800px' ></iframe>
    )
  }

  getTitle () {
    return '云编译'
  }

  onCreateProject(callback){
    this.emitter.on('createProject',callback);
  }

  reject(){

    that = this;
    const fWindow = document.getElementById("coracle").contentWindow;
    fWindow.CoracleStudio = {
      cloudBuild: function (param) {
          const projectName = param["project_name"];

          atom.notifications.addInfo(projectName+'正在编译');
      },
      instruction: function (param) {
        that.instruction();
      },
    }

 }

 createProject(){
   this.emitter.emit('createProject',this);
 }

 instruction(){
 }

 update () {}

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    var pane = atom.workspace.paneForURI(this.uri);
    pane.destroyItem(this);
    // 如果当前窗口容器中只有文档视图，那么把容器都销毁掉
    if (pane.getItems().length === 0) {
        pane.destroy();
    }
  }

  getElement() {
    return this.element;
  }
}
