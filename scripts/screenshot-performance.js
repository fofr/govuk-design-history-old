/*
  Usage:
  Set domain to the website you want to screenshot, eg localhost:3000
  Set paths to an array of named paths (see example)

  Run:
  node scripts/screenshot-performance.js name-of-directory

  Example paths:
  paths = [
    { title: 'Index page', path: '/'},
    { title: 'Terms and conditions', path: '/terms-conditions'}
  ]
*/
const paths = [
  { title: 'Service overview', path: '/reporting/1M4DgevUBtTVwS09bEpWbkhPxxFqNOBjt/page/rMeZ'},
  { title: 'Success measures', path: '/reporting/1M4DgevUBtTVwS09bEpWbkhPxxFqNOBjt/page/gNQk'}
  ];
const domain = 'https://datastudio.google.com';

// Dependencies
const webshot = require('webshot');
const fs = require('fs');
const sharp = require('sharp');

// Arguments
const directoryName = `performance/${process.argv.slice(-1)[0]}`;

// Ignore any directories when generating a title
var title = `Find performance – [month] 2019`;
const imageDirectory = `app/assets/images/${directoryName}`;
const indexDirectory = `app/views/${directoryName}`;
const thumbnailDirectory = `${imageDirectory}/thumbnails`;

// Run
function start() {
  makeDirectories();
  decoratePaths();
  generatePage();
  takeScreenshots();
}

function makeDirectories() {
  if (!fs.existsSync(imageDirectory)){
    fs.mkdirSync(imageDirectory);
  }

  if (!fs.existsSync(thumbnailDirectory)){
    fs.mkdirSync(thumbnailDirectory);
  }

  if (!fs.existsSync(indexDirectory)){
    fs.mkdirSync(indexDirectory);
  }
}

function decoratePaths() {
  paths.forEach(function(item, index) {
    item.id = item.title.replace(/ +/g, '-').toLowerCase();
    item.file = `${imageDirectory}/${item.id}.png`;
    item.thumbnailFile = `${thumbnailDirectory}/${item.id}.png`;
    item.src = item.file.replace('app/assets', '/public');
    item.thumbnailSrc = item.thumbnailFile.replace('app/assets', '/public');
  });
}

function takeScreenshots() {
  // https://github.com/brenden/node-webshot
  const webshotOptions = {
    phantomConfig: {
      'ignore-ssl-errors': 'true'
    },
    windowSize: {
      width: 1600,
      height: 1096
    },
    shotSize: {
      width: 'window',
      height: 'all'
    },
    renderDelay: 20000
  }

  paths.forEach(function(item, index) {
    webshot(
      domain + item.path,
      item.file,
      webshotOptions,
      function(err) {
        sharp(item.file).resize(630, null).toFile(item.thumbnailFile);
        console.log(`${domain + item.path} \n >> ${item.file}`);
      }
    );
  });
}

function generatePage() {
  var template = '';
  const templateStart = `{% extends "layout.html" %}
{% set title = '${title}' %}
{% block pageTitle %}{{ title }}{% endblock %}
{% block breadcrumbs %}{{ designHistory.breadcrumbs(breadcrumbItems()) }}{% endblock %}

{% block content %}
  <h1 class="govuk-heading-xl">{{ title }}</h1>

  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
    </div>
  </div>
`;

  const templateEnd = `
{% endblock %}
`;

  var contents = `
  {% set contents = [`;

  const endContents = `
  ] %}
  {{ designHistory.screenshotContents(contents, 'Contents') }}
  `;

  paths.forEach(function(item, index) {
    template += `
  {% set screenshotContent %}
  {% endset %}
  {{ designHistory.screenshot('${item.title}', '${item.id}', '${item.thumbnailSrc}', '${item.src}', markdown(serviceoverviewContent)) }}
`;

    contents += `${index > 0 ? ', ': ''}
    { text: '${item.title}', id: '${item.id}' }`;
  });

  fs.writeFile(
    `${indexDirectory}/index.html`,
    templateStart + contents + endContents + template + templateEnd,
    function(err) {
      if (err) { return console.log(err); }
      console.log(`Index generated: ${indexDirectory}/index.html`);
    }
  );
}

start();
