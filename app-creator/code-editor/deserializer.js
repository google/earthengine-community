var mapStyles = require('users/msibrahim/app-creator:map-styles');

exports.createApp = createApp;

function createApp(template) {
  /**
   * The namespace for the application. All the state is kept in here.
   */
  var app = {};

  /**
   * Allow users to further customize the generated widgets by providing a reference to each element created.
   * Type: {[key: WidgetID]: {node: EEWidget, map?: ui.Map}}, for map widgets, we wrap them with a panel widget and return
   * both elements.
   */
  app.widgetInterface = ui.data.ActiveDictionary();

  /**
   * Returns reference to the widget interface.
   */
  app.widgets = function () {
    return app.widgetInterface;
  };

  /**
   * Recursively traverses the widget tree starting at panel-template-0 and creates ee ui widgets accordingly.
   */
  app.deserializeUI = function (widgetTreeJSON) {
    function helper(nodeObj) {
      var obj = app.createUIElement(nodeObj);
      if (!obj) {
        print('Received invalid node object', nodeObj);
        throw new Error('Incorrect widget type.');
      }

      var map = null;
      if (obj instanceof ui.Panel) {
        // If the panel is a map wrapper, we want to extract the map itself.
        var isMapWrapper =
          obj.widgets().length() === 1 &&
          obj.widgets().get(0) instanceof ui.Map;
        map = isMapWrapper ? obj.widgets().get(0) : null;
      }

      var node = map === null ? obj : map;
      app.widgetInterface.set(nodeObj.id, node);

      for (var i = 0; i < nodeObj.children.length; i++) {
        var widget = nodeObj.children[i];
        if (map) {
          map.add(helper(widgetTree[widget]));
        } else {
          obj.widgets().add(helper(widgetTree[widget]));
        }
      }

      return obj;
    }

    try {
      var widgetTree = JSON.parse(widgetTreeJSON);
      return helper(widgetTree['panel-template-0']);
    } catch (e) {
      print(
        'Template JSON is incorrectly formatted. Please check that the JSON is formatted correctly.'
      );
    }
  };

  /**
   * Takes in a node object containing meta data about a node and returns the created ui element.
   */
  app.createUIElement = function (nodeObj) {
    var type = nodeObj.id.slice(0, nodeObj.id.indexOf('-'));
    var filteredStyles = app.filterStyleObject(nodeObj.style);
    switch (type) {
      case 'panel':
        return app.createPanelElement(nodeObj, filteredStyles);
      case 'map':
        return app.createMapElement(nodeObj, filteredStyles);
      case 'label':
        return app.createLabelElement(nodeObj, filteredStyles);
      case 'button':
        return app.createButtonElement(nodeObj, filteredStyles);
      case 'checkbox':
        return app.createCheckboxElement(nodeObj, filteredStyles);
      case 'textbox':
        return app.createTextboxElement(nodeObj, filteredStyles);
      case 'select':
        return app.createSelectElement(nodeObj, filteredStyles);
      case 'slider':
        return app.createSliderElement(nodeObj, filteredStyles);
      case 'chart':
        return app.createChartElement(nodeObj, filteredStyles);
      default:
        return null;
    }
  };

  /**
   * Helper function for creating slider elements.
   */
  app.createSliderElement = function (obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var min = parseFloat(uniqueAttributes.min);
    min = isNaN(min) ? 0 : min;

    var max = parseFloat(uniqueAttributes.max);
    max = isNaN(max) ? 1 : max;

    var step = parseFloat(uniqueAttributes.step);
    step = isNaN(step) ? 0.01 : step;

    var value = parseFloat(uniqueAttributes.value);
    value = isNaN(value) ? 0 : value;

    var slider = ui.Slider({
      min: min,
      max: max,
      value: value,
      step: step,
      direction: uniqueAttributes.direction,
      disabled: uniqueAttributes.disabled === 'true',
      style: style,
    });

    return slider;
  };

  /**
   * Helper function for creating chart elements.
   */
  app.createChartElement = function createChartElement(obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var dataTable = {
      cols: [
        { id: 'task', label: 'Task', type: 'string' },
        { id: 'hours', label: 'Hours per Day', type: 'number' },
      ],
      rows: [
        { c: [{ v: 'Eat' }, { v: 2 }] },
        { c: [{ v: 'Write EE Code' }, { v: 9 }] },
        { c: [{ v: 'Sleep' }, { v: 7, f: '7.000' }] },
      ],
    };

    try {
      dataTable = JSON.parse(uniqueAttributes.dataTable);
    } catch (e) {
      print('Error parsing dataTable for chart element');
    }

    var colors = [''];
    try {
      colors = JSON.parse(uniqueAttributes.color);
      colors = colors.map(function (color) {
        return color.trim();
      });
    } catch (e) {
      print('Error parsing colors for chart element');
    }

    var chart = ui.Chart({
      dataTable: dataTable,
      options: {
        title: uniqueAttributes.title,
        color: colors,
        is3D: uniqueAttributes['3D'],
        height: style.height,
        width: style.width,
      },
      chartType: uniqueAttributes.chartType,
      downloadable: uniqueAttributes.downloadable === 'true',
    });

    return chart;
  };

  /**
   * Helper function for creating select elements.
   */
  app.createSelectElement = function (obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var items = [''];
    try {
      items = JSON.parse(uniqueAttributes.items);
      items = items.map(function (item) {
        return item.trim();
      });
    } catch (e) {
      print('Error parsing items for select element');
    }

    var select = ui.Select({
      items: items,
      placeholder: uniqueAttributes.placeholder,
      value: items.length > 0 ? items[0] : '',
      disabled: uniqueAttributes.disabled === 'true',
    });

    return select;
  };

  /**
   * Helper function for creating textbox elements.
   */
  app.createTextboxElement = function (obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var textbox = ui.Textbox({
      placeholder: uniqueAttributes.placeholder,
      value: uniqueAttributes.value,
      disabled: uniqueAttributes.disabled,
      style: style,
    });

    return textbox;
  };

  /**
   * Helper function for creating checkbox elements.
   */
  app.createCheckboxElement = function (obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var checkbox = ui.Checkbox({
      label: uniqueAttributes.label,
      value: uniqueAttributes.value === 'true',
      disabled: uniqueAttributes.disabled === 'true',
      style: style,
    });

    return checkbox;
  };

  /**
   * Helper function for creating button elements.
   */
  app.createButtonElement = function (obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var button = ui.Button({
      label: uniqueAttributes.label,
      disabled: uniqueAttributes.disabled,
      style: style,
    });

    return button;
  };

  /**
   * Helper function for creating label elements.
   */
  app.createLabelElement = function (obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var label = ui.Label({ value: uniqueAttributes.value, style: style });

    var targetUrl = uniqueAttributes.targetUrl;
    if (targetUrl.trim() !== '') {
      label.setUrl(targetUrl);
    }

    return label;
  };

  /**
   * Helper function for creating panel elements.
   */
  app.createPanelElement = function (obj, style) {
    var uniqueAttributes = obj.uniqueAttributes;

    var layout =
      uniqueAttributes.layout === 'row'
        ? ui.Panel.Layout.Flow('horizontal')
        : ui.Panel.Layout.Flow('vertical');

    return ui.Panel({ style: style, layout: layout });
  };

  /**
   * Helper function for getting the correct position.
   */
  app.getPosition = function (style) {
    if ('bottom' in style && 'left' in style) {
      return 'bottom-left';
    } else if ('bottom' in style && 'right' in style) {
      return 'bottom-right';
    } else if ('top' in style && 'left' in style) {
      return 'top-left';
    } else if ('top' in style && 'right' in style) {
      return 'top-right';
    } else {
      return '';
    }
  };

  /**
   * Helper function for creating map elements.
   */
  app.createMapElement = function (obj, style) {
    // Wrap map widget with panel.
    var mapHeight = style.height;
    var mapWidth = style.width;
    var panelStyle = { height: mapHeight, width: mapWidth };

    // Update map dimensions to take up all the panel space.
    style.width = '100%';
    style.height = '100%';

    var map = ui.Map({ style: style });
    var panel = ui.Panel({ style: panelStyle, widgets: [map] });

    var uniqueAttributes = obj.uniqueAttributes;

    // Center properties.
    var zoom = parseInt(uniqueAttributes.zoom, 10);
    zoom = isNaN(zoom) ? 0 : zoom;
    var lat = parseFloat(uniqueAttributes.latitude);
    lat = isNaN(lat) ? 0 : lat;
    var lng = parseFloat(uniqueAttributes.longitude);
    lng = isNaN(lng) ? 0 : lng;
    map.setCenter(lng, lat, zoom);

    // Control visibility properties.
    var zoomControl = uniqueAttributes.zoomControl === 'true';
    var fullscreenControl = uniqueAttributes.fullscreenControl === 'true';
    var mapTypeControl = uniqueAttributes.mapTypeControl === 'true';
    map.setControlVisibility({
      drawingToolsControl: true,
      zoomControl: zoomControl,
      fullscreenControl: fullscreenControl,
      mapTypeControl: mapTypeControl,
    });

    // Map styling.
    var defaultMapStyles = uniqueAttributes.mapStyles;
    var customMapStyles = uniqueAttributes.customMapStyles;
    var customMapSylesJSON = null;
    if (customMapStyles !== '') {
      try {
        customMapStylesJSON = JSON.parse(customMapStyles);
      } catch (e) {
        print(e);
      }
    }

    var appliedStyles =
      customMapStyles === '' || customMapStylesJSON === null
        ? mapStyles[defaultMapStyles]
        : customMapStylesJSON;
    map.setOptions({ styles: { custom: appliedStyles } });

    return panel;
  };

  /**
   * Since Sets are not supported here, we are using an object for constant time access. The boolean values are meaningless.
   */
  var unsupportedKeys = {
    borderWidth: true,
    borderStyle: true,
    borderColor: true,
    boxSizing: true,
    'box-sizing': true,
    backgroundOpacity: true,
    zIndex: true,
    top: true,
    left: true,
    right: true,
    bottom: true,
  };

  /**
   * Takes in a style object and returns all the unsupported keys.
   */
  app.filterStyleObject = function (obj) {
    var clone = {};

    // Combine border properties.
    var borderWidth = obj.borderWidth;
    var borderStyle = obj.borderStyle;
    var borderColor = obj.borderColor;
    var border = borderWidth + ' ' + borderStyle + ' ' + borderColor;
    clone.border = border;

    if ('position' in obj && obj.position === 'absolute') {
      clone.position = app.getPosition(obj);
    } else {
      unsupportedKeys.position = true;
    }

    for (var key in obj) {
      if (!(key in unsupportedKeys)) {
        clone[key] = obj[key];
      }
    }

    return clone;
  };

  /**
   * Create in-memory widget tree.
   */
  app.init = function (template) {
    app.root = app.deserializeUI(template);
  };

  /**
   * Draw UI to the screen by adding the root to ui.Root.
   */
  app.draw = function () {
    ui.root.widgets().reset([app.root]);
  };

  app.init(template);

  return app;
}
