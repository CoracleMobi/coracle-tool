'use babel';
const {ipcRenderer} = require('electron')
import CoracleToolView from './coracle-tool-view';
import { CompositeDisposable,TextEditor,Directory ,Emitter} from 'atom';

import WebView from './coracle-webview'

import CoracleManager from './coracle-manager'
import NavigateTo from './dialogs/navigate-to-dialog';
import MyListView from './dialogs/searchList';
import AboutView from './about-xbuilder';
import git from './git-cmd';
import Url from 'url';
import fsp from 'fs-plus';
import WifiSync from './WifiSync';
const Shell = require('shell')
const {spawn}  = require('child_process')
const Path = require("path")
const os =require("os")
const CORAcle = require("apicloud-tools-core")
const querystring = require('querystring')
const http = require("http")
const dialog = require ("./dialogs/dialog")
const fs = require("fs")
const homedir = os.homedir();
var fse = require('fs-extra')
var package = require('../package')

const LOGIN_URI = 'coracle-webview://login';

export default {
  subscriptions: null,
  modalPanel: null,
  port: null,
  svnUrl:null,
  dirPath:null,

  activate(state) {


    /* 真机同步服务自启动. */
      let port = this.getRandomIntInclusive(1001,9999)
      console.log(`随机使用端口:${port}`)

      this.port = port
      this.startWifi({port: this.port})

    this.emitter = new Emitter();
    this.emitter.on('log',(cmd)=>{
        this.consolePanel.log(cmd.content,cmd.level);
    });

    this.subscriptions = new CompositeDisposable()

      /* wifi 同步指令. */
      atom.commands.add('atom-workspace', 'coracle:previewWifi',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:syncWifi',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:syncAllWifi',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:wifiLog',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:wifiInfo',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:startWifi',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:endWifi',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:cloudBuild',
            (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:moduleManage',
            (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:chectoutfromGit',
          (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:chectoutfromCoracle',
              (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:synctoCloud',
          (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:syncfromCloud',
              (event)=>(this.convertCommandToMethod({event:event})))

      /* 创建项目 */
      atom.commands.add('atom-workspace', 'coracle:createProject',
              (event)=>(this.convertCommandToMethod({event:event})))

      /* 登录 */
      atom.commands.add('atom-workspace', 'coracle:welcomeorlogin',
              (event)=>(this.convertCommandToMethod({event:event})))

      /* 注销 */
      atom.commands.add('atom-workspace', 'coracle:exitorlogin',
              (event)=>(this.convertCommandToMethod({event:event})))

      /* 关于 */
      atom.commands.add('atom-workspace', 'coracle:aboutStudio',
              (event)=>(this.convertCommandToMethod({event:event})))

      this.subscriptions.add(atom.workspace.addOpener(this.opener.bind(this)));

      /* 验证用户是否登录 */
      this.userName = atom.config.get('userName');
      if (this.userName == null) {
        atom.notifications.addInfo('登录体验更多云功能');
        this.login();
      }else {
        let name = atom.config.get('userName');

        this.welcome();
      }

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.coracleToolView.destroy();
  },

  opener (url) {

      const urlInfo = Url.parse(url);
      if (urlInfo.protocol == 'coracle-create:') {
        const webview = new WebView({uri: package.host+'/portal/ide/project.html'});
        webview.addIpcMessageListener('create-createApp', (appInfo) => {
            atom.notifications.addInfo('正在创建应用'+appInfo.name);
            this.destoryView();
              atom.workspace.getActivePane().activate();
              responseChannel = "atom-pick-folder-response";
              that = this;
              ipcRenderer.on(responseChannel, function(event, path) {
                ipcRenderer.removeAllListeners(responseChannel);
                if (path != null) {
                  var dir = Path.resolve(path+'/'+appInfo.name);
                  fs.mkdir(dir);
                  git.cmd(null, ['ls',appInfo.svn,'--username',that.userName,'--password','coracle2017fk2'],'',false,false);
                  git.cmd(null, ['svn','clone',appInfo.svn,dir])
                  .then(()=>{
                    atom.notifications.addInfo('创建项目'+appInfo.name+'成功,正在拉取代码');  
                    atom.workspace.getLeftDock().show();
                    /* 默认打开一个文件 */
                    atom.project.addPath(dir);
                    console.log(appInfo);
                    setTimeout(() => that.syncfromCloudFirst(dir,appInfo),6000);
                    let workspacePath = Path.resolve(dir,"../")
                    //setTimeout(() => CoracleManager.init({appInfo:appInfo, output:workspacePath}),6000);
                    const hide = atom.workspace.hide(this);
                  })     
                  .catch((err) => atom.notifications.addError(err));
         
                }
              });
              ipcRenderer.send("pick-folder", responseChannel);

        });

        webview.addIpcMessageListener('sync-projectInfo', ()=>{
          let prejectsInfo = atom.config.get('prejectsInfo');
          const projectList = new Array();
          try {
            prejectsInfo = JSON.parse(prejectsInfo)
            for(const projects of prejectsInfo.data){
                projectList.push(projects);
            }
          } catch (e) {

          }
          webview.getWebVieElement().send('sendProjectInfo',projectList);        
        });


        webview.addIpcMessageListener('after-logined', (userInfo) => {
          atom.config.set('userName',userInfo.userName);
          atom.config.set('userPwd',userInfo.password);
          atom.notifications.addInfo(userInfo.userName+'登录成功');
          CoracleManager.sendLogin(userInfo.userName,userInfo.password);
          this.loginSuccess(userInfo.userName);
        });


        webview.addIpcMessageListener('create-cancelApp', (data) => {
             this.welcome();
        });
        return webview;
      }

      if (urlInfo.protocol == 'coracle-login:') {

        const webview = new WebView({uri: package.host+"/portal/login"});
        webview.addIpcMessageListener('after-logined', (userInfo) => {
            atom.config.set('userName',userInfo.userName);
            atom.config.set('userPwd',userInfo.password);
            atom.notifications.addInfo(userInfo.userName+'登录成功');
            CoracleManager.sendLogin(userInfo.userName,userInfo.password);
            this.loginSuccess();
        });
        return webview;
      }

      if (urlInfo.protocol == 'coracle-welcome:') {
        const webview = new WebView({uri: package.host+"/portal/ide/welcome.html"});
        webview.addIpcMessageListener('create-Project', (data) => {
           if(data == 1) {
             this.createProject();
           }else {
             this.synProject();
           }
        });

        webview.addIpcMessageListener('after-url', (url) => {
            Shell.openExternal(url)
        });

        webview.addIpcMessageListener('after-logined', (userInfo) => {
          atom.config.set('userName',userInfo.userName);
          atom.config.set('userPwd',userInfo.password);
          atom.notifications.addInfo(userInfo.userName+'登录成功');
          CoracleManager.sendLogin(userInfo.userName,userInfo.password);
          this.loginSuccess(userInfo.userName);
        });

        return webview;
      }

      if (urlInfo.protocol == 'coracle-cloud:') {
        console.log(Url.parse(url));
        const webview = new WebView({uri: package.host+'/portal/project/'+urlInfo.query+'/compile'});

        webview.addIpcMessageListener('after-logined', (userInfo) => {
          atom.config.set('userName',userInfo.userName);
          atom.config.set('userPwd',userInfo.password);
          atom.notifications.addInfo(userInfo.userName+'登录成功');
          CoracleManager.sendLogin(userInfo.userName,userInfo.password);
          this.loginSuccess();
        });
        return webview;
      }

      if (urlInfo.protocol == 'coracle-module:') {
        const webview = new WebView({uri: package.host+'/portal/project/'+urlInfo.query+'/plugin'});

        webview.addIpcMessageListener('after-logined', (userInfo) => {
          atom.config.set('userName',userInfo.userName);
          atom.config.set('userPwd',userInfo.password);
          atom.notifications.addInfo(userInfo.userName+'登录成功');
          CoracleManager.sendLogin(userInfo.userName,userInfo.password);
          this.loginSuccess(userInfo.userName);
        });

        return webview;
      }

      if (urlInfo.protocol == 'coracle-sync:') {
        const webview = new WebView({uri: package.host+'/portal/ide/sync.html'});
        const that = webview.getWebVieElement();
        webview.addIpcMessageListener('create-syncApp', (data) => {
            this.syncProject(data)
            this.welcome();
        });

        webview.addIpcMessageListener('create-cancelSync', (data) => {
            this.welcome();
        });

        webview.addIpcMessageListener('sync-projectInfo', ()=>{

          let prejectsInfo = atom.config.get('prejectsInfo');
          const projectList = new Array();
          try {
            prejectsInfo = JSON.parse(prejectsInfo)
            for(const projects of prejectsInfo.data){
                projectList.push(projects);
            }
          } catch (e) {

          }
          that.send('sendProjectInfo',projectList);
        });

        webview.addIpcMessageListener('after-logined', (userInfo) => {
          atom.config.set('userName',userInfo.userName);
          atom.config.set('userPwd',userInfo.password);
          atom.notifications.addInfo(userInfo.userName+'登录成功');
          CoracleManager.sendLogin(userInfo.userName,userInfo.password);
          this.loginSuccess(userInfo.userName);
        });

        return webview;
      }

      if (urlInfo.protocol == 'about-studio:') {
        return new AboutView();
      }

  },

  /*获取一个范围的随机数,可选范围内包含最大与最小值.*/
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  getUserHome() { // 获取用户目录.
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
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

      // dialog.showSaveDialog({
      //   title:"创建 coralce 页面框架--输入页面名称,并选中项目根目录",
      //   properties:['createDirectory']
      // },(project)=>{
      //   if( ! project){
      //     console.log("用户取消操作")
      //     return
      //   }
      //
      //   name = Path.basename(project)
      //
      //   let projectRootPath = Path.resolve(project, "../")
      //
      //  if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
      //     atom.notifications.addWarning(`${projectRootPath} 不是有效的Coracle项目!`)
      //     return
      //   }
      //
      //   atom.project.addPath(projectRootPath)
      //   CORAcle.addFileTemplate({name:name,output:projectRootPath,template:template})
      // })
    },
    /* 新建 CORAcle 项目模板. */
    initApp({template, event}){
      let name = template

      // dialog.showSaveDialog({
      //   title:"创建 Coracle 项目模板",
      //
      //   properties:['createDirectory']
      // },(project)=>{
      //   if( ! project){
      //     console.log("用户取消操作")
      //     return
      //   }
      //
      //   let projectRootPath = project
      //
      //   let workspacePath = Path.resolve(projectRootPath,"../")
      //
      //   name = Path.basename(projectRootPath)
      //   CORAcle.init({name:name, template:template, output:workspacePath})
      //   let newAppProjectPath = Path.resolve(workspacePath,name)
      //   atom.project.addPath(newAppProjectPath)
      // })
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
      if (projectRootPath == undefined || projectRootPath == null) {
        return
      }
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
            const defaultSuccessTip = "请在Xbuild开发控制台查看日志信息"
            atom.notifications.addInfo(defaultSuccessTip)
          })
    },
    wifiInfo({event}){
      let {port,ip,clientsCount} = {ip:WifiSync.localIp(),
            port:WifiSync.port,clientsCount:WifiSync.clientsCount}
      // atom.openDevTools()
          // .then(()=>{
            let tip = `IP :[${JSON.stringify(ip)}]\n 端口:${port}\n设备连接数:${clientsCount}`
            console.log(tip)

            atom.notifications.addInfo(tip,{
              "detail":"提示: 请下载并打开AppRunner 或 自定义AppRunner, 点击小圆球, 输入 IP 和端口连接,以进行 WIFI 调试","dismissable":true
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

    synctoCloud({event}){

        let projectRootPath = this.fetchProjectRootPath({event:event})
        if (projectRootPath == undefined || projectRootPath == null) {
          atom.notifications.addWarning(`${projectRootPath} 请至少打开一个有效的coralce项目!`)
          return
        }
        if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
           atom.notifications.addWarning(`${projectRootPath} 不是有效的coralce项目!`)
           return
         }
        atom.notifications.addSuccess('成功与云端同步数据',{'detail':'* 在做云端同步前,开发者需要将变更的文件,做一次本地提交: \n* 右键文件或目录或项目根目录 -> Git ->  Git add + commit \n* 云端同步,指的是将已提交到本地 GIT 仓库的变更,同步到云端SVN/GIT服务器;\n* 未做本地提交的文件变更,不会提交到云端 SVN/GIT 服务器'});

        git.cmd(projectRootPath, ['svn','rebase']);
        this.userName = atom.config.get('userName');
        git.cmd(projectRootPath,['svn','dcommit','--username',this.userName]).catch((err)  => {atom.notifications.addWarning('检测到云端代码与本地未提交代码有冲突',{'detail':'在解决每个冲突后,在左侧树状图右键该文件执行Git ->  Git add + commit,以使修改冲突真正生效'})
             atom.notifications.addWarning(err);
             git.cmd(projectRootPath, ['rebase','--skip']);
             git.cmd(projectRootPath, ['svn','dcommit']);
           }
        );
    },

    syncfromCloud({event}){
      let projectRootPath = this.fetchProjectRootPath({event:event})
      if (projectRootPath == undefined || projectRootPath == null) {
        atom.notifications.addWarning(`${projectRootPath} 请至少打开一个有效的coralce项目!`)
        return
      }
      if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
         atom.notifications.addWarning(`${projectRootPath} 不是有效的coralce项目!`)
         return
       }
        git.cmd(projectRootPath, ['svn','rebase'])
            .catch((err) => atom.notifications.addError(err));
    },
    
    syncfromCloudFirst(projectRootPath,appInfo){
      if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
        let workspacePath = Path.resolve(projectRootPath,"../")
        git.cmd(projectRootPath, ['svn','rebase']).then(()=>{
          setTimeout(() => CoracleManager.init({appInfo:appInfo, output:workspacePath}),3000);
        })
        .catch((err) => atom.notifications.addError(err));
      }
    },

    cloudBuild({event}){
        let projectRootPath = this.fetchProjectRootPath({event:event})
        if (projectRootPath == undefined || projectRootPath == null) {
          atom.notifications.addWarning(`${projectRootPath} 请至少打开一个有效的coralce项目!`)
          return
        }
        if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
          atom.notifications.addWarning(`${projectRootPath} 不是有效的coralce项目!`)
          return
        }
        
        let configFilePath =Path.resolve(projectRootPath, "config.xml");
        let configText = fse.readFileSync(configFilePath, 'utf8');
        let appIdInfo = configText.match(/widget.*appId\s*=\s*\"(.*)\"\s+pId\s*=\s*\"(.*)\"/)
        if (appIdInfo === null){
          atom.notifications.addWarning(`${projectRootPath} 无有效的项目id或应用id!`)
          return
        }
        let appId = appIdInfo[1];
        let pId = appIdInfo[2];
        if (appId.length === 0 || pId.length === 0){
          atom.notifications.addWarning(`${projectRootPath} 无有效的项目id或应用id!`)
          return
        }
        this.destoryView();
        that = this;
        atom.workspace.open('coracle-cloud://localhost?'+pId+'/'+appId).then(view => {
             this.webView = view;
         });
    },

    moduleManage({event}){

        let projectRootPath = this.fetchProjectRootPath({event:event})
        if (projectRootPath == undefined || projectRootPath == null) {
          atom.notifications.addWarning(`${projectRootPath} 请至少打开一个有效的coralce项目!`)
          return
        }
        if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
          atom.notifications.addWarning(`${projectRootPath} 不是有效的coralce项目!`)
          return
        }

        let configFilePath =Path.resolve(projectRootPath, "config.xml");
        let configText = fse.readFileSync(configFilePath, 'utf8');
        let appIdInfo = configText.match(/widget.*appId\s*=\s*\"(.*)\"\s+pId\s*=\s*\"(.*)\"/)
        if (appIdInfo === null){
          atom.notifications.addWarning(`${projectRootPath} 无有效的项目id或应用id!`)
          return
        }
        let appId = appIdInfo[1];
        let pId = appIdInfo[2];
        if (appId.length === 0 || pId.length === 0){
          atom.notifications.addWarning(`${projectRootPath} 无有效的项目id或应用id!`)
          return
        }
        this.destoryView();
        that = this;
        atom.workspace.open('coracle-module://localhost?'+pId+'/'+appId).then(view => {
             this.webView = view;
        });
    },

    chectoutfromGit({event}){

    },

    chectoutfromCoracle({event}){
      const userName = atom.config.get('userName');
      if (userName == null || userName == '' || userName == undefined) {
        atom.notifications.addInfo('登录体验更多云功能');
        return;
      }
      let prejectsInfo = atom.config.get('prejectsInfo');
      const projectList = new Array();
      try {
        prejectsInfo = JSON.parse(prejectsInfo)
        for(const projects of prejectsInfo.data){
          for(const project of projects.projects){
            projectList.push(project);
          }
        }
      } catch (e) {

      }

      const list = new MyListView();
      list.setItems(projectList);
      list.on('navigate-to', (e, project) => {

        const destroyPanel = list.panel;
        list.panel = null;
        if (destroyPanel) {
          destroyPanel.destroy();
        }
        atom.workspace.getActivePane().activate();
        this.syncProject(project)
      });
    },

    syncProject(project){
      responseChannel = "atom-pick-folder-response";
      ipcRenderer.on(responseChannel, function(event, path) {
        ipcRenderer.removeAllListeners(responseChannel);
        if (path != null) {
          var dir = Path.resolve(path+'/'+project.projectName);
          fs.mkdir(dir);
          git.cmd(null, ['ls',project.svn,'--username',that.userName,'--password','coracle2017fk2'],'',false,false);
          git.cmd(null, ['svn','clone',project.svn, dir])
              .catch((err) => atom.notifications.addError(err));

            atom.workspace.getLeftDock().show();
            atom.project.addPath(dir);
        }
      });
      return ipcRenderer.send("pick-folder", responseChannel);
    },


    welcomeorlogin(event){
      this.userName = atom.config.get('userName');
      if (this.userName == null) {
        atom.notifications.addInfo('登录体验更多云功能');
        this.login();
      }else {
        let name = atom.config.get('userName');
        this.welcome();
      }
    },

    login(event){
       this.destoryView();
       activePane = atom.workspace.paneForItem||atom.workspace.getActiveTextEditor()
       that = this;
       atom.workspace.open('coracle-login://login').then(view => {
            this.webView = view;
        });
    },

    loginSuccess(userName){
        this.welcome();
    },

    welcome(event){
      this.destoryView();
      that = this;
      atom.workspace.open('coracle-welcome://welcome').then(view => {
           this.webView = view;
      });
    },

    cancleCreateProject(){
      this.welcome();
    },

    createProject (event){
      this.destoryView();
      that = this;
      atom.workspace.open('coracle-create://project')
      .then(view => {
          that.webView = view;
      });
    },


    synProject(){
       this.destoryView();

       that = this;
       atom.workspace.open('coracle-sync://project')
       .then(view => {
           that.webView = view;
       });
    },

    exitorlogin(event){

      this.userName = atom.config.get('userName');
      if (this.userName == null) {
        atom.notifications.addInfo('登录体验更多云功能');
        this.login();
      }else {
        atom.config.set('userName', null);
        atom.config.set('userPwd', null);
        atom.config.set('prejectsInfo', null);
        atom.notifications.addSuccess('注销用户成功!部分云功能将受限制');
      }
    },

    aboutStudio(event){
      that = this;
      atom.workspace.open('about-studio://about')
      .then(view => {
          that.aboutView = view;
      });
    },

    destoryView(){
      if (this.webView) {
          this.webView.destroy();
      }


    },

    consumeConsolePanel(consolePanel){
       this.consolePanel = consolePanel;
       git.initConsolePane(consolePanel);
    }

};
