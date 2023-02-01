export default function orgpaging(req, res) {
  const menPath = `${res.opts.basepath}images/`;
  const womenPath = `${res.opts.basepath}images/`;
  const orgdata = [{
    id: '1',
    Name: 'Jonathan Cargill',
    Position: 'Director',
    EmploymentType: 'FT',
    Picture: `${menPath}21.jpg`,
    children: [
      { id: '1_3', Name: 'Kaylee Edwards', Position: 'Records Manager', EmploymentType: 'FT', Picture: `${womenPath}11.jpg`, children: [] },
      { id: '1_4', Name: 'Jason Ayers', Position: 'HR Manager', EmploymentType: 'FT', Picture: `${menPath}12.jpg`, children: [] },
      { id: '1_5', Name: 'Daniel Calhoun', Position: 'Manager', EmploymentType: 'FT', Picture: `${menPath}4.jpg`, children: [] },
      { id: '1_1-e', Name: 'Sarah Smith', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
      { id: '1_2-f', Name: 'Greg Peterson', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
    ]
  }];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(orgdata));
}
