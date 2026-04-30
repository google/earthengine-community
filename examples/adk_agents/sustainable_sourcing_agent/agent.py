"""A sustainable sourcing agent."""

import functools
import logging
import os

import ee
import google
from google.adk.agents import llm_agent
import vertexai

from . import prompts
from . import tools

_PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT')
_REGION = os.environ.get('GOOGLE_CLOUD_LOCATION')


@functools.cache
def _initialize_earth_engine():
  """Initializes the Earth Engine client exactly once."""
  try:
    if not _PROJECT_ID:
      raise ValueError('GOOGLE_CLOUD_PROJECT environment variable not set.')

    scopes = [
        'https://www.googleapis.com/auth/earthengine',
        'https://www.googleapis.com/auth/cloud-platform',
    ]
    credentials, _ = google.auth.default(scopes=scopes)

    ee.Initialize(
        credentials,
        project=_PROJECT_ID,
        opt_url='https://earthengine-highvolume.googleapis.com',
    )
    logging.info(
        'Earth Engine initialized successfully for project: %s', _PROJECT_ID
    )

  except Exception as e:
    logging.exception('Failed to initialize Earth Engine: %s', e)
    raise


@functools.cache
def _initialize_vertex_ai():
  """Initializes the Vertex AI client exactly once."""
  try:
    logging.info(
        'Initializing Vertex AI for project: %s in location: %s',
        _PROJECT_ID,
        _REGION,
    )
    vertexai.init(project=_PROJECT_ID, location=_REGION)
    logging.info('Vertex AI initialized successfully.')
  except Exception as e:
    logging.exception('Failed to initialize Vertex AI: %s', e)
    raise


def root_agent() -> llm_agent.Agent:
  # Initialize Earth Engine and Vertex when the agent is being created.
  _initialize_earth_engine()
  _initialize_vertex_ai()

  return llm_agent.Agent(
      name='suso_ai_agent',
      model='gemini-2.5-pro',
      description='Agent to answer questions about sustainable sourcing.',
      tools=[
          tools.get_annual_change_stats_2018_2025,
          tools.get_whisp_stats,
          tools.get_suso_stats,
          tools.retrieve_rag_documentation,
      ],
      instruction=prompts.root_agent_prompt,
  )

root_agent = root_agent()
