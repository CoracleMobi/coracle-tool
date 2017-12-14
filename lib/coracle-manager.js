'use babel';
/** @jsx etch.dom */

import etch from 'etch';
import React from 'react';
import {CompositeDisposable,TextEditor,Emitter} from 'atom';
const Path = require("path")

var fse = require('fs-extra')

const app_template_config = require(`./../app_template/config.json`)
const app_template_path = "../app_template"

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
 },

 init({name, template, output}){
   name += ""
   template += ""
   output += ""

   if( ! app_template_config[template]){
     console.error(`不支持的模板类型:${template} 可选模板: ${Object.keys(app_template_config)}`)
     return
   }

   this.createAppProject(name,template,output);

 },
   createAppProject(name, template, output) {

     var root = Path.resolve(output,name)

     if (!fse.existsSync(root)) {
       fse.mkdirSync(root);
     }

     try {
       let templatePath = Path.join(__dirname, app_template_path, template)
       fse.copySync(templatePath,root)

       let configFilePath =  Path.join(root, "config.xml")
       let configText = fse.readFileSync(configFilePath, 'utf8')
       configText = configText.replace(/\<name\>.*\<\/name\>/g, `<name>${name}</name>`);
       fse.writeFileSync(configFilePath, configText, 'utf8');

       return
     } catch (err) {
       console.error(`创建coralce项目失败:` + err)
       return
     }
   }
}
