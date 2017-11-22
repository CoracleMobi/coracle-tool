'use babel';

import CoracleToolView from './coracle-tool-view';
import { CompositeDisposable } from 'atom';

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
  },

  toggle() {
    console.log('CoracleTool was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
