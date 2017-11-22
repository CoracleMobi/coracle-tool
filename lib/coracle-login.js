'use babel';
/** @jsx etch.dom */

import etch from 'etch';
import React from 'react';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';

export default class CoracleLogin{
  constructor(){
    etch.initialize(this);
    this.refs.userName.setPlaceholderText("用户名");
    this.refs.userPwd.setPlaceholderText("密码");
    this.emitter = new Emitter();
  }

  render(){
    return (
        <div className='login'>
          <h1>前海圆舟</h1>
          <TextEditor mini ref='userName' />
          <div className='padding'></div>
          <TextEditor mini ref='userPwd' />
          <div className='padding'></div>
          <button className='login-submit' onclick={this.login.bind(this)}>登录</button>
          <button className='login-submit' onclick={this.canceLogin.bind(this)}>下次</button>
        </div>
    )
  }

  update () {}

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
