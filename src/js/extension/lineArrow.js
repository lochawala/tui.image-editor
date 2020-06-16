/**
 * @author Pratik Lochawala <lochawalapratik5@gmail.com>
 * @fileoverview Arrow extending fabric.Line
 */
import fabric from 'fabric';

/**
 * LineArrow object
 * @class LineArrow
 * @extends {fabric.Line}
 * @ignore
 */
const LineArrow = fabric.util.createClass(fabric.Line, /** @lends Convolute.prototype */{
    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'lineArrow',

    /**
     * constructor
     * @override
     */
    initialize(element, options) {
        if (!options) {
            options = {};
        }
        this.callSuper('initialize', element, options);
    },

    toObject() {
        return fabric.util.object.extend(this.callSuper('toObject'));
    },
    _render(ctx) {
        this.callSuper('_render', ctx);
        // do not render if width/height are zeros or object is not visible
        // eslint-disable-next-line curly
        if (this.width === 0 || this.height === 0 || !this.visible) return;

        ctx.save();

        const xDiff = this.x2 - this.x1;
        const yDiff = this.y2 - this.y1;
        const angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
        ctx.rotate(angle);
        ctx.beginPath();

        // move 10px in front of line to start the arrow so it does not have the square line end showing in front (0,0)

        ctx.moveTo(10, 0);
        ctx.lineTo(-20, 15);
        ctx.lineTo(-20, -15);
        ctx.closePath();
        ctx.fillStyle = this.stroke;
        ctx.fill();

        ctx.restore();
    }
});

export default LineArrow;
