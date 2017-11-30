/** @babel */
/** @jsx etch.dom */

import path from 'path';
import etch from 'etch';
import React from 'react';
import fs from 'fs-plus';
import git from './git-cmd';
import {CompositeDisposable,TextEditor} from 'atom';

export default class CoracleCreateProject{
  constructor(uri) {
    this.uri = uri;
    etch.initialize(this);
    this.path = fs.getHomeDirectory()+"/Documents/Atom/"
    this.refs.projectPath.setText(this.path);
    /* 监听项目名称输入 */
    this.refs.projectName.onDidChange(this.onDidChange.bind(this));
    this.refs.projectName.onWillInsertText(this.onWillInsertText.bind(this));
    this.refs.projectName.setPlaceholderText('请输入项目名称');

  }

  render () {
    return (
      <div className='create'>
        <div className='create-left'>
          <div className='proview'>
            <img className='project-proview' sec='http://www.apicloud.com/ide/img/icon-iphone.png'/>
          </div>
        </div>
        <div className='create-right'>
          <div>
            <p>项目名称</p>
            <TextEditor mini ref='projectName' />
          </div>

          <div>
            <h1>项目说明</h1>
            <TextEditor mini ref='projectDesc' />
          </div>

          <div>
            <h1>项目路径</h1>
            <TextEditor mini ref='projectPath' />
          </div>

          <button className='create-submit' onclick={this.createProject.bind(this)}>创建项目</button>

        </div>
      </div>
    )
  }

  createProject (){
    /* 项目名称 */
    const projectName = this.refs.projectName.getText().trim();
    /* 项目说明 */
    const projectDesc = this.refs.projectDesc.getText().trim();

    if (projectName == null || projectName == "") {
      atom.notifications.addError('请输入项目名称');
      return;
    }

    const projectDirectoryPath = this.path+projectName;
    /* 判断项目是否存在 */
    if (fs.existsSync(projectDirectoryPath)) {
      atom.notifications.addError('该项目已存在');
      return;
    }

    const projectPath = "/Users/chengzhiyong/Desktop/xBuild/xbuilder_devtest_workspace/com.xbuilder.coracle.ui.project/templates/projects/CarO2O";

    const hide = atom.workspace.hide(this);
    git.cmd(null, ['svn','clone','svn://172.16.23.172/836f56995c2740df947262f82a3d3002_55', projectDirectoryPath])
        .catch((err) => atom.notifications.addError(err));

    fs.copySync(projectPath,projectDirectoryPath);
    atom.notifications.addSuccess('创建项目成功');
    atom.workspace.getLeftDock().show();
    /* 默认打开一个文件 */
    atom.project.addPath(projectDirectoryPath);

  }

  /* 监听到项目名称，修改项目路劲 */
  onDidChange(editor) {
    /* 项目名称 */
    const projectName = this.refs.projectName.getText().trim();
    const projectPath = this.path+projectName;
    this.refs.projectPath.setText(projectPath);
  }

  /* 项目名称校验 */
  onWillInsertText(event){
    if(event.text == "/"){
      atom.notifications.addWarning('请不要输入特殊字符');
      event.cancel();
    }
  }

  getTitle () {
    return '创建项目'
  }

  update () {}

  onDidChangeTitle () { }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
