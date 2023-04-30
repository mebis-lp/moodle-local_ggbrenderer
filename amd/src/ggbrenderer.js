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

let resizeTimeout;

/**
 * Init function for local_ggbrenderer/ggbrenderer module.
 *
 * @param {function} DeployObject the object from deployggb.js used to load the applet from
 * @param {string} appletId a string which should be used to identify the rendered GGB applet to access its JS API afterwards
 */
export const init = (DeployObject, appletId) => {
    const pendingPromise = new Pending('local_ggbrenderer/init' + appletId);
    const containerId = 'local_ggbrenderer_container_' + appletId;
    const scalingContainer = document.querySelector('.local_ggbrenderer_scalecontainer_' + appletId);
    const params = JSON.parse(document.getElementById(containerId).dataset.ggbparams);

    if (params.hasOwnProperty('width') && params.hasOwnProperty('heigth')) {
        scalingContainer.style.overflowX = 'auto';
        scalingContainer.style.overflowY = 'auto';
    }
    // We pass our appletId as 'id' attribute to the ggbApplet itself, so we know which applet has been loaded when
    // the ggbApplet calls the window.ggbAppletOnLoad callback.
    params.id = appletId;

    const ggbApplet = new DeployObject(params, true);

    ggbRendererUtils.storeApplet(appletId, ggbApplet);
    // The scaling container starts with a width of 100%. After that we have to set the width to a fixed pixel value for the
    // scaling container feature of the GGB applet to work properly.
    scalingContainer.style.width = scalingContainer.getBoundingClientRect().width + 'px';

    // This is being called by a GGB applet as soon as it has been loaded. It passes the parameter 'id' if it has been
    // set when initialized. In our case we passed the applet id, so we now know which applet has been loaded.
    window.ggbAppletOnLoad = (id) => {

        // For some reason the GGB applet adds numbers to our id, so we have to check all our registered applets if one
        // of their ids matches the id being passed in by the ggb applet calling this function.
        const matchingAppletIds = [...ggbRendererUtils.getApplets().keys()].filter(storedId => id.includes(storedId));
        if (matchingAppletIds.length > 0) {
            // If everything went correct, exactly one matching applet id should be found.
            const appletLoadedEvent = new CustomEvent('ggbAppletLoaded',
                {
                    detail: {
                        'appletId': matchingAppletIds[0],
                        'ggbApplet': ggbApplet
                    }
                });
            // We emit a custom event to alert users of this plugin that the ggb applet has finished loading.
            window.dispatchEvent(appletLoadedEvent);
        }
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
            // We determine the minimum width of all parent containers of the scaling container and use this as width for
            // the scaling container. This should be a good idea for both very small and very wide applets.
            scalingContainer.style.width = ggbRendererUtils.getParentsMinWidth(scalingContainer) + 'px';
        });
        return true;
    }, 250);
};
