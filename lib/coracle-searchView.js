'use babel';

import { SelectListView } from 'atom-space-pen-views';

class SearchView extends SelectListView {
  constructor() {
    super();
    this.panel = atom.workspace.addModalPanel({item: this});
    this.setMaxItems(50);
    this.focusFilterEditor();
  },

  veiwForItem(item) {
      return `<li>${item.name}</li>`;
  },

  confirmed(item) {
        // todo
        this.emit('navigate-to',item);
  },

  getFilterKey() {
        return 'name';
  }
}

export default SearchView;
