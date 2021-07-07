# Installation, Building and Bundling Into Projects

## IDS Dependencies

Before installing IDS for usage in your project, make sure to install its dependencies:

- [jQuery](https://jquery.com/)
- [D3](https://d3js.org/)

## Download IDS Enterprise

### Node Package Manager

You can use NPM (or Yarn) to install from the global NPM registry:

```sh
npm install --save ids-enterprise@latest
```

You can also use `ids-enterprise@dev` for a nightly (and potentially unstable) development build.

After installation, the pre-built files are accessible in `./node_modules/ids-enterprise/dist`. When you use npm the needed dependencies are included automatically.

### CDN

We now offer the IDS library via CDN. For example, the paths for the 4.38.0 releases would be:

```html
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/js/sohoxi.js
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/js/sohoxi.min.js
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/css/theme-new-dark.css
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/css/theme-new-dark.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/css/theme-new-dark.css
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/css/theme-new-dark.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/css/theme-new-light.css
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/css/theme-new-light.min.css
https://cdn.hookandloop.infor.com/sohoxi/4.38.0/svg/theme-new-svg.html
```

## Adding the library to a project

Include the IDS dependencies and the library itself in your page's `<head>` tag:

```html
<head>
  <link rel="stylesheeet" href="css/theme-new-light.min.css" />
  <script src="js/jquery.min.js"></script>
  <script src="js/d3.min.js"></script>
  <script src="js/sohoxi.js"></script>
</head>
```

Next, establish some IDS components using the appropriate HTML markup and CSS styles.  For a full list of available components, see our [component documentation](https://design.infor.com/code/ids-enterprise/latest).  Below is an example of what's necessary to create a simple IDS Button component inside of a twelve column layout:

```html
<div class="row">
  <div class="twelve columns">

    <button id="my-button" class="btn-primary">
      <span>This is My Button</span>
    </button>

  </div>
</div>
```

Finally, in a footer section below the markup on your page, add a `<script>` tag with some Javascript code that will invoke the Javascript interactions available for each IDS component.  One way to do this is to call the generic Initializer on the `<body>` tag (or whatever block element in which you want to scope IDS):

```html
<script type="text/javascript">
  $('body').initialize();
</script>
```

It's also possible to manually initialize each individual component:

```js
  $('#my-button').button();
```

If you've got some specific Javascript code you'd like to run after IDS completely initializes, simply add an event listener for IDS's generic `initialized` event on the `<body>` tag:

```html
<script type="text/javascript">
  $('body').on('initialized', function () {
    // extra code runs here
  });
</script>
```

At this point, IDS should be completely setup in your project!

## Building the component bundles

To manually build the contents of the distributable folder (`dist/`), run the following:

```sh
npm run build
```

### Custom builds

It's also possible to run a custom build of IDS with your choice of components.  The custom bundler can be run with:

```sh
npm run build -- --components=button,input,masks,popupmenu,listview
```

