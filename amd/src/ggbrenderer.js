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
    window.addEventListener('load', () => ggbApplet.inject(containerId));

    pendingPromise.resolve();
};
