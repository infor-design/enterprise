module.exports = [
  {
    text: 'Pre-defined Menu Item #1'
  },
  {
    text: 'Pre-defined Menu Item #2',
    icon: 'settings',
  },
  {
    text: 'Pre-defined Menu Item #3',
    submenu: [{
      text: 'Submenu Item #1',
      selectable: 'single'
    },
    {
      text: 'Submenu Item #2',
      selectable: 'single'
    },
    {
      text: 'Submenu Item #3',
      selectable: 'single'
    }
    ]
  },
  {
    text: 'Pre-defined Menu Item #4',
    disabled: true
  },
  {
    text: 'Pre-defined Menu Item #5'
  },
  {
    divider: true,
    heading: 'Additional Settings',
    nextSectionSelect: 'single'
  },
  {
    text: 'Pre-defined Menu Item #6',
    hidden: true
  },
  {
    text: 'Pre-defined Menu Item #6'
  }
];
