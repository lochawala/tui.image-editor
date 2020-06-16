/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview ArrowDrawingMode class
 */
import DrawingMode from '../interface/drawingMode';
import {drawingModes, componentNames as components} from '../consts';

/**
 * ArrowDrawingMode class
 * @class
 * @ignore
 */
class ArrowDrawingMode extends DrawingMode {
    constructor() {
        super(drawingModes.ARROW_DRAWING);
    }

    /**
    * start this drawing mode
    * @param {Graphics} graphics - Graphics instance
    * @param {{width: ?number, color: ?string}} [options] - Brush width & color
    * @override
    */
    start(graphics, options) {
        const arrowDrawing = graphics.getComponent(components.ARROW);
        arrowDrawing.start(options);
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        const arrowDrawing = graphics.getComponent(components.ARROW);
        arrowDrawing.end();
    }
}

export default ArrowDrawingMode;
