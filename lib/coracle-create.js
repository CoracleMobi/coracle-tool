/** @babel */
/** @jsx etch.dom */

const {ipcRenderer} = require('electron')
const Path = require("path")
import path from 'path';
import etch from 'etch';
import React from 'react';
import fs from 'fs-plus';
import git from './git-cmd';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';

export default class CoracleCreateProject{
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
      <iframe id="coracle" src='http://172.16.10.250:8080/module_project/' style="display:none" width='800px' height = '800px' ></iframe>
    )
  }

reject(){
    that = this;
    const fWindow = document.getElementById("coracle").contentWindow;
    fWindow.CoracleStudio = {
      completeModule: function (param) {

        that.createProject(param);
      },
      cancleProject: function () {
        that.cancleCreate();
      },
    }
 }

 onCancleCreateProject(callback){
   this.emitter.on('coracle_ancleCreate',callback);
 }

cancleCreate(){
  // alert("cancleCreate");
  this.emitter.emit('coracle_ancleCreate',this);
}



  createProject (param){
    /* 项目名称 */
    const projectName = param["project_name"];
    /* 项目说明 */
    const projectDesc = param["project_des"];

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

    that = this
    atom.workspace.getActivePane().activate();
    responseChannel = "atom-pick-folder-response";
    ipcRenderer.on(responseChannel, function(event, path) {
      ipcRenderer.removeAllListeners(responseChannel);
      if (path != null) {
        var dir = Path.resolve(path+'/'+projectName);
        git.cmd(null, ['svn','clone','svn://172.16.23.86/836f56995c2740df947262f82a3d3002_55', dir])
            .catch((err) => atom.notifications.addError(err));
          atom.notifications.addInfo('创建项目'+param['project_name']+'成功,正在拉取代码');
          atom.workspace.getLeftDock().show();
          /* 默认打开一个文件 */
          atom.project.addPath(dir);

          const hide = atom.workspace.hide(that);
      }
    });
    return ipcRenderer.send("pick-folder", responseChannel);


    // fs.copySync(projectPath,projectDirectoryPath);



  }

  /* 监听到项目名称，修改项目路劲 */
  onDidChange(editor) {
    /* 项目名称 */
    // const projectName = this.refs.projectName.getText().trim();
    // const projectPath = this.path+projectName;
    // this.refs.projectPath.setText(projectPath);
  }

  /* 项目名称校验 */
  onWillInsertText(event){
    // if(event.text == "/"){
    //   atom.notifications.addWarning('请不要输入特殊字符');
    //   event.cancel();
    // }
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
