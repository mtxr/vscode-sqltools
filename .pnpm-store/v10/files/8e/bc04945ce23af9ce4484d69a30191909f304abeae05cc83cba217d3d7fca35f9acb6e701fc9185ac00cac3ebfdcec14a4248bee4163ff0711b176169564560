import parsePathString from './parse-path-string';
var REGEX_MD = /[a-z]/;
function toSymmetry(p, c) {
    return [
        c[0] + (c[0] - p[0]),
        c[1] + (c[1] - p[1]),
    ];
}
export default function pathToAbsolute(pathString) {
    var pathArray = parsePathString(pathString);
    if (!pathArray || !pathArray.length) {
        return [
            ['M', 0, 0],
        ];
    }
    var needProcess = false; // 如果存在小写的命令或者 V,H,T,S 则需要处理
    for (var i = 0; i < pathArray.length; i++) {
        var cmd = pathArray[i][0];
        // 如果存在相对位置的命令，则中断返回
        if (REGEX_MD.test(cmd) || ['V', 'H', 'T', 'S'].indexOf(cmd) >= 0) {
            needProcess = true;
            break;
        }
    }
    // 如果不存在相对命令，则直接返回
    // 如果在业务上都写绝对路径，这种方式最快，仅做了一次检测
    if (!needProcess) {
        return pathArray;
    }
    var res = [];
    var x = 0;
    var y = 0;
    var mx = 0;
    var my = 0;
    var start = 0;
    var pa0;
    var dots;
    var first = pathArray[0];
    if (first[0] === 'M' || first[0] === 'm') {
        x = +first[1];
        y = +first[2];
        mx = x;
        my = y;
        start++;
        res[0] = ['M', x, y];
    }
    for (var i = start, ii = pathArray.length; i < ii; i++) {
        var pa = pathArray[i];
        var preParams = res[i - 1]; // 取前一个已经处理后的节点，否则会出现问题
        var r = [];
        var cmd = pa[0];
        var upCmd = cmd.toUpperCase();
        if (cmd !== upCmd) {
            r[0] = upCmd;
            switch (upCmd) {
                case 'A':
                    r[1] = pa[1];
                    r[2] = pa[2];
                    r[3] = pa[3];
                    r[4] = pa[4];
                    r[5] = pa[5];
                    r[6] = +pa[6] + x;
                    r[7] = +pa[7] + y;
                    break;
                case 'V':
                    r[1] = +pa[1] + y;
                    break;
                case 'H':
                    r[1] = +pa[1] + x;
                    break;
                case 'M':
                    mx = +pa[1] + x;
                    my = +pa[2] + y;
                    r[1] = mx;
                    r[2] = my;
                    break; // for lint
                default:
                    for (var j = 1, jj = pa.length; j < jj; j++) {
                        r[j] = +pa[j] + ((j % 2) ? x : y);
                    }
            }
        }
        else { // 如果本来已经大写，则不处理
            r = pathArray[i];
        }
        // 需要在外面统一做，同时处理 V,H,S,T 等特殊指令
        switch (upCmd) {
            case 'Z':
                x = +mx;
                y = +my;
                break;
            case 'H':
                x = r[1];
                r = ['L', x, y];
                break;
            case 'V':
                y = r[1];
                r = ['L', x, y];
                break;
            case 'T':
                x = r[1];
                y = r[2];
                // 以 x, y 为中心的，上一个控制点的对称点
                // 需要假设上一个节点的命令为 Q
                var symetricT = toSymmetry([preParams[1], preParams[2]], [preParams[3], preParams[4]]);
                r = ['Q', symetricT[0], symetricT[1], x, y];
                break;
            case 'S':
                x = r[r.length - 2];
                y = r[r.length - 1];
                // 以 x,y 为中心，取上一个控制点，
                // 需要假设上一个线段为 C 或者 S
                var length_1 = preParams.length;
                var symetricS = toSymmetry([preParams[length_1 - 4], preParams[length_1 - 3]], [preParams[length_1 - 2], preParams[length_1 - 1]]);
                r = ['C', symetricS[0], symetricS[1], r[1], r[2], x, y];
                break;
            case 'M':
                mx = r[r.length - 2];
                my = r[r.length - 1];
                break; // for lint
            default:
                x = r[r.length - 2];
                y = r[r.length - 1];
        }
        res.push(r);
    }
    return res;
}
//# sourceMappingURL=path-2-absolute.js.map