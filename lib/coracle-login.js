'use babel';
/** @jsx etch.dom */

import etch from 'etch';
import React from 'react';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';

export default class CoracleLogin{
  constructor(uri){
    this.uri = uri;
    etch.initialize(this);
    this.emitter = new Emitter();
  }


  render(){
    return (
        <iframe id="coracle" src='http://127.0.0.1:8080/module_login/' style="display:none" width='500px' height = '800px' ></iframe>
    )
  }

  update () {}


  reject(){
    that = this;
    const fWindow = document.getElementById("coracle").contentWindow;
    fWindow.CoracleStudio = {
      login: function (param) {
        atom.config.set('userName',param['username']);
        atom.config.set('userPwd',param['password']);
        atom.notifications.addInfo(param['username']+'登录成功');
        that.loginSuccess();
      }
    }
 }

 destroy() {
      var pane = atom.workspace.paneForURI(this.uri);
      pane.destroyItem(this);
      // 如果当前窗口容器中只有文档视图，那么把容器都销毁掉
      if (pane.getItems().length === 0) {
          pane.destroy();
      }
  }

 loginSuccess(){
   this.emitter.emit('loginSuccess',this);
 }

 onLoginSuccess(callback){
   this.emitter.on('loginSuccess',callback);
 }

  getTitle () {
      return 'CorMobi'
  }

 getElement(){
   return this.element;
 }

 login(){
   const userName = this.refs.userName.getText().trim();
   const userPwd = this.refs.userPwd.getText().trim();
   this.sendLogin(userName,userPwd);
 }

 canceLogin(){
   this.emitter.emit('cancel',this);
 }


 onCancel(callback){
   this.emitter.on('cancel',callback);
 }

 sendLogin(userName,userPwd) {
   if (userName == null || userName == "") {
     atom.notifications.addWarning('请输入用户名');
     return;
   }

   if (userPwd == null) {
     atom.notifications.addWarning('请输入密码');
     return;
   }
   xmlHttp = this.createXMLHttpRequest();
   var url = "http://172.16.23.172:8088/portal/svnLogin?username="+userName+"&password="+userPwd;
   xmlHttp.open("POST", url, true);// 异步处理返回
   that = this;
   xmlHttp.onreadystatechange = function(){
     if (xmlHttp.status == 200 && xmlHttp.readyState == 4) {
       json = JSON.parse(xmlHttp.responseText);
       atom.config.set('userName','coracle');
       atom.config.set('userPwd','coracle');
       atom.config.set('prejectsInfo',JSON.stringify(json));
       that.canceLogin();
       atom.notifications.addSuccess('登录成功');
     }
   };
   xmlHttp.setRequestHeader("Content-Type",
           "application/x-www-form-urlencoded;");
   xmlHttp.send();
 }

/* 创建http请求 */
 createXMLHttpRequest(){
   var xmlHttp;
   if (window.XMLHttpRequest) {
       xmlHttp = new XMLHttpRequest();
       if (xmlHttp.overrideMimeType)
           xmlHttp.overrideMimeType('text/xml');
   } else if (window.ActiveXObject) {
       try {
           xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
       } catch (e) {
           try {
               xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
           } catch (e) {
           }
       }
   }
   return xmlHttp;
 }

}
