import Server from './server';
import AutoRestartPlugin from '@sqltools/plugins/auto-restart/language-server';
import DependencyManager from '@sqltools/plugins/dependency-manager/language-server';

new Server()
  .listen()
  .registerPlugin(AutoRestartPlugin)
  .registerPlugin(new DependencyManager());