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
 * Main module for local_ggbrenderer.
 *
 * This module injects a GeoGebra applet into the DOM.
 *
 * @module     local_ggbrenderer/ggbrenderer
 * @copyright  2022 ISB Bayern
 * @author     Philipp Memmel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as ggbRendererUtils from 'local_ggbrenderer/ggbrendererutils';
import Pending from 'core/pending';
import Log from 'core/log';

let resizeTimeout;

/**
 * Init function for local_ggbrenderer/ggbrenderer module.
 *
 * @param {function} DeployObject the object from deployggb.js used to load the applet from
 * @param {string} appletId a string which should be used to identify the rendered GGB applet to access its JS API afterwards
 */
export const init = (DeployObject, appletId) => {
    const pendingPromise = new Pending('local_ggbrenderer/init');
    const containerId = 'local_ggbrenderer_container_' + appletId;
    const params = JSON.parse(document.getElementById(containerId).dataset.ggbparams);

    const ggbApplet = new DeployObject(params, true);

    ggbRendererUtils.storeApplet(appletId, ggbApplet);

    window.ggbAppletOnLoad = () => {
        // Set the initial size of the scaling containers so GeoGebra applets scale a first time correctly after loading.
        resizeScalingContainer();
        // Unregister old event listeners in case we have multiple GeoGebra questions on one page.
        // We only need one for the whole page.
        window.removeEventListener('resize', resizeScalingContainer);
        window.addEventListener('resize', resizeScalingContainer);
    };
    window.addEventListener('load', () => ggbApplet.inject(containerId));

    pendingPromise.resolve();
};

/**
 * Resizes the scaling container to the maximum amount of available space. The GGB applet will scale into it.
 *
 * This method should be called if the browser window has been resized.
 */
const resizeScalingContainer = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        document.querySelectorAll('.local_ggbrenderer_scalecontainer').forEach(scalingContainer => {
            // We set the scaling container's width to a huge amount to make the parent divs take the maximum width.
            scalingContainer.style.width = '10000px';
            // After that we determine the minimum width of all parent containers of the scaling container.
            scalingContainer.style.width = parentMinWidth(scalingContainer) + 'px';
        });
        return true;
    }, 250);
};

/**
 * Utility function to determine the minimum width of all parent elements of the given container.
 *
 * @param {HTMLElement} container The container of which we want to determine the minimum width of all parent elements
 * @return {number} minimum width of all parent containers of specified container element in px
 */
const parentMinWidth = (container) => {
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
