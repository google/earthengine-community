---
title: Your tutorial title
description: A short description of the tutorial, all on one line with no carriage returns.
author: glemoine62
tags: comma-separated, lowercase, list, of, related, keywords
date_published: YYYY-MM-DD
---
<!--
Copyright 2019 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

This tutorial introduces the basics for Sentinel-1 use in GEE. It will illustrate basic SAR terminology and demonstrate data selection and visualization.
In a next tutorial, we'll introduce more advanced concepts.

## Section heading 1

Break up your tutorial into manageable sections.

With one or more paragraphs, separated by a blank line.

Inside your sections, you can also:

1. Use numbered lists
1. ..when the order..
1. ..of items is important.

And:

- This is a bulleted list.
- Use bulleted lists when items are not strictly ordered.

..and even:

Use     | tables   | to organize | content
------- | -------- | ----------- | -------
Your    | tables   | can         | also
contain | multiple | rows        | ...

## Section heading 2

Use separate sections for related, but discrete, groups of steps.

Use code blocks to show users how to do something after describing it:

```
// Use comments to describe details that can't be easily expressed in code.
// Always try making code more self descriptive before adding a comment.
// Similarly, avoid repeating verbatim what's already said in code
// (e.g., "assign ImageCollection to variable 'coll'").
var coll = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');
```

### Use subsections if appropriate

Consider breaking longer sections that cover multiple topics or span multiple
pages into subsections.
