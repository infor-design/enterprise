export default function garbageData(req, res) {
  let amount = 25;
  let paragraphs = 1;
  let text = '';
  let type = 'text';
  const types = ['text', 'html', 'json'];
  const garbageWords = ['garbage', 'junk', 'nonsense', 'trash', 'rubbish', 'debris', 'detritus', 'filth', 'waste', 'scrap', 'sewage', 'slop', 'sweepings', 'bits and pieces', 'odds and ends', 'rubble', 'clippings', 'muck', 'stuff'];

  function randomSeed() {
    return ((Math.random() * (10 - 1)) + 1) > 8;
  }

  function getWord() {
    return garbageWords[Math.floor(Math.random() * garbageWords.length)];
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  function done(content) {
    if (type === 'html') {
      res.send(content);
      return;
    }

    if (type === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(content));
      return;
    }

    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify(content));
  }

  if (req && req.query) {
    if (req.query.size) {
      amount = req.query.size;
    }

    if (req.query.return && types.indexOf(req.query.return) > -1) {
      type = req.query.return;
    }

    if (req.query.paragraphs && !isNaN(req.query.paragraphs)) { //eslint-disable-line
      paragraphs = parseInt(req.query.paragraphs, 10);
    }
  }

  let word = '';

  if (type === 'json') {
    const data = [];
    let objCount = 0;

    while (objCount < amount) {
      word = getWord();

      data.push({
        id: objCount,
        label: `${capitalize(word)}`,
        value: `${objCount}-${word.split(' ').join('-')}`,
        selected: false
      });
      objCount += 1;
    }

    done(data);
    return;
  }

  // Get a random word from the GarbageWords array
  let paragraph = '';

  while (paragraphs > 0) {
    if (type === 'html') {
      paragraph += '<p>';
    }

    if (type === 'text' && text.length > 0) {
      paragraph += ' ';
    }

    // if we serve html and the random seed is true, send a picture of garbage.
    if (!(type === 'html' && randomSeed())) {
      // in all other cases, generate the amount of words defined by the query for this paragraph.
      for (let i = 0; i < amount; i++) {
        word = getWord();

        if (!paragraph.length) {
          word = capitalize(word);
        } else {
          paragraph += ' ';
        }
        paragraph += word;
      }
    }

    if (type === 'html') {
      paragraph += '</p>';
    }

    // Add to text, reset
    text += paragraph;
    paragraph = '';

    paragraphs -= 1;
  }

  done(text);
}
