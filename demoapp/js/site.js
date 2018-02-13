// Handle Selecting the Version from the Top Level Dropdown
const handleVersionSwitch = function () {
  const versionList = document.getElementById('version');
  const thisVersion = versionList.value;

  versionList.addEventListener('change', () => {
    const toVersion = versionList.value;
    if (thisVersion !== versionList.value) {
      let link = window.location.href.replace(thisVersion, versionList.value);
      if (link.indexOf('http://localhost:4000/') > -1) {
        link = link.replace('http://localhost:4000/', `http://usalvlhlpool1.infor.com/${versionList.value}/`);
      }

      if (toVersion === '4.2.6') {
        link = link.replace('components', 'controls');
      }

      window.location.href = link;
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  handleVersionSwitch();
});
