import Server from './server';
import AutoRestartPlugin from '@sqltools/plugins/auto-restart/language-server';
import DependencyManagerPlugin from '@sqltools/plugins/dependency-manager/language-server';
import FormatterPlugin from '@sqltools/plugins/formatter/language-server';

new Server()
  .listen()
  .registerPlugin(AutoRestartPlugin)
  .registerPlugin(new FormatterPlugin())
  .registerPlugin(new DependencyManagerPlugin());