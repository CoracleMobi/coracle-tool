'use babel';

import { SelectListView } from 'atom-space-pen-views';

class SearchView extends SelectListView {
  constructor() {
    super();
    this.panel = atom.workspace.addModalPanel({item: this});
    this.setMaxItems(50);
    this.focusFilterEditor();
    this.emitter = new Emitter();
  }

  veiwForItem(item) {
      return `<li>${item.projectName}</li>`;
  }

  confirmed(item) {
        // todo
        this.emitter.emit('navigate-to',item);
  }

  getFilterKey() {
        return 'name';
  }
}

export default SearchView;
