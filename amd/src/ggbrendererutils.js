// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Utils collection for local_ggbrenderer.
 *
 * This module manipulates the DOM to style beta features.
 *
 * @module     local_ggbrenderer/ggbrendererutils
 * @copyright  2022 ISB Bayern
 * @author     Philipp Memmel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as ggbTargetRenderer from 'local_ggbrenderer/ggbtargetrenderer';

/**
 * Utility function to render a GGB applet.
 *
 * This function renders a GGB applet with given parameters in the HTML element with the given selector.
 *
 * @param {string} targetSelector selector of the target HTML element to render the GGB applet to
 * @param {string} appletId a string which should be used to identify the rendered GGB applet to access its JS API afterwards
 * @param {string|object} ggbParams json object or json encoded string of params which should be passed to the applet
 */
export const renderGgbAppletToTarget = (targetSelector, appletId, ggbParams) => {
    if (typeof ggbParams === 'object') {
        ggbParams = JSON.stringify(ggbParams);
    }
    // TODO Do not hardcode url, but retrieve it from plugin's configuration.
    const deployGgbUrl = 'https://www.geogebra.org/apps/deployggb.js';
    ggbTargetRenderer.init(targetSelector, appletId, deployGgbUrl, ggbParams);
};

export const storeApplet = (appletId, ggbApplet) => {
    if (!window.ggbApplets) {
        window.ggbApplets = [];
    }
    window.ggbApplets[appletId] = ggbApplet;
};

/**
 * Getter for accessing the GGB applet.
 *
 * @param {string} appletId unique id of the applet
 * @return {object} The GGBApplet for accessing applet internal functions
 */
export const getApplet = (appletId) => {
    return window.ggbApplets[appletId];
};

/**
 * Getter for accessing the GGB applet's API.
 *
 * @param {string} appletId unique id of the applet
 * @return {object|null} The GGB API object of the applet with the specified appletId
 */
export const getAppletApi = (appletId) => {
    const applet = getApplet(appletId);
    if (!applet) {
        return null;
    }
    return applet.getAppletObject();
};

/**
 * Getter for the object containing all GGB applets of a page.
 *
 * @return {[]}
 */
export const getApplets = () => {
    return window.ggbApplets;
};

/**
 * Utility function to determine the minimum width of all parent elements of the given container.
 *
 * @param {HTMLElement} container The container of which we want to determine the minimum width of all parent elements
 * @return {number} minimum width of all parent containers of specified container element in px
 */
export const getParentsMinWidth = (container) => {
    let min = Number.MAX_VALUE;
    let parent = container.parentElement;
    while (parent.tagName !== 'BODY') {
        if (parent.clientWidth < min) {
            min = parent.clientWidth;
        }
        parent = parent.parentElement;
    }
    return min;
};
