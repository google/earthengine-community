/**
 * Introduction to ee.Color and ee.Palette.
 */

// 1. Working with ee.Color
// Create a color from a W3C name.
var red = ee.Color('red');
print('Red hex:', red.toHexString());

// Create a color from RGB values [0, 1].
var green = ee.Color([0, 1, 0]);
print('Green hex:', green.toHexString());

// Create a color from HSV.
var blue = ee.Color.fromHsv([0.66, 1, 1]);
print('Blue hex:', blue.toHexString());

// Manipulate colors.
var brightRed = red.brighter(0.5);
var darkGreen = green.darker(0.5);
var mixed = ee.Color.mix(red, green, 0.5);

print('Bright red:', brightRed.toHexString());
print('Dark green:', darkGreen.toHexString());
print('Mixed:', mixed.toHexString());


// 2. Working with ee.Palette
// Create a palette from a list of colors.
var palette = ee.Palette(['red', 'green', 'blue']);

// Get colors from the palette.
var colors = palette.getColors(5);
print('5 colors from palette:', colors);

// Use predefined palettes (if available).
var spectral = ee.Palette('spectral');
print('Spectral palette:', spectral);

// Customize a palette.
var customPalette = ee.Palette(['red', 'blue'])
    .mode('HSL')
    .limits(0, 100)
    .correctLightness(true);

var colorAt50 = customPalette.getColor(50);
print('Color at 50:', colorAt50.toHexString());
