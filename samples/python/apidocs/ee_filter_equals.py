# Copyright 2023 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START earthengine__apidocs__ee_filter_equals]
# Field site vegetation characteristics from projects in western USA.
fc = ee.FeatureCollection('BLM/AIM/v1/TerrADat/TerrestrialAIM').filter(
    'ProjectName == "Colorado NWDO Kremmling FO 2016"'
)

# Display field plots on the map.
m = geemap.Map()
m.set_center(-107.792, 39.871, 7)
m.add_ee_layer(fc)
m

# Compare the per-feature values of two properties and filter the collection
# based on the results of various relational expressions. The two properties
# to compare are invasive and non-invasive annual forb cover at each plot.
left_property = 'InvAnnForbCover_AH'
right_property = 'NonInvAnnForbCover_AH'

display('Plots where invasive forb cover is…')

display(
    '…EQUAL to non-invasive cover',
    fc.filter(
        ee.Filter.equals(leftField=left_property, rightField=right_property)
    ),
)

display(
    '…NOT EQUAL to non-invasive cover',
    fc.filter(
        ee.Filter.notEquals(leftField=left_property, rightField=right_property)
    ),
)

display(
    '…LESS THAN non-invasive cover',
    fc.filter(
        ee.Filter.lessThan(leftField=left_property, rightField=right_property)
    ),
)

display(
    '…LESS THAN OR EQUAL to non-invasive cover',
    fc.filter(
        ee.Filter.lessThanOrEquals(
            leftField=left_property, rightField=right_property
        )
    ),
)

display(
    '…GREATER THAN non-invasive cover',
    fc.filter(
        ee.Filter.greaterThan(
            leftField=left_property, rightField=right_property
        )
    ),
)

display(
    '…GREATER THAN OR EQUAL to non-invasive cover',
    fc.filter(
        ee.Filter.greaterThanOrEquals(
            leftField=left_property, rightField=right_property
        )
    ),
)

display(
    '…is not greater than 10 percent different than non-invasive cover',
    fc.filter(
        ee.Filter.maxDifference(
            difference=10, leftField=left_property, rightField=right_property
        )
    ),
)

# Instead of comparing values of two feature properties using the leftField
# and rightField parameters, you can compare a property value (left_property)
# against a constant value (rightValue).
display(
    'Plots where invasive forb cover is greater than 20%',
    fc.filter(ee.Filter.greaterThan(leftField=left_property, rightValue=20)),
)

# You can also swap the operands to assign the constant to the left side of
# the relational expression (leftValue) and the feature property on the right
# (rightField). Here, we get the complement of the previous example.
display(
    'Plots where 20% is greater than invasive forb cover.',
    fc.filter(ee.Filter.greaterThan(leftValue=20, rightField=left_property)),
)

# Binary filters are useful in joins. For example, group all same-site plots
# together using a saveAll join.
grouping_prop = 'SiteID'
sites_fc = fc.distinct(grouping_prop)

join_filter = ee.Filter.equals(
    leftField=grouping_prop, rightField=grouping_prop
)

grouped_plots = ee.Join.saveAll('site_plots').apply(sites_fc, fc, join_filter)
display('List of plots in first site', grouped_plots.first().get('site_plots'))
# [END earthengine__apidocs__ee_filter_equals]
