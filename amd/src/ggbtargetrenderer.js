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
 * Module of local_ggbrenderer for rendering a GGB applet into a target DOM element.
 *
 * @module     local_ggbrenderer/ggbtargetrenderer
 * @copyright  2022 ISB Bayern
 * @author     Philipp Memmel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from 'core/templates';
import {exception as displayException} from 'core/notification';
import Pending from 'core/pending';
import Log from 'core/log';

/**
 * Init function of local_ggbrenderer/ggbtargetrenderer.
 *
 * This function renders a GGB applet with given parameters in the HTML element with the given selector.
 *
 * @param {string} targetSelector selector of the target HTML element to render the GGB applet to
 * @param {string} appletId a string which should be used to identify the rendered GGB applet to access its JS API afterwards
 * @param {string} deployGgbUrl the URL with the deployggb.js file to load the applet from
 * @param {string} ggbParams json encoded string of params which should be passed to the applet
 */
export const init = (targetSelector, appletId, deployGgbUrl, ggbParams) => {
    const pendingPromise = new Pending('local_ggbrenderer/init' + appletId);

    if (!targetSelector) {
        Log.error('No target selector specified. GGB applet will not be rendered.');
    }

    const renderContext = {
        'appletid': appletId,
        'deployggburl': deployGgbUrl,
        'ggbparams': ggbParams
    };
    Templates.renderForPromise('local_ggbrenderer/ggbcontainer', renderContext)
        .then(({html, js}) => {
            Templates.appendNodeContents(targetSelector, html, js);
            pendingPromise.resolve();
            return true;
        })
        .catch((error) => displayException(error));
};
