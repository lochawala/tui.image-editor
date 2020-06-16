/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Free drawing module, Set brush
 */
import fabric from 'fabric';
import Component from '../interface/component';
import {eventNames, componentNames, fObjectOptions} from '../consts';
// import LineArrow from '../extension/lineArrow';
// fabric.LineArrow = LineArrow;
/**
 * Arrow
 * @class Arrow
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class Arrow extends Component {
    constructor(graphics) {
        super(componentNames.ARROW, graphics);

        /**
         * Brush width
         * @type {number}
         * @private
         */
        this._width = 12;

        /**
         * fabric.Color instance for brush color
         * @type {fabric.Color}
         * @private
         */
        this._oColor = new fabric.Color('rgba(0, 0, 0, 0.5)');

        /**
         * Listeners
         * @type {object.<string, function>}
         * @private
         */
        this._listeners = {
            mousedown: this._onFabricMouseDown.bind(this),
            mousemove: this._onFabricMouseMove.bind(this),
            mouseup: this._onFabricMouseUp.bind(this)
        };
    }

    /**
     * Start drawing line mode
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    start(setting) {
        const canvas = this.getCanvas();

        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;

        this.setBrush(setting);

        canvas.forEachObject(obj => {
            obj.set({
                evented: false
            });
        });

        canvas.on({
            'mouse:down': this._listeners.mousedown
        });
    }

    /**
     * Set brush
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    setBrush(setting) {
        const brush = this.getCanvas().freeDrawingBrush;

        setting = setting || {};
        this._width = setting.width || this._width;

        if (setting.color) {
            this._oColor = new fabric.Color(setting.color);
        }
        brush.width = this._width;
        brush.color = this._oColor.toRgba();
    }

    /**
     * End drawing line mode
     */
    end() {
        const canvas = this.getCanvas();

        canvas.defaultCursor = 'default';
        canvas.selection = true;

        canvas.forEachObject(obj => {
            obj.set({
                evented: true
            });
        });

        canvas.off('mouse:down', this._listeners.mousedown);
    }

    // eslint-disable-next-line complexity
    _FabricCalcArrowAngle(x1, y1, x2, y2) {
        let angle = 0;
        const x = x2 - x1;
        const y = y2 - y1;
        if (x === 0) {
            // eslint-disable-next-line no-nested-ternary
            angle = y === 0 ? 0 : y > 0 ? Math.PI / 2 : (Math.PI * 3) / 2;
        } else if (y === 0) {
            angle = x > 0 ? 0 : Math.PI;
        } else {
            // eslint-disable-next-line no-nested-ternary
            angle = x < 0 ? Math.atan(y / x) + Math.PI : y < 0 ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
        }

        return (angle * 180) / (Math.PI + 90);
    }

    generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === 'function') {
            d += performance.now(); // use high-precision timer if available
        }
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (d + (Math.random() * 16)) % 16 | 0;
            d = Math.floor(d / 16);

            return (c === 'x' ? r : (r & (0x3 | 0x8))).toString(16);
        });

        return uuid;
    }

    /**
     * Mousedown event handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseDown(fEvent) {
        const canvas = this.getCanvas();
        const pointer = canvas.getPointer(fEvent.e);
        const points = [pointer.x, pointer.y, pointer.x, pointer.y];
        this._line = new fabric.Line(points, {
            stroke: this._oColor.toRgba(),
            strokeWidth: this._width,
            uuid: this.generateUUID(),
            type: 'arrow',
            evented: false
        });

        this._line.set(fObjectOptions.SELECTION_STYLE);

        const centerX = (this._line.x1 + this._line.x2) / 2;
        const centerY = (this._line.y1 + this._line.y2) / 2;
        this._deltaX = this._line.left - centerX;
        this._deltaY = this._line.top - centerY;

        this._triangle = new fabric.Triangle({
            stroke: this._oColor.toRgba(),
            strokeWidth: this._width,
            evented: false,
            left: this._line.get('x1') + this._deltaX,
            top: this._line.get('y1') + this._deltaY,
            originX: 'center',
            originY: 'center',
            selectable: false,
            pointType: 'arrow_start',
            angle: -45,
            width: 20,
            height: 20,
            fill: 'red',
            id: 'arrow_triangle',
            uuid: this._line.uuid
        });
        this._activeObj = this._line;
        canvas.add(this._line, this._triangle).setActiveObject(this._line);

        canvas.on({
            'mouse:move': this._listeners.mousemove,
            'mouse:up': this._listeners.mouseup
        });
    }

    /**
     * Mousemove event handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseMove(fEvent) {
        const canvas = this.getCanvas();
        const pointer = canvas.getPointer(fEvent.e);
        // const activeObj = canvas.getActiveObject();
        // activeObj.set({
        //     x2: pointer.x,
        //     y2: pointer.y
        // });
        this._line.set({
            x2: pointer.x,
            y2: pointer.y
        });
        this._triangle.set({
            'left': pointer.x + this._deltaX,
            'top': pointer.y + this._deltaY,
            'angle': this._FabricCalcArrowAngle(this._line.x1, this._line.y1, this._line.x2, this._line.y2)
        });

        // activeObj.setCoords();

        canvas.renderAll();
    }

    /**
     * Mouseup event handler in fabric canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseUp() {
        const canvas = this.getCanvas();
        // const params_line = this.graphics.createObjectProperties(this._line);
        // const params_triangle = this.graphics.createObjectProperties(this._triangle);
        const group = new fabric.Group([this._line, this._triangle], {
            lockScalingFlip: true,
            typeOfGroup: 'arrow',
            userLevel: 1,
            name: 'my_ArrowGroup',
            uuid: this._activeObj.uuid,
            type: 'arrow'
        });
        canvas.remove(this._line, this._triangle);
        const params = this.graphics.createObjectProperties(group);

        this.fire(eventNames.ADD_OBJECT, params);

        this._line = null;
        this._triangle = null;

        canvas.off({
            'mouse:move': this._listeners.mousemove,
            'mouse:up': this._listeners.mouseup
        });
    }
}

export default Arrow;
