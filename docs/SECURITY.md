# CSP Scan

## In order to pass CSP scans you need to

1. Make your app return the csp headers. To do this i used express-csp as we are using express.
    - We used the following policy.

    ```html
    Content-Security-Policy:
    default-src 'self';
    img-src 'self' https://randomuser.me http://placehold.it;object-src 'none';
    script-src 'strict-dynamic' 'nonce-04111658';
    style-src * data: http://* 'unsafe-inline'
    ```

    Notes: Everything should be secure with the following exceptions.
    - `img-src` - We need to add some paths for random image generator sites we use in the examples on blockgrid, hierarcy, and image components. If you use these you may need to set this to 'self'.
    - `style-src` We need to allow the soho script to do inline styles. We set this to `http://*` for the various sites we use. You should set this to your sites. If we don't do this many components cannot currently function until we can refactor them to use CSSDOM instead of style tags. (search style= in all *.js files)
        - datagrid column widths
        - dragging / dropping
        - pasting in the editor
        - personalization colors
        - many examples
1. Replace all `style="display: none;"` with class `hidden`
1. If testing with [CSP mitigator](https://chrome.google.com/webstore/detail/csp-mitigator/gijlobangojajlbodabkpjpheeeokhfa?hl=en)
    Then note that we can test pages like <http://localhost:4000/components/personalize/example-index> using:
    ```html
    script-src 'self';
    style-src 'self';
    frame-ancestors 'self';
    object-src 'none'
    ```

## Context Escaping

[Escaping Info](http://jehiah.cz/a/guide-to-escape-sequences)

## Context Escaping

[Escaping Info](http://jehiah.cz/a/guide-to-escape-sequences)
