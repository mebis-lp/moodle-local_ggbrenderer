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

import Templates from 'core/templates';
import { exception as displayException } from 'core/notification';

export const storeApplet = (appletId, applet) => {
    if (!window.ggbApplets) {
        window.ggbApplets = [];
    }
    window.ggbApplets[appletId] = applet;
};

/**
 * Getter for accessing the GGB JS API of the GGB applet.
 *
 * @param {string} appletId unique id of the container the
 * @return {object} The GGBApplet for accessing applet internal functions
 */
export const getAppletApi = (appletId) => {
    return window.ggbApplets[appletId];
};

export const getAppletApis = () => {
    return window.ggbApplets;
};
