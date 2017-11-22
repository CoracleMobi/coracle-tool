'use babel';
/** @jsx etch.dom */

import { CompositeDisposable,TextEditor,Directory } from 'atom';
import NavigateTo from './dialogs/navigate-to-dialog';
import MyListView from './dialogs/searchList';
import CreateProject from './coracle-create';
import LoginView from './coracle-login';

import git from './git-cmd';
import Url from 'url';
import fsp from 'fs-plus';
import WifiSync from './WifiSync';

const {spawn}  = require('child_process')
const Path = require("path")
const os =require("os")
const CORAcle = require("apicloud-tools-core")
const querystring = require('querystring')
const http = require("http")
const remote = require ("remote")
const dialog = remote.require("dialog") || remote["dialog"]
const fs = require("fs")


const homedir = os.homedir();



export default {
  subscriptions: null,
  modalPanel: null,
  port: null,

  /*获取一个范围的随机数,可选范围内包含最大与最小值.*/
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  getUserHome() { // 获取用户目录.
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  },


  activate(state) {




    // let port = this.getRandomIntInclusive(1001,9999)
    //   console.log(`随机使用端口:${port}`)


      // this.port = port
      // this.startWifi({port: this.port})

      // CORAcle.wifiLog(({level,content})=>{
      //   if(level === "warn"){
      //     console.warn(content)
      //     return
      //   }

      //   if(level === "error"){
      //     console.error(content)
      //     return
      //   }

      //   console.log(content)
      // })
      // .then(()=>{
      //   console.log("WiFi 日志服务已启动...")
      // })

      this.subscriptions = new CompositeDisposable();

      atom.commands.add('.coracle-view-dialog', 'core:cancel',
        (event)=>{
          this.modalPanel && this.modalPanel.destroy()
        })

      atom.commands.add('.coracle-view-dialog', 'core:confirm',
        (event)=>{
          this.modalPanel && this.modalPanel.hide()
        })



      /* 项目模板指令集. */
      // atom.commands.add('atom-workspace', 'coracle:initApp,template=default',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:initApp,template=bottom',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:initApp,template=home',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:initApp,template=slide',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      /* 页面模板指令集. */
      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page001',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page002',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page003',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page004',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page005',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page006',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page007',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page008',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page009',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page010',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page011',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page012',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page013',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page014',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page015',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page016',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page017',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page018',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page019',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page020',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page021',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page022',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page023',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page024',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page025',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page026',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      /* wifi 同步指令. */
      // atom.commands.add('atom-workspace', 'coracle:previewWifi',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:syncWifi',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:syncAllWifi',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:wifiLog',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:wifiInfo',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:startWifi',
      //   (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:endWifi',
      //   (event)=>(this.convertCommandToMethod({event:event})))

      // atom.commands.add('atom-workspace', 'coracle:chectoutfromGit',
      //     (event)=>(this.convertCommandToMethod({event:event})))
      // atom.commands.add('atom-workspace', 'coracle:chectoutfromCoracle',
      //         (event)=>(this.convertCommandToMethod({event:event})))

      /* 创建项目 */
      // atom.commands.add('atom-workspace', 'coracle:createProject',
      //         (event)=>(this.convertCommandToMethod({event:event})))

      /* 登录 */
      // atom.commands.add('atom-workspace', 'coracle:login',
      //         (event)=>(this.convertCommandToMethod({event:event})))

      this.subscriptions.add(atom.workspace.addOpener(this.opener.bind(this)));

    },

    opener (url) {
      if (Url.parse(url).protocol == 'coracle-create:') {
        return new CreateProject(url);
      }
    },

    deactivate() {
      this.modalPanel && this.modalPanel.destroy();
      this.subscriptions.dispose();
      WifiSync.endWifi({})
    },
    serialize() {
      /* 实时记录正在使用的端口. */
      return {
      };
    },


    /* 将指令解析为对应的参数与方法,指令与方法对应的规则为: 命令空间:方法名,参数1=值1,参数2=值2,
        event 为保留参数,用于传递完整字段. */
    convertCommandToMethod({event:event}){
      const namespace = "coracle:"
      let command = event.type
      if( ! (new RegExp(`^${namespace}`)).test(command)){ // 说明不是自己插件的方法.
        return
      }

      let methodName = ""
      let params = {event:event}

      let methodInfo = command.substring(namespace.length, command.length).split(",")
      methodInfo.map((item,idx)=>{
        if(0 === idx){
          methodName = item
        }else{
          let paramPair = item.split("=")
          if(paramPair && 2 === paramPair.length){
            params[paramPair[0]] = paramPair[1]
          }
        }
      })

      if("function" === typeof this[methodName]){
        this[methodName](params)
      }else{
        console.warning(`${methodName} 似乎不是一个有效的方法`)
      }
    },
    /* 新建 CORAcle 页面框架. */
    addFileTemplate({template, event}){
      let name = template

      dialog.showSaveDialog({
        title:"创建 coralce 页面框架--输入页面名称,并选中项目根目录",
        properties:['createDirectory']
      },(project)=>{
        if( ! project){
          console.log("用户取消操作")
          return
        }

        name = Path.basename(project)

        let projectRootPath = Path.resolve(project, "../")

       if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
          atom.notifications.addWarning(`${projectRootPath} 不是有效的Coracle项目!`)
          return
        }

        atom.project.addPath(projectRootPath)
        CORAcle.addFileTemplate({name:name,output:projectRootPath,template:template})
      })
    },
    /* 新建 CORAcle 项目模板. */
    initApp({template, event}){
      let name = template

      dialog.showSaveDialog({
        title:"创建 Coracle 项目模板",

        properties:['createDirectory']
      },(project)=>{
        if( ! project){
          console.log("用户取消操作")
          return
        }

        let projectRootPath = project

        let workspacePath = Path.resolve(projectRootPath,"../")

        name = Path.basename(projectRootPath)
        CORAcle.init({name:name, template:template, output:workspacePath})
        let newAppProjectPath = Path.resolve(workspacePath,name)
        atom.project.addPath(newAppProjectPath)
      })
    },
    /* 获取当前活跃的工程目录,如果event存在,将优先使用event中文件路径所在的路径. */
    fetchProjectRootPath({event}){
      // 优先 event 里的.
      let projectPaths = atom.project.getPaths()

      if( ! projectPaths || 1 === projectPaths.length){
        return projectPaths[0]
      }

      let textEditor = atom.workspace.getActiveTextEditor()
      let textPath = textEditor && textEditor.getPath()

      let targetProjectPath = [event.target.dataset.path,textPath].reduce(
        (targetProjectPath,domPath, index)=>{
          if(targetProjectPath || ! domPath){
            return targetProjectPath
          }

          let targetPath = domPath

          for (let i = 0; i < projectPaths.length; i++) {
            let projectPath = projectPaths[i]

            if(targetPath.startsWith(projectPath) &&
                fs.existsSync(Path.resolve(projectPath, "config.xml"))
            ){
              return projectPath
            }
          }
        },null)

      return targetProjectPath ? targetProjectPath : projectPaths[0]
    },
    previewWifi({event}){
      let {port,ip,clientsCount} = WifiSync.wifiInfo()
      let tip = "同步成功,请在手机上查看运行效果!"
      if(0 === clientsCount){
        tip = "当前网速过慢或没有设备处于连接状态,可能会影响相关同步功能的使用"
      }

      let filePath = event.target.dataset.path

      if( ! filePath){
        let textEditor = atom.workspace.getActiveTextEditor()
        filePath = textEditor && textEditor.getPath()
      }

      if ( ! filePath) {
        atom.notifications.addInfo("似乎没有可供预览的文件")
        return
      }

      WifiSync.previewWifi({file:filePath})
      atom.notifications.addInfo(tip)
    },
    syncWifi({event}){
      this.syncAllWifi({event:event, syncAll:false})
    },
    syncAllWifi({event,syncAll=true}){
      let tip = "同步成功,请在手机上查看运行效果!"

      let {port,ip,clientsCount} = {ip:WifiSync.localIp(),
      port:WifiSync.port,clientsCount:WifiSync.clientsCount}

      if(0 === clientsCount){
        tip = "当前网速过慢或没有设备处于连接状态,可能会影响相关同步功能的使用"
      }

      let projectRootPath = this.fetchProjectRootPath({event:event})

      if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
         atom.notifications.addWarning(`${projectRootPath} 不是有效的coralce项目!`)
         return
       }

      syncAll = syncAll ? 1 : 0

      WifiSync.sync({project:projectRootPath,updateAll:syncAll});
      atom.notifications.addInfo(tip)
    },
    wifiLog({event}){
      atom.openDevTools()
          .then(()=>{
            const defaultSuccessTip = "请在Atom开发控制台查看日志信息"
            atom.notifications.addInfo(defaultSuccessTip)
          })
    },
    wifiInfo({event}){
      let {port,ip,clientsCount} = {ip:WifiSync.localIp(),
            port:WifiSync.port,clientsCount:WifiSync.clientsCount}
      // atom.openDevTools()
          // .then(()=>{
            let tip = `IP :${JSON.stringify(ip)}\n端口:${port}\n设备连接数:${clientsCount}`
            console.log(tip)

            atom.notifications.addInfo(tip,{
              "detail":"还可在Atom控制台末尾随时查看;ip地址有可能有多个,哪个可用,取决你和电脑所处的网络",
            })
          // })
    },
    startWifi({event,port}){
      WifiSync.start({port:port});
      console.log("Coracle WiFi 真机同步服务已启动")
    },
    endWifi({event}){
      WifiSync.end({});
      console.log("Coracle WiFi 真机同步服务已关闭")
    },

    chectoutfromGit({event}){
      const dialog = new NavigateTo();

      dialog.on('navigate-to', (e, path) => {
        dialog.close();
        atom.notifications.addInfo(path.toString());
      });

      dialog.attach();


    },

    chectoutfromCoracle({event}){

      const list = new MyListView();
      const prejectsInfo = JSON.parse(atom.config.get('prejectsInfo'));
      const projectList = new Array();
      for(const projects of prejectsInfo.data){
        for(const project of projects.projects){
          projectList.push(project);
        }
      }
      list.setItems(projectList);
      list.on('navigate-to', (e, project) => {
        const destroyPanel = list.panel;
        list.panel = null;
        if (destroyPanel) {
          destroyPanel.destroy();
        }
        atom.workspace.getActivePane().activate();

        var dir = Path.resolve(fsp.getHomeDirectory()+"/Documents/Atom/"+project.projectName);

        atom.notifications.addWarning(dir);
        git.cmd(null, ['svn','clone',project.svn, dir])
            .catch((err) => atom.notifications.addError(err));

      });
    },

    createProject (event){
      atom.workspace.open('coracle-create://project',{ split: 'right', activatePane: false})
      .then(view => {
          this.CreateProject = view;
      });
    },

    login(event){
      const loginView = new LoginView();
      this.loginPanel = atom.workspace.addTopPanel({
        item: loginView.getElement(),
        visible: false,
        priority:100
      });

      this.loginPanel.show();
      loginView.onCancel(this.canceLogin.bind(this));
    },

    canceLogin(){
      this.loginPanel.hide();
    }


};
