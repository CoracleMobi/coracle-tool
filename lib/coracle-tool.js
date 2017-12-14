'use babel';
const {ipcRenderer} = require('electron')
import CoracleToolView from './coracle-tool-view';
import { CompositeDisposable,TextEditor,Directory ,Emitter} from 'atom';

import WebView from './coracle-webview'

import CoracleManager from './coracle-manager'
import NavigateTo from './dialogs/navigate-to-dialog';
import MyListView from './dialogs/searchList';
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

const LOGIN_URI = 'coracle-webview://login';

export default {
  subscriptions: null,
  modalPanel: null,
  port: null,
  svnUrl:null,
  dirPath:null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.emitter = new Emitter();
    this.emitter.on('log',(cmd)=>{
        this.consolePanel.log(cmd.content,cmd.level);
    });

    this.subscriptions = new CompositeDisposable()
    /* 项目模板指令集. */
      atom.commands.add('atom-workspace', 'coracle:initApp,template=default',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:initApp,template=bottom',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:initApp,template=home',
        (event)=>(this.convertCommandToMethod({event:event})))
      atom.commands.add('atom-workspace', 'coracle:initApp,template=slide',
        (event)=>(this.convertCommandToMethod({event:event})))

      /* 页面模板指令集. */
      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page001',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page002',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page003',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page004',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page005',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page006',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page007',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page008',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page009',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page010',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page011',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page012',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page013',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page014',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page015',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page016',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page017',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page018',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page019',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page020',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page021',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page022',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page023',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page024',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page025',
        (event)=>(this.convertCommandToMethod({event:event})))

      atom.commands.add('atom-workspace', 'coracle:addFileTemplate,template=page026',
        (event)=>(this.convertCommandToMethod({event:event})))

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

      this.subscriptions.add(atom.workspace.addOpener(this.opener.bind(this)));

      /* 验证用户是否登录 */
      this.userName = atom.config.get('userName');
      if (this.userName == null) {
        atom.notifications.addInfo('登录体验更多云功能');
        this.login();
      }else {
        let name = atom.config.get('userName');
        atom.notifications.addInfo(name+'登录成功');

        this.welcome();
      }

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.coracleToolView.destroy();
  },

  opener (url) {
      if (Url.parse(url).protocol == 'coracle-create:') {
        const webview = new WebView({uri: 'http://app.coracle.com:5303/ide/project.html'});
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
                  git.cmd(null, ['svn','clone','svn://172.16.23.86/55e523a37c7947bb969d56cbdd0a9fe6_252','--no-minimize-url',dir])
                      .catch((err) => atom.notifications.addError(err));
                    atom.notifications.addInfo('创建项目'+appInfo.name+'成功,正在拉取代码');
                    atom.workspace.getLeftDock().show();
                    /* 默认打开一个文件 */
                    atom.project.addPath(dir);

                    let workspacePath = Path.resolve(dir,"../")
                    CoracleManager.init({name:appInfo.name, template:'widget', output:workspacePath});
                    const hide = atom.workspace.hide(this);
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
              for(const project of projects.projects){
                projectList.push(project);
              }
            }
          } catch (e) {

          }
          webview.getWebVieElement().send('sendProjectInfo',projectList);
        });

        webview.addIpcMessageListener('create-cancelApp', (data) => {
             this.welcome();
        });
        return webview;
      }

      if (Url.parse(url).protocol == 'coracle-login:') {
        const webview = new WebView({uri: 'http://172.16.23.86:8088/portal/login'});
        webview.addIpcMessageListener('after-logined', (userInfo) => {
            atom.config.set('userName',userInfo.userName);
            atom.config.set('userPwd',userInfo.password);
            atom.notifications.addInfo(userInfo.userName+'登录成功');
            CoracleManager.sendLogin(userInfo.userName,userInfo.password);
            this.loginSuccess();
        });
        return webview;
      }

      if (Url.parse(url).protocol == 'coracle-welcome:') {
        const webview = new WebView({uri: 'http://app.coracle.com:5303/ide/welcome.html'});
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
        return webview;
      }

      if (Url.parse(url).protocol == 'coracle-cloud:') {
        return new CloudView();
      }

      if (Url.parse(url).protocol == 'coracle-sync:') {
        const webview = new WebView({uri: 'http://app.coracle.com:5303/ide/sync.html'});
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
              for(const project of projects.projects){
                projectList.push(project);
              }
            }
          } catch (e) {

          }
          that.send('sendProjectInfo',projectList);
        });

        return webview;
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

    synctoCloud({event}){

        let projectRootPath = this.fetchProjectRootPath({event:event})

        if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
           atom.notifications.addWarning(`${projectRootPath} 不是有效的coralce项目!`)
           return
         }
        atom.notifications.addSuccess('成功与云端同步数据',{'detail':'* 在做云端同步前,开发者需要将变更的文件,做一次本地提交: 右键文件或目录或项目根目录 -> Git ->  Git add + commit* 云端同步,指的是将已提交到本地 GIT 仓库的变更,同步到云端SVN/GIT服务器;未做本地提交的文件变更,不会提交到云端 SVN/GIT 服务器'});

        git.cmd(projectRootPath, ['svn','rebase']);

        git.cmd(projectRootPath,['svn','dcommit','--username','coralce']).catch((err)  => {atom.notifications.addWarning('检测到云端代码与本地未提交代码有冲突',{'detail':'在解决每个冲突后,在左侧树状图右键该文件执行Git ->  Git add + commit,以使修改冲突真正生效'})
             atom.notifications.addWarning(err);
             git.cmd(projectRootPath, ['rebase','--skip']);
             git.cmd(projectRootPath, ['svn','dcommit']);
           }
        );
    },

    syncfromCloud({event}){
      let projectRootPath = this.fetchProjectRootPath({event:event})

      if ( ! fs.existsSync(Path.resolve(projectRootPath, "config.xml"))){
         atom.notifications.addWarning(`${projectRootPath} 不是有效的coralce项目!`)
         return
       }
        git.cmd(projectRootPath, ['svn','rebase'])
            .catch((err) => atom.notifications.addError(err));
    },

    cloudBuild({event}){

            this.destoryView();

            activePane = atom.workspace.paneForItem||atom.workspace.getActiveTextEditor();
            that = this;
            atom.workspace.open('coracle-cloud://cloud',activePane)
            .then(view => {
                that.cloudView= view;
                that.cloudView.reject();
            });
    },

    chectoutfromGit({event}){

    },

    chectoutfromCoracle({event}){

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

    loginSuccess(){

      git.cmd(null, ['co','svn://172.16.23.86/55e523a37c7947bb969d56cbdd0a9fe6_252','--depth','empty','--username','coracle','--password','coracle2017fk'],'',false,false);
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
