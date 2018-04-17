module.exports = function(dist, excludeControls) {
  const orderedDeps = [
    'personalize',
    'initialize',
    'base',
    'utils',
    'animations',
    'locale',
    'listfilter',
    'mask-api',
    'mask-functions',
    'masked-input',
    'listfilter'
  ];

  let foundOrderedDeps = new Set(),
    selectControls,
    mergedDist;

  for (let control of orderedDeps) {
    if (dist.has(control)) {
      dist.delete(control);
      foundOrderedDeps.add(control);
    }
  }

  mergedDist = new Set([...foundOrderedDeps, ...dist]);

  if (excludeControls) {
    for (let control of excludeControls) {
      selectControls = [...mergedDist].filter((el) => { return el !== control; });
    }
  }

  return selectControls || [...mergedDist];
};
