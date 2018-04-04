module.exports = {
  text: 'Settings',
  icon: 'settings',
  disabled: false,
  submenu: [
    {
      text: 'Submenu Item #1',
      selectable: 'multiple'
    },
    {
      text: 'Submenu Item #2',
      selectable: 'multiple'
    },
    {
      text: 'Submenu Item #3',
      selectable: 'multiple'
    },
    {
      divider: true,
      heading: 'Additional Settings',
      nextSectionSelect: 'single'
    },
    {
      text: 'Other Setting #1',
    },
    {
      text: 'Other Setting #2',
    },
    {
      text: 'Other Setting #3',
    }
  ]
};
