/**
 * Earth Engine Color and Palette Guide.
 */

// Use ee.Color to represent a color.
// From a CSS color string.
const red = ee.Color('red');

// From a list of RGBA values [0:1].
const green = ee.Color([0, 1, 0]);

// From HSV values.
const blue = ee.Color.fromHsv([0.66, 1, 1]);

// Instance methods.
const brightRed = red.brighter(0.5);
const darkGreen = green.darker(0.5);
const mixed = ee.Color.mix(red, green, 0.5);

// To various formats.
print('Mixed as hex:', mixed.toHexString());
print('Red as HSL:', red.toHsl());


// Use ee.Palette to represent a palette of colors.
// From a list of colors.
const palette = ee.Palette(['red', 'green', 'blue']);

// Get equally spaced colors.
const colors = palette.getColors(5);
print('5 colors from palette:', colors);

// From a named palette.
const spectral = ee.Palette('spectral');

// Customize a palette.
const customPalette = ee.Palette(['red', 'blue']).mode('HSL').limits(0, 100);

// Get color at a value.
const colorAt50 = customPalette.getColor(50);
print('Color at 50:', colorAt50);
