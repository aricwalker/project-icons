'use babel';

import ProjectIconsView from './project-icons-view';
import { CompositeDisposable } from 'atom';

export default {

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'project-icons:toggle': () => this.createIconsView().toggle()
    }));

    this.projectAlias = (state.projectAlias ? state.projectAlias : undefined);
    this._updateWindowTitle = atom.workspace.updateWindowTitle;
    if (this.projectAlias) {
      atom.workspace.updateWindowTitle = this.setWindowTitle.bind(this);
      atom.workspace.updateWindowTitle()
    }
  },

  deactivate() {
    this.subscriptions.dispose();
    this.projectIconsView.destroy();
  },

  serialize() {
    return {
      projectAlias: this.projectAlias
    };
  },

  createIconsView() {
    if (this.projectIconsView) {
      return this.projectIconsView;
    }
    const ProjectIconsView  = require('./project-icons-view');
    this.projectIconsView = new ProjectIconsView({creator: this});
    return this.projectIconsView;
  },

  addProjectAlias(alias) {
    this.projectAlias = alias;
    atom.workspace.updateWindowTitle = this.setWindowTitle.bind(this);
  },

  resetProjectAlias() {
    this.projectAlias = undefined;
    atom.workspace.updateWindowTitle = this._updateWindowTitle;
    atom.workspace.updateWindowTitle();
  },

  setWindowTitle() {
    if (this.projectAlias) {
      document.title = this.projectAlias;
    }
  }
};
