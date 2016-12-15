module.exports = function(dist, excludeControls) {
  if (!dist) { return; }

  //Reorder paths correctly
  let orderedDeps = [
    'personalize',
    'initialize',
    'base',
    'utils',
    'animations',
    'locale',
    'listfilter'
  ];

  let orderedDepsIndex = [],
    foundOrderedDeps   = [],
    combinedDist       = [];

  for (let i in orderedDeps) {
    orderedDepsIndex.push(dist.indexOf(orderedDeps[i]));
  }

  for (let i in orderedDepsIndex) {
    if (orderedDepsIndex[i] > -1) {
      foundOrderedDeps.push(orderedDeps[i]);
    }
  }

  for (let i in foundOrderedDeps) {
    dist = dist.filter((err) => {
      return err !== foundOrderedDeps[i];
    });
  }

  combinedDist = foundOrderedDeps.concat(dist);

  //Modify array based on options, include, exclude options
  if (excludeControls) {
    for (let i in excludeControls) {
      combinedDist = combinedDist.filter((err) => {
        return err !== excludeControls[i];
      });
    }
  }


  return combinedDist;
};
