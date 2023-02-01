import * as fs from 'fs';

export default function sendGeneratedDocPage(options, req, res, next) {
  if (!options.path) {
    next('No generated documentation page path was provided.');
  }

  let output;
  try {
    output = fs.readFileSync(options.path, 'utf8');
  } catch (err) {
    if (req.params.component) {
      res.redirect(`/components/${req.params.component}/list`);
    }

    res.opts.error = err;
    next('Could not read from the specified generated documentation file.');
    return;
  }

  res.send(output);
}
