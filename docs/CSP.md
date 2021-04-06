# Content Security Policy (CSP) Notes

Created these notes while attempting to pass [CSP](https://csp.withgoogle.com/docs/adopting-csp.html) checking for general xss issues.

## Content Security Policy (CSP)

### In order to pass CSP scans in your application you will need to

- Make your app return the csp headers. To do this i used express-csp as we are using express. We use the following policy.

    ```bash
    Content-Security-Policy:
    default-src 'self';
    img-src 'self' https://externalsite1.com http://externalsite1.com;
    object-src 'none';
    script-src 'strict-dynamic' 'nonce-04111658';
    style-src * data: http://* 'unsafe-inline'
    ```

    Notes: Everything should be secure with the following exceptions.

    `img-src` - We need to add some paths for random image generator sites we use in the examples on blockgrid, hierarchy, and image components. You may need to include your own trusted sites.

    `style-src` We need to allow the soho script to set inline styles. We set this to `http://*` for the various sites we use. If we don't do this many components cannot function until we can refactor them to use CSSDOM instead of style tags (search style= in all *.js files). Some of the components needing work are mentioned on [Issue 628](https://github.com/infor-design/enterprise/issues/628)
- Replace all `style="display: none;"` with class `hidden` and use CSSDOM or classes for all styles you use
- Can testing with [CSP mitigator](https://chrome.google.com/webstore/detail/csp-mitigator/gijlobangojajlbodabkpjpheeeokhfa?hl=en)
    Then note that we can test pages like <http://localhost:4000/components/personalize/example-index> using:

    ```html
    script-src 'self';
    style-src 'self';
    frame-ancestors 'self';
    object-src 'none'
    ```

## Common Errors and remediation

### Context Escaping

[Escaping Info](http://jehiah.cz/a/guide-to-escape-sequences)

### Improper Neutralization of Script-Related HTML Tags in a Web Page (Basic XSS)

Something like `elem.html(markup);` will trigger this warning. To address we should use an allowList for example:

```javascript
DOM.html(elem, markup, '<span><div>');'
```

If this cannot be limited to a few types then sanitizing can be used.

```javascript
DOM.html(elem, markup, '*');'
```

Even better if all tags can be stripped.

```javascript
xssUtils.stripTags(string);
```

Or a pure alphanumeric value.

```javascript
xssUtils.ensureAlphaNumeric(string);
```

### URL Redirection to Untrusted Site ('Open Redirect')

Something like `window.location = href` will generate this error. To address we should use code to ensure the URL is relative.

```javascript
Soho.xss.isUrlLocal(url)
```

### Improper Output Neutralization for Logs

Something like `console.log` will generate this error. For client side code this is a false positive. But can generate a lot of scan error. To address we should use toast instead to show example output.

```javascript
$('body').toast({
  'title': '<some> Event Triggered',
  'message': 'The value was changed to : ' + value + ' .. ect'
});
```

### XML Injection (aka Blind XPath Injection)

Something like `this.listUl.find(`li[data-val="${value.replace(/"/g, '/quot/')}"]`);` will generate this error. If the value is not external this is a false positive if using newer than jQuery 1.9. But to be safe we can use:

```javascript
xssUtils.stripTags(string);
```

```javascript
xssUtils.sanitizeHTML(string);
```

Or a pure alphanumeric value.

```javascript
xssUtils.ensureAlphaNumeric(string);
```
