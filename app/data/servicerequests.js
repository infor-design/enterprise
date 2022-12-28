export default function data(req, res) {
  const cartItems = [
    {
      id: 1, type: 'Data Refresh', favorite: true, datetime: new Date(2014, 12, 8), requestor: 'Grant Lindsey', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'
    },
    { id: 2, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Wilson Shelton', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success' },
    {
      id: 3, type: 'Data Refresh', favorite: true, datetime: new Date(2015, 12, 8), requestor: 'Nicholas Wade', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success'
    },
    { id: 4, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lila Huff', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued' },
    { id: 5, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Ann Matthews', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
    { id: 6, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Lucia Nelson', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success' },
    { id: 7, type: 'Data Refresh', datetime: new Date(2014, 12, 8), requestor: 'Vera Cunningham', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
    { id: 8, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Dale Newman', deployment: 'AutoSuite-OD', scheduled: new Date(2015, 12, 10), status: 'Queued' },
    { id: 9, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jessica Cain', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
    { id: 10, type: 'Schedule Patch', datetime: new Date(2015, 12, 8), requestor: 'Jennie Kennedy', deployment: 'AutoSuite-PRD', scheduled: null, status: 'Success' },
    { id: 11, type: 'Data Refresh', datetime: new Date(2015, 12, 8), requestor: 'Jason Adams', deployment: 'AutoSuite-OD', scheduled: null, status: 'Success' }
  ];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(cartItems));
}
