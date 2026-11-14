<!--
Copyright 2024 The Google Earth Engine Community Authors

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

# Functionsmith

## Overview

Functionsmith is a general-purpose problem-solving agent using dynamic
function calling.

USING THIS AGENT IS UNSAFE. It directly runs LLM-produced code, and thus
should only be used for demonstration purposes.

See [a sample session output](sample_session.txt).

## Notebook usage

Open the [demo notebook](functionsmith.ipynb).

## Command-line usage

Install with:
```
pip install functionsmith
```

To run with the default task investigating a CSV file with airport data:
```
export GOOGLE_API_KEY=my-api-key
wget https://raw.githubusercontent.com/davidmegginson/ourairports-data/refs/heads/main/airports.csv
functionsmith_cli
```

## Implementation

This agent uses dynamic function calling, which means that instead of
relying on a fixed set of tools predefined in the agent
[in normal LLM function calling](https://ai.google.dev/gemini-api/docs/function-calling),
we let the agent itself write with all the functions it needs.

The functionsmith system prompt asks the agent to first write any low-level
function it needs, as well as tests for them. The agent loop will try
to run these functions and ask the LLM to make corrections if necessary.
Once all the functions are ready, the agent will write and run the code
to solve the actual user task.

The agent does not use function calling features of LLM clients. Instead,
it simply tries to parse all the ```python or ```tool_use sections
present in the raw LLM output. It keeps all function definitions as well
as their source code in memory. Each call to the LLM is preceded
by the function definitions to let the LLM know what functions are available
locally.

The functions are not saved permanently, though this feature can be added.

TODO(simonf): add an Earth Engine-specific notebook agent.

## Attribution

Functionsmith was written by Simon Ilyushchenko (simonf@google.com).
I am grateful to Renee Johnston and other Googlers for implementation advice,
as well as to Earth Engine expert advisors Jeffrey Cardille, Erin Trochim,
Morgan Crowley, and Samapriya Roy, who helped me choose the right training
tasks.
