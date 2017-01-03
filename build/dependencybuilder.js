module.exports = function(grunt) {

  const checkGruntControlOptions = require('./helpers/checkgruntcontroloptions.js'),
    extractControls = require('./helpers/extractcontrols.js'),
    setTraverse = require('./helpers/settraverse.js'),
    orderedDist = require('./helpers/ordereddist.js'),
    mapperPath = grunt.option('mapperPath'),
    configPath = grunt.option('configPath'),
    config = grunt.option('config');

  let controls = grunt.option('controls'),
    excludeControls = grunt.option('excludeControls'),
    dist = new Set(),
    deps = new Set();

  controls = checkGruntControlOptions(controls);
  excludeControls = checkGruntControlOptions(excludeControls);

  if (configPath) {
    let path = grunt.file.readJSON(configPath);
    dist = path.js;
  }

  if (mapperPath && controls && !configPath) {
    const hashMap = grunt.file.readJSON(mapperPath);

    for (let control of controls) {
      if (control !== 'initialize') {
        let highLevelDependencies = control,
          lowLevelDependencies = hashMap[highLevelDependencies],
          uniqs = extractControls(lowLevelDependencies),
          setTraverseDeps = setTraverse(hashMap, uniqs, excludeControls);

        for (let dep of setTraverseDeps) {
          deps.add(dep);
        }
      } else {
        deps.add(control);
      }
    }

    dist = new Set([...deps, ...controls]);
  }

  if(mapperPath || config || configPath) {
    let configObj;

    if (config) {
      configObj = { js : [...dist] };
      grunt.file.write('config.json', JSON.stringify(configObj, null, 2));
      grunt.log.writeln();
      grunt.log.writeln('\u2714'.green, ' File', 'config.json'.magenta, 'created.');
      grunt.log.write(JSON.stringify(configObj, null, 2).cyan);
      grunt.log.writeln();
    }

  } else {
    return false;
  }

  let paths = orderedDist(dist, excludeControls).map((path) => { return `temp/amd/${path}.js`; }),
    logOptions = { separator: '\n' };


  grunt.log.writeln('List of included controls in sohoxi.*.js'.green);
  grunt.log.write(grunt.log.wordlist(paths, logOptions));

  return paths;

};
