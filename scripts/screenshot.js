/*
  Usage:
  Set domain to the website you want to screenshot, eg localhost:3000
  Set paths to an array of named paths (see example)

  Run:
  node scripts/screenshot.js "Title of page"

  Example paths:
  paths = [
    { title: 'Index page', path: '/'},
    { title: 'Terms and conditions', path: '/terms-conditions'}
  ]
*/
const paths = [
  { title: 'Design history index', path: '/'}
];
const domain = 'https://design-history.herokuapp.com';

// Dependencies
const webshot = require('webshot');
const fs = require('fs');

// Arguments
const title = process.argv.slice(-1)[0];
warnIfNoArguments(title);

const directoryName = title.replace(/ +/g, '-').toLowerCase();
const directory = 'app/assets/images/' + directoryName;
const indexDirectory = 'app/views/' + directoryName;

// Run
function start() {
  makeDirectories();
  decoratePaths();
  generatePage();
  takeScreenshots();
}

function warnIfNoArguments(title) {
  // TODO: Use a better check for an argument
  if (title.startsWith('/Users')) {
    console.log('No arguments set');
    console.log('Please set a title: `node scripts/screenshot.js "Title of page"`');
    return;
  }
}

function makeDirectories() {
  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
  }

  if (!fs.existsSync(indexDirectory)){
    fs.mkdirSync(indexDirectory);
  }
}

function decoratePaths() {
  paths.forEach(function(item, index) {
    item.id = item.title.replace(/ +/g, '-').toLowerCase();
    item.file = `${directory}/${item.id}.png`;
    item.src = item.file.replace('app/assets', '/public');
  });
}

function takeScreenshots() {
  // https://github.com/brenden/node-webshot
  const webshotOptions = {
    phantomConfig: {
      'ignore-ssl-errors': 'true'
    },
    windowSize: {
      width: 1200,
      height: 800
    },
    shotSize: {
      width: 'window',
      height: 'all'
    }
  }

  paths.forEach(function(item, index) {
    webshot(
      domain + item.path,
      item.file,
      webshotOptions,
      function(err) { console.log(`${domain + item.path} \n >> ${item.file}`); }
    );
  });
}

function generatePage() {
  var template = '';
  const templateStart = `{% extends "layout.html" %}
{% set title = '${title}' %}
{% block pageTitle %}{{ title }}{% endblock %}
{% block breadcrumbs %}{{ designHistory.designHistoryBreadcrumbs() }}{% endblock %}

{% block content %}
  <h1 class="govuk-heading-xl">{{ title }}</h1>
`;

  const templateEnd = `
{% endblock %}
`;

  var contents = `
  {% set contents = [`;

  const endContents = `
  ] %}
  {{ designHistory.screenshotContents(contents) }}
  `;

  paths.forEach(function(item, index) {
    template += `
  {{ designHistory.screenshot('${item.title}', '${item.id}', '${item.src}', '') }}
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
