// Sample Day Periods
module.exports = (req, res, next) => {
  const tasks = [{ id: 1, city: 'London', location: 'Corporate FY15', alert: true, alertClass: 'error', daysLeft: '3', hoursLeft: '23' },
    { id: 1, city: 'New York', location: 'Corporate FY15', alert: true, alertClass: 'alert', daysLeft: '25', hoursLeft: '11' },
    { id: 1, city: 'Vancouver', location: 'Corporate FY15', alert: false, alertClass: '', daysLeft: '30', hoursLeft: '23' },
    { id: 1, city: 'Tokyo', location: 'Corporate FY15', alert: false, alertClass: '', daysLeft: '35', hoursLeft: '13' }
  ];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(tasks));
  next();
};
