/**
 * Copyright 2021 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START earthengine__apidocs__ui_panel_style]
// Define a UI widget and add it to the map.
var widget = ui.Panel({style: {width: '400px', height: '200px'}});
Map.add(widget);

// View the UI widget's style properties; an ActiveDictionary.
print(widget.style());

// ActiveDictionaries are mutable; set a style property.
widget.style().set('backgroundColor', 'lightgray');
print(widget.style());

// Define the UI widget's style ActiveDictionary as a variable.
var widgetStyle = widget.style();
print(widgetStyle);

// Set the UI widget's style properties from the ActiveDictionary variable.
widgetStyle.set({border: '5px solid darkgray'});
print(widgetStyle);
// [END earthengine__apidocs__ui_panel_style]
