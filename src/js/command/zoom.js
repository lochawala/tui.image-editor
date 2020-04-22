/**
 * @author Sabinaya KC <kc.sabinaya@gmail.com>
 * @fileoverview Zoom an image
 */
import commandFactory from '../factory/command';
import consts from '../consts';

const {componentNames, commandNames} = consts;
const {ZOOM} = componentNames;

const command = {
    name: commandNames.ZOOM_IMAGE,

    /**
     * Zoom an image
     * @param {Graphics} graphics - Graphics instance
     * @param {string} type - 'zoom' or 'setZoomValue'
     * @param {number} scale - zoom scale
     * @param {boolean} reset - zoom reset
     * @param {Array} transform - Zoom Transform Value
     * @returns {Promise}
     */
    execute(graphics, type, scale, reset, transform) {
        const zoomComp = graphics.getComponent(ZOOM);

        this.undoData.zoom = zoomComp.getCurrentValue();

        return zoomComp[type](scale, reset, transform);
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        const zoomComp = graphics.getComponent(ZOOM);

        return zoomComp.setZoomValue(this.undoData.zoom);
    }
};

commandFactory.register(command);

module.exports = command;
