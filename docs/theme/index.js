/* eslint-disable import/no-extraneous-dependencies, prefer-destructuring,
no-mixed-operators, guard-for-in, no-buffer-constructor, no-restricted-syntax */

const fs = require('fs');
const path = require('path');
const write = require('vinyl-write');
const Vinyl = require('vinyl');
const _ = require('lodash');
const GithubSlugger = require('github-slugger');
const createFormatters = require('documentation').util.createFormatters;
const LinkerStack = require('documentation').util.LinkerStack;
const hljs = require('highlight.js');

function isFunction(section) {
  return section.kind === 'function' || section.kind === 'typedef' &&
    section.type.type === 'NameExpression' && section.type.name === 'Function';
}

module.exports = function (comments, config) {
  const linkerStack = new LinkerStack(config).namespaceResolver(comments, (namespace) => {
    const slugger = new GithubSlugger();
    return `#${slugger.slug(namespace)}`;
  });
  const formatters = createFormatters(linkerStack.link);

  // Add an Index
  for (let i = 0; i < comments.length; i++) {
    comments[i].index = i.toString();
  }

  hljs.configure(config.hljs || {});

  const sharedImports = {
    imports: {
      slug(str) {
        const slugger = new GithubSlugger();
        return slugger.slug(str);
      },
      shortSignature(section) {
        let prefix = '';
        if (section.kind === 'class') {
          prefix = 'new ';
        } else if (!isFunction(section)) {
          return section.name;
        }
        return prefix + section.name + formatters.parameters(section, true);
      },
      signature(section) {
        let returns = '';
        let prefix = '';
        if (section.kind === 'class') {
          prefix = 'new ';
        } else if (!isFunction(section)) {
          return section.name;
        }
        if (section.returns.length) {
          returns = `: ${formatters.type(section.returns[0].type)}`;
        }
        return prefix + section.name + formatters.parameters(section) + returns;
      },
      md(ast, inline) {
        if (inline && ast && ast.children.length && ast.children[0].type === 'paragraph') {
          ast = {
            type: 'root',
            children: ast.children[0].children.concat(ast.children.slice(1))
          };
        }
        return formatters.markdown(ast);
      },
      typeNoLink(type) {
        let output = '';

        if (!type || (!type.name && !type.expression)) {
          return '';
        }

        if (type.expression) {
          type = type.expression;
        }

        for (const property in type.name) {
          output += type.name[property];
        }
        return output;
      },
      formatType: formatters.type,
      autolink: formatters.autolink,
      highlight(example) {
        if (config.hljs && config.hljs.highlightAuto) {
          return hljs.highlightAuto(example).value;
        }
        return hljs.highlight('js', example).value;
      }
    }
  };

  sharedImports.imports.renderSection = _.template(fs.readFileSync(path.join(__dirname, 'section._'), 'utf8'), sharedImports);
  sharedImports.imports.renderEvent = _.template(fs.readFileSync(path.join(__dirname, 'event._'), 'utf8'), sharedImports);
  sharedImports.imports.renderSetting = _.template(fs.readFileSync(path.join(__dirname, 'setting._'), 'utf8'), sharedImports);
  const pageTemplate = _.template(fs.readFileSync(path.join(__dirname, 'index._'), 'utf8'), sharedImports);
  const events = comments[0].members.events;
  const settings = comments[0].tags;
  console.log(settings);

  // push assets into the pipeline as well.
  const file = new Vinyl({
    path: config.output,
    contents: new Buffer(pageTemplate({
      docs: comments,
      events,
      settings,
      config
    }), 'utf8')
  });

  write(file, (err) => {
    if (err) {
      throw err;
    }
  });
};
