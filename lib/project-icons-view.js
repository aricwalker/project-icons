'use babel';

import SelectList from 'atom-select-list';

const actions = {
  SET : 'set',
  RESET : 'reset'
};

const options = [
  [actions.SET, 'Set project alias'],
  [actions.RESET, 'Reset project alias']
];

export default class ProjectIconsView {

  constructor({creator}) {
    this.creator = creator;
    this.selectList = new SelectList({
      items: options,
      filter: () => { return options },
      elementForItem: this.elementForItem,
      didConfirmSelection: this.didConfirmSelection.bind(this),
      didCancelSelection: this.didCancelSelection.bind(this)
    });
    this.element = this.selectList.element;
    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false,
      autoFocus: true
    });
  }

  toggle() {
    this.panel.isVisible() ? this.hideView() : this.showView()
  }

  // ***** Begin SelectList functions *****

  elementForItem(item) {
    const li = document.createElement('li');
    const primaryLine = document.createElement('div');
    primaryLine.classList.add('primary-line');
    primaryLine.textContent = item[1];
    li.appendChild(primaryLine);
    return li;
  }

  didConfirmSelection(item) {
    if (actions.SET == item[0]) {
      this.creator.addProjectAlias(this.selectList.refs.queryEditor.buffer.cachedText);
    } else if (actions.RESET == item[0]) {
      this.creator.resetProjectAlias();
    }
    this.creator.setWindowTitle();
    this.hideView();
  }

  didCancelSelection() {
    this.hideView();
  }

  // ***** End SelectList functions *****

  specifiedTitle() {
    return this.specifiedTitle;
  }

  showView() {
    this.panel.show();
    this.selectList.focus();
  }

  hideView() {
    this.panel.hide();
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
