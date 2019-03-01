# Becoming a teacher design history

https://bat-design-history.herokuapp.com/

[Design history](https://github.com/fofr/govuk-design-history) is an app built using the [GOV.UK prototyping kit](https://github.com/alphagov/govuk-prototype-kit).

## Document your designs

This repository makes it easy to:

* screenshot your designs
* create pages of screenshots to document designs
* document designs using the [GOV.UK Design System](https://design-system.service.gov.uk/)
* print pages of designs
* make designs shareable and linkable

Some examples of design history in use:

* https://bat-design-history.herokuapp.com/
* https://bat-design-history.herokuapp.com/find-teacher-training/choose-how-to-apply

## Take screenshots

### Configure

In [scripts/screenshot.js](scripts/screenshot.js) you should set:
* the domain you want to capture (eg a locally running prototype at localhost:3000 or an Heroku app)
* the paths on that domain with the titles you want to give them

Example paths:
```js
paths = [
  { title: 'Index page', path: '/'},
  { title: 'Terms and conditions', path: '/terms-conditions'}
]
```

### Run

```bash
node scripts/screenshot.js "a-generated-example"
```

This will:
* visit each page and save a screenshot
* save screenshots in a new directory
* generate an index page with screenshots listed in order

Example output:
```
node scripts/screenshot.js "a-generated-example"
Index generated: app/views/a-generated-example/index.html
https://design-history.herokuapp.com/
 >> app/assets/images/a-generated-example/design-history-index.png
```

[Example commit](/commit/eba8f4fbcb11e3f50b3084711ad9f90ebc59898e), [example page](https://design-history.herokuapp.com/a-generated-example).

### Document

When the index page and images are generated it’s easy to begin documenting those designs.

### Publish

You can easily publish your design history to Heroku to create a linkable, shareable design artefact.
