"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryFactory = (pieces, ...placeholders) => {
    function queryConstructor(params = {}) {
        return pieces
            .reduce((q, piece, index) => {
            const ph = placeholders[index];
            q += piece.replace(/\r?\n\s+/g, ' ');
            if (typeof ph !== 'undefined') {
                q += (typeof ph !== 'function' ? ph : ph(params));
            }
            return q;
        }, '')
            .trim();
    }
    queryConstructor.raw = pieces
        .reduce((q, piece, index) => {
        const ph = placeholders[index];
        q += piece.replace(/\r?\n\s+/g, ' ');
        if (typeof ph !== 'undefined') {
            q += '${' + ph.toString() + '}';
        }
        return q;
    }, '')
        .trim();
    return queryConstructor;
};
exports.default = queryFactory;
