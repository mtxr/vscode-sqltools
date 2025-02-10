import process from 'process'

import { I18N, type Language } from 'xshell/i18n/index.js'

import _dict from './dict.json' with { type: 'json' }


// LOCAL
// const i18n = new I18N(_dict, 'en')
const i18n = new I18N(
    _dict,
    process?.env?.VSCODE_NLS_CONFIG ?
        JSON.parse(
            process.env.VSCODE_NLS_CONFIG || '{ "locale": "zh" }'
        ).locale.slice(0, 2) as Language
    :
        undefined
)

const { t, r, language } = i18n

export { i18n, t, r, language }
