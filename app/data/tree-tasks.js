export default function treeTasks(req, res) {
  const tasks = [
    {
      id: 1,
      escalated: 2,
      depth: 1,
      expanded: false,
      taskName: 'Follow up action with HMM Global',
      desc: '',
      comments: null,
      orderDate: new Date(2014, 12, 8),
      time: '',
      children: [
        {
          id: 2, escalated: 1, depth: 2, taskName: 'Quotes due to expire', desc: 'Update pending quotes.', comments: 'Example Comment', orderDate: new Date(2015, 7, 3), time: '7:10 AM'
        },
        {
          id: 3, escalated: 0, depth: 2, taskName: 'Follow up action with logistics', desc: 'Contact sales representative with the updated purchase order.', comments: 'Example Comment', orderDate: new Date(2014, 6, 3), time: '9:10 AM'
        },
        {
          id: 4, escalated: 0, depth: 2, taskName: 'Follow up action with trucking', desc: 'Contact sales representative with the updated purchase order.', comments: 'Example Comment', orderDate: new Date(2015, 3, 4), time: '14:10 PM'
        },
      ]
    },
    {
      id: 5, escalated: 0, depth: 1, taskName: 'Follow up action with Residental Housing', desc: 'Contact sales representative with the updated purchase order.', comments: 'Example Comment', orderDate: new Date(2015, 5, 5), time: '18:10 PM'
    },
    {
      id: 6, escalated: 0, depth: 1, taskName: 'Follow up action with HMM USA', desc: 'Contact sales representative with the updated purchase order.', comments: 'Example Comment', orderDate: new Date(2014, 6, 9), time: '20:10 PM', portable: true
    },
    {
      id: 7,
      escalated: 0,
      depth: 1,
      expanded: true,
      taskName: 'Follow up action with Residental Baltimore',
      desc: 'Contact sales representative with the updated purchase order.',
      comments: 'Example Comment',
      orderDate: new Date(2014, 6, 8),
      time: '22:10 PM',
      portable: true,
      children: [
        {
          id: 8, escalated: 0, depth: 2, taskName: 'Follow up action with Logistics', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2014, 5, 2), time: '22:10 PM'
        },
        {
          id: 9, escalated: 0, depth: 2, taskName: 'Follow up action with Shipping', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2014, 6, 9), time: '22:10 PM'
        },
        {
          id: 10,
          escalated: 0,
          depth: 2,
          expanded: true,
          taskName: 'Follow up action with Residental New York',
          desc: 'Contact sales representative.',
          comments: 'Example Comment',
          orderDate: new Date(2014, 2, 8),
          time: '7:04 AM',
          children: [
            {
              id: 11, escalated: 0, depth: 3, taskName: 'Follow up action with Logistics', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2015, 10, 18), time: '14:10 PM', portable: true
            },
            {
              id: 12,
              escalated: 0,
              depth: 3,
              expanded: true,
              taskName: 'Follow up action with Acme Canada',
              desc: 'Contact sales representative.',
              comments: 'Example Comment',
              orderDate: new Date(2014, 3, 22),
              time: '7:04 AM',
              children: [
                {
                  id: 13, escalated: 0, depth: 4, taskName: 'More Contact', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2015, 3, 8), time: '14:10 PM'
                },
                {
                  id: 14, escalated: 0, depth: 4, taskName: 'More Follow up', desc: 'Contact team lead.', comments: 'Example Comment', orderDate: new Date(2014, 3, 9), time: '7:04 AM'
                },
              ]
            },
          ]
        }
      ]
    },
    {
      id: 15,
      escalated: 0,
      depth: 1,
      expanded: false,
      taskName: 'Follow up action with Residental Mexico',
      desc: 'Contact sales representative with the updated purchase order.',
      comments: 'Example Comment',
      orderDate: new Date(2015, 5, 23),
      time: '22:10 PM',
      children: [
        {
          id: 16, escalated: 0, depth: 2, taskName: 'Follow up action with Logistics', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2014, 12, 18), time: '22:10 PM'
        },
        {
          id: 17, escalated: 0, depth: 2, taskName: 'Follow up action with Shipping', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2014, 4, 5), time: '22:10 PM', portable: true
        },
        {
          id: 18,
          escalated: 0,
          depth: 2,
          expanded: true,
          taskName: 'Follow up action with Residental Kansas City',
          desc: 'Contact sales representative.',
          comments: 'Example Comment',
          orderDate: new Date(2015, 5, 5),
          time: '7:04 AM',
          children: [
            {
              id: 19, escalated: 0, depth: 3, taskName: 'Follow up action with Logistics', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2014, 5, 16), time: '14:10 PM'
            },
            {
              id: 20,
              escalated: 0,
              depth: 3,
              expanded: true,
              taskName: 'Follow up action with Logistics Manager',
              desc: 'Contact sales representative.',
              comments: 'Example Comment',
              orderDate: new Date(2015, 5, 28),
              time: '7:04 AM',
              portable: true,
              children: [
                {
                  id: 21, escalated: 0, depth: 4, taskName: 'More Contact', desc: 'Contact sales representative.', comments: 'Example Comment', orderDate: new Date(2014, 1, 21), time: '14:10 PM'
                },
                {
                  id: 22, escalated: 0, depth: 4, taskName: 'More Follow up', desc: 'Contact manager.', comments: 'Example Comment', orderDate: new Date(2014, 9, 3), time: '7:04 AM'
                },
              ]
            },
          ]
        }
      ]
    }
  ];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(tasks));
}
