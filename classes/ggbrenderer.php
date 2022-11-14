<?php
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
 * Utility class for local_ggbrenderer.
 *
 * This class provides functions to render a GeoGebra applet into a moodle page.
 *
 * @package    local_ggbrenderer
 * @copyright  2022 ISB Bayern
 * @author     Philipp Memmel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace local_ggbrenderer;

use stdClass;

/**
 * Utility class for local_ggbrenderer.
 *
 * This class provides functions to render a GeoGebra applet into a moodle page.
 *
 * @package    local_ggbrenderer
 * @copyright  2022 ISB Bayern
 * @author     Philipp Memmel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class ggbrenderer {

    private array $ggbparams = [];

    // TODO make this configurable and self-hostable.
    private string $deployggburl = 'https://www.geogebra.org/apps/deployggb.js';

    public function render_ggb_applet(string $appletid = '') {
        global $OUTPUT;

        $context = new stdClass();
        $context->deployggburl = $this->deployggburl;
        $context->ggbparams = json_encode($this->get_ggb_params());
        $context->appletid = !empty($appletid) ?: uniqid();
        return $OUTPUT->render_from_template('local_ggbrenderer/ggbcontainer', $context);
    }

    public function set_ggb_param(string $key, string $value): void {
        $this->ggbparams[$key] = $value;
    }

    public function set_ggb_params(array $ggbparams) {
        $this->ggbparams = $ggbparams;
    }

    public function get_ggb_params(): array {
        return $this->ggbparams;
    }

    public function set_deployggburl(string $deployggburl) {
        $this->deployggburl = $deployggburl;
    }

    public function get_deployggburl(): string {
        return $this->deployggburl;
    }

    public function render_ggb_applet_to_target(string $targetselector, string $appletid = ''): void {
        global $PAGE;

        $appletid = !empty($appletid) ?: uniqid();
        $PAGE->requires->js_call_amd('local_ggbrenderer/ggbtargetrenderer', 'init',
            [$targetselector, $appletid, $this->deployggburl, json_encode($this->get_ggb_params())]);
    }

}
