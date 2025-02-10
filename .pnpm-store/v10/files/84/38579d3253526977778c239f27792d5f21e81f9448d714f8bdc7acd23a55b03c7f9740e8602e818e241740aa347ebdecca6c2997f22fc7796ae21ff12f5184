/**
 * 碰撞检测算法
 */
export function antiCollision(items, labelHeight, plotRange) {
    var labels = items.filter(function (item) { return !item.invisible; });
    // sorted by y, mutable
    labels.sort(function (a, b) { return a.y - b.y; });
    // adjust y position of labels to avoid overlapping
    var overlapping = true;
    var startY = plotRange.minY;
    var endY = plotRange.maxY;
    var totalHeight = Math.abs(startY - endY);
    var i;
    var maxY = 0;
    var minY = Number.MIN_VALUE;
    var boxes = labels.map(function (label) {
        if (label.y > maxY) {
            maxY = label.y;
        }
        if (label.y < minY) {
            minY = label.y;
        }
        return {
            content: label.content,
            size: labelHeight,
            targets: [label.y - startY],
            pos: null,
        };
    });
    minY -= startY;
    if (maxY - startY > totalHeight) {
        totalHeight = maxY - startY;
    }
    while (overlapping) {
        /* eslint no-loop-func: 0 */
        boxes.forEach(function (box) {
            var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
            box.pos = Math.min(Math.max(minY, target - box.size / 2), totalHeight - box.size);
            box.pos = Math.max(0, box.pos);
        });
        // detect overlapping and join boxes
        overlapping = false;
        i = boxes.length;
        while (i--) {
            if (i > 0) {
                var previousBox = boxes[i - 1];
                var box = boxes[i];
                if (previousBox.pos + previousBox.size > box.pos) {
                    // overlapping
                    previousBox.size += box.size;
                    previousBox.targets = previousBox.targets.concat(box.targets);
                    // overflow, shift up
                    if (previousBox.pos + previousBox.size > totalHeight) {
                        previousBox.pos = totalHeight - previousBox.size;
                    }
                    boxes.splice(i, 1); // removing box
                    overlapping = true;
                }
            }
        }
    }
    i = 0;
    // step 4: normalize y and adjust x
    boxes.forEach(function (b) {
        var posInCompositeBox = startY + labelHeight / 2; // middle of the label
        b.targets.forEach(function () {
            labels[i].y = b.pos + posInCompositeBox;
            posInCompositeBox += labelHeight;
            i++;
        });
    });
}
//# sourceMappingURL=util.js.map