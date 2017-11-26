'use babel';

import ProjectIconsView from './project-icons-view';
import { CompositeDisposable } from 'atom';

export default {

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'project-icons:toggle': () => this.createIconsView().toggle()
    }));
    
    this.projectRoot = atom.project.rootDirectories[0].lowerCasePath;
    this.projectAliases = (state.projectAliases ? state.projectAliases : {});
    this._updateWindowTitle = atom.workspace.updateWindowTitle;
    if (this.projectAliases[this.projectRoot]) {
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
      projectAliases: this.projectAliases
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
    this.projectAliases[this.projectRoot] = alias;
    atom.workspace.updateWindowTitle = this.setWindowTitle.bind(this);
  },

  resetProjectAlias() {
    this.projectAliases[this.projectRoot] = undefined;
    atom.workspace.updateWindowTitle = this._updateWindowTitle;
    atom.workspace.updateWindowTitle();
  },

  setWindowTitle() {
    if (this.projectAliases[this.projectRoot]) {
      document.title = this.projectAliases[this.projectRoot];
    }
  }
};
