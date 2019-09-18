---
title: Your tutorial title
description: A short description of the tutorial, all on one line with no carriage returns.
author: your-github-username
tags: comma-separated, lowercase, list, of, related, keywords
date_published: YYYY-MM-DD
---

[Open In Code Editor](https://code.earthengine.google.com/7097a7dace39dbaa5025575dae46612f)

In a few sentences, describe what the user is going to learn. Be sure to include
_concise_ background information; only include what's helpful and relevant.
When in doubt, leave it out!

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
