'use babel';

import CoracleToolView from './coracle-tool-view';
import { CompositeDisposable,TextEditor,Directory } from 'atom';
// import NavigateTo from './dialogs/navigate-to-dialog';
// import MyListView from './dialogs/searchList';
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

  coracleToolView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.coracleToolView = new CoracleToolView(state.coracleToolViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.coracleToolView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'coracle-tool:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.coracleToolView.destroy();
  },

  serialize() {
    return {
      coracleToolViewState: this.coracleToolView.serialize()
    };
  }

};