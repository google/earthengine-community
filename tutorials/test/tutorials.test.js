/**
 * @license
 * Copyright 2019 The Google Earth Engine Community Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var assert = require('assert');
var fs = require('fs');
var path = require('path');

// Regex patterns for validating paths, filenames, and text:

// e.g. modis-ndvi-time-series.md
var FILENAME_REGEXP = /^[a-z0-9-]+\.md$/;

// e.g. using-nodejs-to-calculate-the-size-of-a-bigquery-dataset
var DIR_REGEXP = /^[a-z0-9-]+$/;

// e.g. How to Set Up PostgreSQL on Compute Engine
var TITLE_REGEXP = /^[a-zA-Z0-9\s.+\-()&:'"/!]+$/;

// e.g. Learn how to get PostgreSQL running on Compute Engine
var DESCRIPTION_REGEXP = /^[a-zA-Z0-9\s.,\-()&#'"/!]+\.$/;

// e.g. larry-p
var GITHUB_REGEXP = /^[a-zA-Z0-9-,]+$/;

// e.g. Earth Engine, NDVI
var TAGS_REGEXP = /^[a-zA-Z0-9.+,#\s-']+$/;

// e.g. 2016-03-31
var DATE_REGEXP = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

// e.g.
//
// ---
// title: Landsat ETM+ to OLI Harmonization
// description: Inter-sensor Landsat harmonization and time series...
// author: jdbcode
// tags: landsat, etm+, oli, tm, harmonization, time-series, join, reduce, ...
// date_published: 2019-08-29
// ---
// eslint-disable-next-line max-len
var MD_TUTORIAL_YAML_REGEXP = /^---\ntitle: (.+)\ndescription: (.+)\nauthor: (.+)\ntags: (.+)\ndate_published: (.+)\n---\n/;

// Copyright header must immediately follow YAML frontmatter.
// eslint-disable-next-line max-len
var MD_COPYRIGHT_REGEXP = /---\n<!--\nCopyright \d\d\d\d The Google Earth Engine Community Authors\n(.|\n)*under the License.\n-->/;

// Finds image tags in Markdown that contain absolute paths.
var MD_ABSOLUTE_IMAGE_PATHS_REGEXP = /!\[.*?\]\(.*?\/.*?\)/g;

// Expected to be the first line of the first cell.
// eslint-disable-next-line max-len
var IPYNB_COPYRIGHT_REGEXP = /#\s*@title Copyright \d\d\d\d The Earth Engine Community Authors \{ display-mode: "form" \}/;

// Finds image tags in HTML that contain absolute paths.
var HTML_ABSOLUTE_PATHS_REGEXP = /\bsrc=['"]?.*?\/.*?['"]?/g;

// Base path of tutorials (tutorials/).
var tutorialsPath = path.join(__dirname, '..');

var files = fs.readdirSync(tutorialsPath).filter(function(name) {
  return !name.startsWith('.');
});

describe('tutorials /', function() {
  files.forEach(function(entry, i) {
    var dir = path.join(tutorialsPath, '/', entry);
    var stats = fs.statSync(dir);
    if (!stats.isDirectory() || entry == 'test' || entry == 'node_modules') {
      return;
    }

    describe(entry + ' /', function() {
      var files = fs.readdirSync(dir).filter(function(f) {
        return f == 'index.md' || f.endsWith('.ipynb');
      });
      assert(
          files.length == 1,
          'dirs must contain exactly one index.md or *.ipynb');
      var filename = files[0];
      var content =
          fs.readFileSync(path.join(dir, filename), {encoding: 'utf8'});

      var testMarkdown = function() {
        it('copyright', function() {
          assert(
              MD_COPYRIGHT_REGEXP.test(content),
              'copyright header missing or invalid');
        });

        it('frontmatter', function() {
          var matches = MD_TUTORIAL_YAML_REGEXP.exec(content);
          assert(
              MD_TUTORIAL_YAML_REGEXP.test(content),
              'yaml frontmatter missing or invalid');
          var title = matches[1];
          var description = matches[2];
          var author = matches[3];
          var tags = matches[4];
          var datePublished = matches[5];

          assert(
              TITLE_REGEXP.test(title),
              'title should be of the form ' + TITLE_REGEXP +
                  '. Actual: ' + title + '.');
          assert(
              DESCRIPTION_REGEXP.test(description),
              'description should be of the form ' + DESCRIPTION_REGEXP +
                  '. Actual: ' + description + '.');
          assert(
              GITHUB_REGEXP.test(author),
              'author should be of the form ' + GITHUB_REGEXP +
                  '. Actual: ' + author + '.');
          assert(
              TAGS_REGEXP.test(tags),
              'tags should be of the form ' + TAGS_REGEXP +
                  '. Actual: ' + tags + '.');
          assert(
              DATE_REGEXP.test(datePublished),
              'datePublished should be of the form YYYY-MM-DD. Actual: ' +
                  datePublished + '.');
        });
      };

      var testIpynb = function() {
        var nb = JSON.parse(content);
        var cells = nb.cells;
        assert(
            cells && cells.length > 1,
            'notebook must contain two or more cells');

        it('copyright header', function() {
          assert(
              cells[0].source.length == 13 &&
                  IPYNB_COPYRIGHT_REGEXP.test(cells[0].source[0]),
              'first cell must contain valid copyright header');
        });
      };

      describe(filename, function() {
        it('dir name', function() {
          assert(
              DIR_REGEXP.test(entry),
              'dir name must be of the form ' + DIR_REGEXP +
                  '. Actual: ' + entry + '.');
        });

        it('relative image paths in md', function() {
          var matches = MD_ABSOLUTE_IMAGE_PATHS_REGEXP.exec(content);
          assert(
              matches == null || matches.length == 0,
              'absolute image paths not allowed: ' + matches);
        });

        it('relative src paths in html', function() {
          var matches = HTML_ABSOLUTE_PATHS_REGEXP.exec(content);
          assert(
              matches == null || matches.length == 0,
              'absolute src paths not allowed: ' + matches);
        });

        if (filename == 'index.md') {
          testMarkdown();
        } else if (filename.endsWith('.ipynb')) {
          testIpynb();
        }
      });
    });
  });
});
