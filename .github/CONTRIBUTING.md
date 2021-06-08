<!--
Copyright 2020 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Contributing

Thanks for your interest in contributing to the Earth Engine Community
repository!

Please follow the guidance provided below to ensure a smooth process for all.

## Issues

Before you begin work on your contribution, open an issue to alert us of your
intention to make a change and allow us to give early feedback.

We accept several [contribution types](#contribution-types); relevant issue
templates include:

- [New tutorial proposals](https://github.com/google/earthengine-community/issues/new?assignees=gino-m%2C+tylere&labels=tutorial+proposal&template=propose-a-tutorial.md&title=%5BTutorial+proposal%5D+Your+tutorial+title+here)
- [New dataset scripts](https://github.com/google/earthengine-community/issues/new/?assignees=simonff%2C+schwehr&labels=dataset&title=%5BDataset+new%5D+Your+dataset+issue+title+here)
- [Tutorial edits](https://github.com/google/earthengine-community/issues/new/?assignees=jdbcode&labels=tutorial%2C+edit+existing&title=%5BTutorial+edit%5D+Your+tutorial+issue+title+here)
- [Dataset script edits](https://github.com/google/earthengine-community/issues/new/?assignees=simonff%2C+schwehr&labels=dataset%2C+edit+existing&title=%5BDataset+edit%5D+Your+dataset+issue+title+here)

Provide enough information in the issue description for us to understand what
you intend to add or change. If you've had correspondence with an Earth
Engine team member regarding the issue, please mention them in the issue
description using their GitHub handle.

## Contribution types

We welcome new content as well as edits to existing content. See the following
content type sections for any special instructions. 

### Tutorials

We accept Earth Engine tutorials as Markdown and Colab notebooks. These
tutorials are published under the [Community Tutorials](https://developers.google.com/earth-engine/tutorials/community/explore)
section of the Earth Engine Developer's Guide. Please see our instructions on
[writing tutorials](https://developers.google.com/earth-engine/tutorials/community/write). 

Explore [tutorial directories and files](https://github.com/google/earthengine-community/tree/master/tutorials).

### Datasets

We accept scripts from partners collaborating with the Earth Engine Data team,
including sample usage code and code for preparing data for ingestion and
distribution.

Explore [dataset directories and files](https://github.com/google/earthengine-community/tree/master/datasets).

## Contributor License Agreement

The first time you contribute to the Earth Engine Community repository, you'll be
prompted to accept the Contributor License Agreement (CLA) that defines
the terms under which intellectual property is contributed.
[Learn more about the Google Corporate CLA](https://cla.developers.google.com/about).

## License headers

All files must include an Apache License, Version 2.0 header with the copyright
given as `The Google Earth Engine Community Authors`. The following sections
specify how the license should be formatted according to file type.

### Markdown

```
<!--
Copyright 2021 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
```

### Python

```
# Copyright 2021 The Google Earth Engine Community Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

### Colab notebook

Include the following block as a code cell.

```
#@title Copyright 2021 The Earth Engine Community Authors { display-mode: "form" }
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

## Pull Request process

1. Fork the Earth Engine Community repository
2. Sync your fork to the main repo (if you already have a fork)
3. Make a branch for your changes
4. Add or edit files
5. Ensure new files include the proper [license header](#license-headers)
6. Open a Pull Request (PR)
7. Describe the PR using the provided PR template questions
8. Submit the PR for review
9. Make changes suggested by reviewer(s)
10. The PR will be merged within one week of approval

## Code of conduct

The Earth Engine team is committed to fostering a welcoming community. Please
familiarize yourself with our [Code of Conduct](https://opensource.google/docs/releasing/template/CODE_OF_CONDUCT/)
before participating.
