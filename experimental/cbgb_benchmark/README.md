<!-- Copyright 2024 The Google Earth Engine Community Authors

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
-->

# The Cloud-Based Geospatial Benchmark (CBGB)

## Overview

We introduce a new benchmark for evaluating the ability of Large Language Models
(LLMs) to generate code for solving geospatial problems, with a focus on Google
Earth Engine. The Cloud-Based Geospatial Benchmark (CBGB) was presented at the
[TerraBytes Workshop](https://terrabytes-workshop.github.io/) at ICML on July
18, 2025, in Vancouver. A link to the corresponding paper is forthcoming.

All Benchmark questions are available under CC-BY-4.0 license in a public
Google Cloud Storage bucket:

-   `gs://cbgb-1/eval_set_2025_05_08.csv`
-   Direct download at:
    https://storage.googleapis.com/cbgb-1/eval_set_2025_05_08.csv

This repository contains a lightweight evaluation pipeline assessing
the capabilities of various LLMs to generate Earth Engine Python code. The
pipeline imports the full set of benchmark challenges and expected answers. It
then utilizes code generation agents powered by different LLMs (models from
Gemini, OpenAI, Anthropic, and Deepseek), to generate Python code to
answer these questions. The framework includes functionality for code execution,
error correction with multiple retries, and detailed result logging.

The 45 benchmark questions in the dataset were curated and validated by a group
of Remote Sensing/GIS practitioners. Primary sources for these questions included
the free publicly available textbook [Cloud-based Remote Sensing with Google
Earth Engine: Fundamentals and Applications](https://www.eefabook.org/), and
original problems conceptualized by subject-matter experts in the contributor
group — all intended to reflect practical, real-world geospatial analysis tasks.


We are excited to release this evaluation pipeline to the community and welcome
feedback and contributions.

## Attribution

The Cloud-Based Geospatial Benchmark (CBGB) is a collaborative effort. The
primary developers of the evaluation pipeline and the associated research paper
are Jeffrey A. Cardille of McGill University and Renee Johnston of Google
Research.

The development of the benchmark questions and the underlying methodology was a
significant undertaking involving contributions from a number of individuals,
including:

*   Simon Ilyushchenko, Subhashini Venugopalan, Zahra Shamsi, Johan Kartiwa,
    Matthew Abraham, Khashayar Azad, Nuala Caughie, Emma Bergeron Quick, Karen
    Dyson, Andrea Puzzi Nicolau, Fernanda Lopez Ornelas, David Saah, Michael
    Brenner, and Sameera Ponda.

The evaluation pipeline leverages the
[functionsmith](https://github.com/google/earthengine-community/tree/master/experimental/functionsmith)
library, developed by Simon Ilyushchenko, for parsing and executing the
LLM-generated code.
