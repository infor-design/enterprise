# CSP Scan

## In order to pass CSP scans you need to

1. Make your app return the csp headers. To do this i used express-csp as we are using express.
    - We used the following

    ```html
    Content-Security-Policy:
    default-src 'self';
    img-src 'self' https://randomuser.me http://placehold.it;object-src 'none';
    script-src 'strict-dynamic' 'nonce-04111658';
    style-src * data: http://* 'unsafe-inline'
    ```

    Notes: Everything should be secure with the following exceptions.
    - `img-src` - We need to add some paths for random image generator sites we use in the examples on blockgrid, hierarcy, and image components. If you use these you may need to set this to 'self'.
    - `style-src` We need to allow the soho script to do inline styles. We set this to `http://*` for the various sites we use. You should set this to your sites. If we don't do this many components cannot function for example things with height, width, top, left
        - datagrid column widths
        - dragging / dropping
        - popup position
        - [Additional help on stack overflow](https://stackoverflow.com/questions/49821050/style-src-for-applications-that-have-interactive-components)

1. Replace all `style="display: none;"` with class `hidden`
1. In application menu code remove inline `style="display: none;"`
1. If testing with [CSP mitigator](https://chrome.google.com/webstore/detail/csp-mitigator/gijlobangojajlbodabkpjpheeeokhfa?hl=en)
    Then note that we can test pages like <http://localhost:4000/components/personalize/example-index> using:
    ```html
    script-src 'self';
    style-src 'self';
    frame-ancestors 'self';
    object-src 'none'
    ```

    These errors still occur:
    - False positive on elements without a nonce attribute (3) (or pages have auto nonce)
    - Libraries that allow strict-dynamic bypass (1) (it warns about jQuery but the latest version does no longer have an Eval in it 3.3.1)

## Static Scan

- zip folders app, src, scripts and submit
- 107 Flaws - 74 Points

## Tools to Checkout

[OWASP XSS Info](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#Why_Can.27t_I_Just_HTML_Entity_Encode_Untrusted_Data.3F)
[Older JQuery Encoder Code](https://github.com/chrisisbeef/jquery-encoder)
[Yahoo Xss Filters Utils](https://github.com/yahoo/xss-filters)

Resulted in error "Improper Output Neutralization for Logs", console.log not needed so was removed.

## Statements on Mitigation

This method is sanitized via a whitelist that only allows x,y,z tags. Its also expect that data is sanitized server side
by the implementing application teams.

## Context Escaping

[Escaping Info](http://jehiah.cz/a/guide-to-escape-sequences)

## Re-test / Impacted

- Step Process (index and markup examples)
- Locale
- Toolbar Flex
- Misc Examples
