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

    /** @var string Prefix for the scale container class. */
    const GGB_SCALE_CONTAINER_CLASS_PREFIX = 'local_ggbrenderer_scalecontainer_';

    /** @var array Associative array containing the parameters which should be passed to the GGB applet. */
    private array $ggbparams = [];

    // TODO make this configurable and self-hostable.
    /** @var string The URL of the GGB deploy bundle. */
    private string $deployggburl = 'https://www.geogebra.org/apps/deployggb.js';

    /**
     * Rendering function for the GGB applet.
     * @param string $appletid
     * @return string the rendered HTML code
     */
    public function render_ggb_applet(string $appletid = ''): string {
        global $OUTPUT;

        $context = new stdClass();
        $context->deployggburl = $this->deployggburl;
        $context->appletid = !empty($appletid) ?: uniqid();
        $this->prepare_dimensions($appletid);
        $context->ggbparams = json_encode($this->get_ggb_params());

        return $OUTPUT->render_from_template('local_ggbrenderer/ggbcontainer', $context);
    }

    /**
     * Function to render the GGB applet to a target HTML element.
     *
     * @param string $targetselector Selector of the target element the GGB applet should be rendered to
     * @param string $appletid ID the applet should be identified with
     * @return void
     */
    public function render_ggb_applet_to_target(string $targetselector, string $appletid = ''): void {
        global $PAGE;

        $appletid = !empty($appletid) ?: uniqid();
        $this->prepare_dimensions($appletid);
        $PAGE->requires->js_call_amd('local_ggbrenderer/ggbtargetrenderer', 'init',
            [$targetselector, $appletid, $this->deployggburl, json_encode($this->get_ggb_params())]);
    }

    /**
     * Helper function to configure the type of sizing of the applet.
     *
     * @param string $appletid ID of the applet
     * @return void
     */
    private function prepare_dimensions(string $appletid): void {
        if (!isset($this->ggbparams['width']) && !isset($this->ggbparams['height'])) {
            $this->ggbparams['scaleContainerClass'] = self::GGB_SCALE_CONTAINER_CLASS_PREFIX . $appletid;
            $this->ggbparams['autoHeight'] = true;
        }
    }

    /**
     * Setter for the GGB parameters.
     *
     * @param string $key GGB parameter key
     * @param string $value GGB parameter value
     * @return void
     */
    public function set_ggb_param(string $key, string $value): void {
        $this->ggbparams[$key] = $value;
    }

    /**
     * Setter for the whole GGB parameter array.
     *
     * @param array $ggbparams Associative array containing all GGB parameters
     * @return void
     */
    public function set_ggb_params(array $ggbparams) {
        $this->ggbparams = $ggbparams;
    }

    /**
     * Getter for the GGB parameters.
     *
     * @return array the currently set GGB parameters for rendering the applet.
     */
    public function get_ggb_params(): array {
        return $this->ggbparams;
    }

    /**
     * Setter for the deploy GGB url.
     *
     * @param string $deployggburl The url of the deployggb.js which should be used to render as string
     * @return void
     */
    public function set_deployggburl(string $deployggburl) {
        $this->deployggburl = $deployggburl;
    }

    /**
     * Getter for the deploy GGB url.
     *
     * @return string The url of the deployggb.js which should be used to render as string
     */
    public function get_deployggburl(): string {
        return $this->deployggburl;
    }
}
