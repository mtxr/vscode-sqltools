"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="declarations.d.ts" />
const minify = require("minify-html-literals");
const rollup_pluginutils_1 = require("rollup-pluginutils");
function default_1(options = {}) {
    if (!options.minifyHTMLLiterals) {
        options.minifyHTMLLiterals = minify.minifyHTMLLiterals;
    }
    if (!options.filter) {
        options.filter = rollup_pluginutils_1.createFilter(options.include, options.exclude);
    }
    const minifyOptions = options.options || {};
    return {
        name: 'minify-html-literals',
        transform(code, id) {
            if (options.filter(id)) {
                try {
                    return options.minifyHTMLLiterals(code, {
                        ...minifyOptions,
                        fileName: id
                    });
                }
                catch (error) {
                    if (options.failOnError) {
                        this.error(error.message);
                    }
                    else {
                        this.warn(error.message);
                    }
                }
            }
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map