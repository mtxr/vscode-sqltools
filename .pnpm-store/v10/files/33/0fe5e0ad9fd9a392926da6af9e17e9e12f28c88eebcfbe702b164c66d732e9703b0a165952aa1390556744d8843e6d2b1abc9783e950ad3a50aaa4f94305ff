var through = require('through2');

function defaultComparator(a, b) {
    return a.path.localeCompare(b.path);
}

module.exports = function gulpSort(params) {
    var asc = true;
    var comparator;
    var files = [];
    var customSortFn;

    if (typeof params === 'function') {
        // params is the sort comparator
        comparator = params;
        params = {};
    } else {
        params = params || {};
        asc = typeof params.asc !== 'undefined' ? params.asc : asc;
        comparator = params.comparator || defaultComparator;
        customSortFn = params.customSortFn;
    }

    return through.obj(function (file, enc, cb) {
        files.push(file);
        cb();
    }, function (cb) {
        if (customSortFn) {
            // expect customSortFn to return the files array
            files = customSortFn(files, comparator);
        } else {
            // sort in-place
            files.sort(comparator);
        }
        if (!asc) {
            files.reverse();
        }
        files.forEach(function (file) {
            this.push(file);
        }, this);
        cb();
    });
};
