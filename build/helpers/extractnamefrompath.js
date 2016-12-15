module.exports = function(path) {
  const matches = path.match(/.*(\/.*)(\.js)/),
    name = matches[1].replace('/', '');
  return name;
};
