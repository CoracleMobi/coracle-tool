'use babel';
/** @jsx etch.dom */

import etch from 'etch';
import React from 'react';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';

export default {

 sendLogin(userName,userPwd) {

   xmlHttp = this.createXMLHttpRequest();
   var url = "http://172.16.23.86:8088/portal/svnLogin?username="+userName+"&password="+userPwd;
   xmlHttp.open("POST", url, true);// 异步处理返回
   that = this;
   xmlHttp.onreadystatechange = function(){
     if (xmlHttp.status == 200 && xmlHttp.readyState == 4) {
       json = JSON.parse(xmlHttp.responseText);
       atom.config.set('userName','coracle');
       atom.config.set('userPwd','coracle');
       atom.config.set('prejectsInfo',JSON.stringify(json));
     }
   };
   xmlHttp.setRequestHeader("Content-Type",
           "application/x-www-form-urlencoded;");
   xmlHttp.send();
 },

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
