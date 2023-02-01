export default function orgChilden(req, res) {
  const womenPath = `${res.opts.basepath}images/`;
  const orgdata = [
    { id: `AA${Math.floor(Math.random() * 1000)}`, Name: 'Kaylee Edwards', Position: 'Records Manager', EmploymentType: 'FT', Picture: `${womenPath}11.jpg` },
    { id: `BB${Math.floor(Math.random() * 1000)}`, Name: 'Emily Johnson', Position: 'Senior Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}9.jpg`, isLeaf: true },
    { id: `CC${Math.floor(Math.random() * 1000)}`, Name: 'Kari Anderson', Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}10.jpg`, isLeaf: true }
  ];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(orgdata));
}
