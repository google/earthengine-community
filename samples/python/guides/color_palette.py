"""Introduction to ee.Color and ee.Palette."""

import ee

# 1. Working with ee.Color
# Create a color from a W3C name.
red = ee.Color('red')
print('Red hex:', red.toHexString().getInfo())

# Create a color from RGB values [0, 1].
green = ee.Color([0, 1, 0])
print('Green hex:', green.toHexString().getInfo())

# Create a color from HSV.
blue = ee.Color.fromHsv([0.66, 1, 1])
print('Blue hex:', blue.toHexString().getInfo())

# Manipulate colors.
bright_red = red.brighter(0.5)
dark_green = green.darker(0.5)
mixed = ee.Color.mix(red, green, 0.5)

print('Bright red:', bright_red.toHexString().getInfo())
print('Dark green:', dark_green.toHexString().getInfo())
print('Mixed:', mixed.toHexString().getInfo())


# 2. Working with ee.Palette
# Create a palette from a list of colors.
palette = ee.Palette(['red', 'green', 'blue'])

# Get colors from the palette.
colors = palette.getColors(5)
print('5 colors from palette:', colors.getInfo())

# Use predefined palettes (if available).
spectral = ee.Palette('spectral')
print('Spectral palette:', spectral.getInfo())

# Customize a palette.
custom_palette = ee.Palette(['red', 'blue']) \
    .mode('HSL') \
    .limits(0, 100) \
    .correctLightness(True)

color_at_50 = custom_palette.getColor(50)
print('Color at 50:', color_at_50.toHexString().getInfo())
