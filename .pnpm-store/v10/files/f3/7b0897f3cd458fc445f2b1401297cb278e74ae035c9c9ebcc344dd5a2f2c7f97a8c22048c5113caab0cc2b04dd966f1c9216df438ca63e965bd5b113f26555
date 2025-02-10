/// <reference path="declarations.d.ts" />
import * as minify from 'minify-html-literals';
import { Plugin, TransformHook } from 'rollup';
/**
 * Plugin options.
 */
export interface Options {
    /**
     * Pattern or array of patterns of files to minify.
     */
    include?: string | string[];
    /**
     * Pattern or array of patterns of files not to minify.
     */
    exclude?: string | string[];
    /**
     * Minify options, see
     * https://www.npmjs.com/package/minify-html-literals#options.
     */
    options?: Partial<minify.Options>;
    /**
     * If true, any errors while parsing or minifying will abort the bundle
     * process. Defaults to false, which will only show a warning.
     */
    failOnError?: boolean;
    /**
     * Override minify-html-literals function.
     */
    minifyHTMLLiterals?: typeof minify.minifyHTMLLiterals;
    /**
     * Override include/exclude filter.
     */
    filter?: (id: string) => boolean;
}
export default function (options?: Options): Plugin & {
    transform: TransformHook;
};
