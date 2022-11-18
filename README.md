# local_ggbrenderer

This plugin provides an easy-to-use way to render a GeoGebra applet into a moodle page. It is designed to be used by other plugins and provides ways of rendering for both PHP and JavaScript.

## Rendering
### Render a GGB applet via PHP

This plugin offers a class which you can initialize as follows:
```php
$ggbrenderer = new \local_ggbrenderer\ggbrenderer();
$params = [
            'appName' => 'classic',
            'width' => 800,
            'height' => 600,
            'showToolBar' => true,
            'showAlgebraInput' => true,
            'showMenuBar' => true,
        ];
$ggbrenderer->set_params($params);
```
The `$params` array will be passed to the GGB applet, so you can use all params the GGB applet is supporting. See
[https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters](https://wiki.geogebra.org/en/Reference:GeoGebra_App_Parameters).

After the initialisation you have the choice how you want to render the applet:
1. Retrieve the code for using it inside another renderer, for example adding it to a block:

   `$this->content->text .= $ggbrenderer->render_ggb_applet('unique_applet_id');`

   If you want to access the ggb applet later on from an own JS module for example, just pass a unique id as param to the function. See section "Access the applet after loading" below.
2. Specify a target DOM element where the ggbrenderer should render the plugin:

   `$ggbrenderer->render_ggb_applet_to_target('#div_to_render_applet_to');`

   You can specify a unique id as well as second parameter if you want to access the applet later on. 

### Render a GGB applet via JavaScript

In your own amd module use the following import:

`import * as ggbRendererUtils from 'local_ggbrenderer/ggbrendererutils';`

After that you can define the params you want to pass to the GGB applet as JSON object and render it afterwards as follows:

```javascript
const ggbParams = {
    'appName': 'classic', 
    'width': 800,
    'height': 600,
    'showToolBar': true,
    'showAlgebraInput': true,
    'showMenuBar': true
}
ggbRendererUtils.renderGgbAppletToTarget('#target_selector', 'unique_id_the_applet_should_have', ggbParams);
```

## Inject already existing applets

You usually have three options. Just pass one of the following parameters like the other GGB parameters:

- If you do not want a blank GGB applet to load, but already have a specific GGB applet, you may use the parameter `material_id`. Just set it to the material id of the applet which in this case should be located on [https://www.geogebra.org](https://www.geogebra.org) and thus should have this material id.
- If your applet is not located at [https://www.geogebra.org](https://www.geogebra.org), you can use the parameter `filename` and specify the path of a file.
- By using the parameter `ggbBase64` you can pass the GGB applet base64 encoded. You can use the GGB applet API (see below) to retrieve the base64 code and load it later into a newly created GGB applet.

## Dealing with the size of the applet

Usually, a GGB applet will have a specified width and height. So if you inject it into a container, it will try to take this size. In many cases you do not want this, because on different devices this will make users have to scroll etc. The GGB applet however supports the usage of a scaling container.

As long as you do not specify parameters `width` and `height`, `local_ggbrenderer` will automatically try to scale your applet into the given container. The scaling will be done to fit into the specified target container.

In some cases you do not want this automatic scaling to happen (because you need a minimum width for example), you can specify a fixed width and height (in this case, both need to be specified). The surrounding container still will try to scale in the moodle page to be as large as possible. If the given width and height exceed the container, the applet will overflow and the user will have the option to scroll to see the rest of the applet.

## Access GGB applet API

The GGB applet provides a JS API, see [https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API](https://wiki.geogebra.org/en/Reference:GeoGebra_Apps_API). After you rendered a GGB applet, you can access it like that in your amd module:

```javascript
import * as ggbRendererUtils from 'local_ggbrenderer/ggbrendererutils';

const appletApi = ggbRendererUtils.getAppletApi('unique_applet_id');
// Just an example of using the GGB applet API: Retrieving the value of the object 'A'.
appletApi.getValue('A');
```

In this case 'unique_applet_id' would be the id you specified when rendering the applet.

The applet will take to load some time. So to have a way of knowing when the applet loading has been done, `local_ggbrenderer` will emit a custom event. You can react to it like that:

```javascript
window.addEventListener('ggbAppletLoaded', event => {
   console.log(event.detail.appletId);
   console.log(event.detail.ggbApplet);
});
```

The event's detail object will contain the appletId of the applet which has been loaded (important if you are rendering more than one GGB applet). It will also contain the GGB applet object itself. You can access its API by using `getAppletApi` function of `ggbRendererUtils` or directly by just using `ggbApplet.getAppletObject()`. 
