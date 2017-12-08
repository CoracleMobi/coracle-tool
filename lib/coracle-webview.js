'use babel';

import path from 'path';

Shell = require('shell')

let _webviewElement = null;

const _handlerKeyboardEvent = function() {
  _webviewElement.addEventListener('keydown', (event) => {
    let needSent = true;
    let keyCodeAccelerator;

    if (event.keyCode === 8) {
      keyCodeAccelerator = 'Backspace';
    } else {
      needSent = false;
    }

    needSent && _webviewElement.sendInputEvent({
        type: 'keyDown',
        keyCode: keyCodeAccelerator
    });
  });
};

export default class WebView{
  constructor(props) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('co-webview-container');

    // Create webview element
    _webviewElement = document.createElement('webview');
    _webviewElement.style.height = '100%';
    _webviewElement.setAttribute('nodeintegration', '');
    console.log(path.resolve('./coracle-webview-preload.js').split(path.sep).join(path.posix.sep))
    alert(process.env.ATOM_HOME);
    _webviewElement.setAttribute('preload', 'file:///C:/Users/ZeVan/github/my-package/lib/coracle-webview-preload.js');
    // _webviewElement.setAttribute('nodeintegration', '');
    // console.log(path.resolve('./coracle-webview-preload.js').split(path.sep).join(path.posix.sep))
    console.log(path.join(__dirname,'coracle-webview-preload.js'));

    _webviewElement.setAttribute('preload', path.join(__dirname,'coracle-webview-preload.js'));
    _webviewElement.src = props.uri;
    this.element.appendChild(_webviewElement);

    _handlerKeyboardEvent();

  }

  // Tear down any state and detach
  destroy() {
    var pane = atom.workspace.paneForURI(this.uri);
    pane.destroyItem(this);
    // 如果当前窗口容器中只有文档视图，那么把容器都销毁掉
    if (pane.getItems().length === 0) {
        pane.destroy();
    }
  }

  getTitle() {

   if(_webviewElement.src === 'http://172.16.23.86:8088/portal/login'){
        return '登录页';
   } else if (_webviewElement.src === 'http://127.0.0.1:8080/module_welcome') {
        return '欢迎页';
   } else if (_webviewElement.src === 'http://127.0.0.1:8080/module_project') {
        return '创建应用'
   }
    return 'webview';
  }

  addIpcMessageListener(channel, handler) {
    _webviewElement.addEventListener('ipc-message', (event) => {
      if (event.channel ===  channel) {
        handler.apply(_webviewElement, event.args);
      }
    });
  }

}
