module.exports = function(grunt) {

  const checkGruntControlOptions = require('./helpers/checkgruntcontroloptions.js'),
    setUniqueDependencies = require('./helpers/setuniquedependencies.js'),
    setHashMapUniqueDependencies = require('./helpers/sethashmapuniquedependencies.js'),
    setTraverse = require('./helpers/settraverse.js'),
    orderedDist = require('./helpers/ordereddist.js'),
    mapperPath = grunt.option('mapperPath'),
    configPath = grunt.option('configPath'),
    config = grunt.option('config');

  let controls = grunt.option('controls'),
    excludeControls = grunt.option('excludeControls'),
    dist,
    deps = [];

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
          uniqs = setHashMapUniqueDependencies(lowLevelDependencies),
          setTraverseDeps = setTraverse(hashMap, uniqs);

        for (let dep of setTraverseDeps) {
          deps.push(dep);
        }
      } else {
        deps.push(control);
      }
    }

    let combinedDeps = deps.concat(controls);
    dist = setUniqueDependencies(combinedDeps);

  }

  if(mapperPath || config || configPath) {
    let configObj;

    if (config) {
      configObj = { js : dist };
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
