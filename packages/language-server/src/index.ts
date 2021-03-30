process.env['PROD' + 'UCT'] = 'ls';
import Server from './server';
import FormatterPlugin from '@sqltools/plugins/formatter/language-server';
import ConnectionManagerPlugin from '@sqltools/plugins/connection-manager/language-server';
import IntellisensePlugin from '@sqltools/plugins/intellisense/language-server';

new Server().listen().registerPlugin([new FormatterPlugin(), new ConnectionManagerPlugin(), new IntellisensePlugin()]);
