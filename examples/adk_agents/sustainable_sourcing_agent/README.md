# Earth Engine geospatial agent for sustainable sourcing

## Overview

This directory contains a [Google Earth Engine](https://earthengine.google.com/)
enabled ADK agent implemented as a simple chatbot.

The agent has a set of tools intended to support supply chain sustainability 
assessments. It will write an EUDR due diligence report for a polygon provided
as GeoJSON through the chat interface. An example interaction is shown below.

## Setup and Installation

1.  **Prerequisites**

    *   A Google Cloud project with the Earth Engine API and Vertex AI API
        enabled
    *   [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
    *   A python environment with `earthengine-api` and `google-adk` installed.

2.  **Installation example**

    *   Copy the files `.env`, `agent.py`, `tools.py`, `datasets.py`,
    `prompts.py`, and `__init__.py` to a local directory called `suso_agent`
    and navigate to its parent directory.

    *   Setup a virtual environment:
    
    ```bash
    pip3 install -U virtualenv
    python3 -m venv adk-env
    source adk-env/bin/activate
    ```
    *   Install necessary libraries:

    ```bash
    pip3 install -U earthengine-api
    pip3 install -U google-adk
    ```

3.  **Configuration**

    *   Modify `.env` to use your project ID and region.
    *   Modify `tools.retrieve_rag_documentation` to use your project, region
        and RAG ID. See
        [this example](https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/rag-engine/intro_rag_engine.ipynb)
        for help setting up a RAG corpus.

4.  **Authentication**

    ```bash
    gcloud auth application-default login
    earthengine authenticate
    ```

## Running the Agent

ADK provides convenient ways to bring up agents locally and interact with them.
You may talk to the agent using the CLI:

```bash
adk run suso_agent
```

Or on a web interface:

```bash
adk web
```

Select `suso_agent` from the dropdown.

## Example Interaction

Interact with the agent through a chat interface. The agent can answer basic
questions about land cover change in small to medium sized polygons (up to 
several thousand hectares) represented as GeoJSON strings. For example, here's
a small polygon in Ghana:

```
{"type":"Polygon","coordinates":[[[-1.6128345679321519,6.159142280020379],[-1.6120764753176255,6.1588702660833965],[-1.611773316032846,6.158839063712146],[-1.611180255274587,6.15948560147309],[-1.611224821534345,6.160011810825125],[-1.6117376329555693,6.16030163480331],[-1.6121746416378482,6.160145581414311],[-1.6128122839650867,6.159342868368882],[-1.6128345679321519,6.159142280020379]]]}
```

Copy the GeoJSON to a chat:

User:

> Please tell me about
> {"type":"Polygon","coordinates":[[[-1.6128345679321519,6.159142280020379],[-1.6120764753176255,6.1588702660833965],[-1.611773316032846,6.158839063712146],[-1.611180255274587,6.15948560147309],[-1.611224821534345,6.160011810825125],[-1.6117376329555693,6.16030163480331],[-1.6121746416378482,6.160145581414311],[-1.6128122839650867,6.159342868368882],[-1.6128345679321519,6.159142280020379]]]}

Agent:

> (Prints very long report)

## Customization

This simple agent is extensible by providing more tools and more instructions in
the prompt. The tools can take this general form:

```python
@retry_async.AsyncRetry(deadline=60)
async def your_fancy_earth_engine_function(
    geojson: str,
) -> dict[str, Any]:
    """Gets some statistics about your area of interest (geojson).

    Args:
        geojson (str): A JSON string representing a GeoJSON geometry.

    Returns:
        A JSON dictionary.
    """
    region = ee.Geometry(json.loads(geojson))
    return await asyncio.to_thread(earth_engine_server_function(region).getInfo)
```

The `earth_engine_server_function` takes an `ee.Geometry` and returns an
`ee.Dictionary` (the output of a `reduceRegion()` call), both of which are
server variables. The `getInfo` call requests the result of the computation,
specifically the JSON representation of the `ee.Dictionary`. The function is
structured to make the request asynchronously and retry if it fails.

You can request textual representations of other server objects
(`ee.SomeObject`) using `getInfo()`. You can also request patches of pixels as
images. See
[this guide](https://developers.google.com/earth-engine/guides/data_extraction)
for examples of programmatically extracting image data.

## Disclaimer

This agent sample is provided for illustrative purposes only and is not intended
for production use. It serves as a basic example of an agent and a foundational
starting point for individuals or teams to develop their own agents.

This sample has not been rigorously tested, may contain bugs or limitations, and
does not include features or optimizations typically required for a production
environment (e.g., robust error handling, security measures, scalability,
performance considerations, comprehensive logging, or advanced configuration
options).

Users are solely responsible for any further development, testing, security
hardening, and deployment of agents based on this sample. We recommend thorough
review, testing, and the implementation of appropriate safeguards before using
any derived agent in a live or critical system.
