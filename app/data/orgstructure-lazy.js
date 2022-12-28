export default function orgLazy(req, res) {
  const menPath = `${res.opts.basepath}images/`;
  const womenPath = `${res.opts.basepath}images/`;
  const orgdata = [{
    id: '1',
    Name: 'Jonathan Cargill',
    Position: 'Director',
    EmploymentType: 'FT',
    Picture: `${menPath}21.jpg`,
    children: [
      {
        id: '1_3',
        Name: 'Kaylee Edwards',
        Position: 'Records Manager',
        EmploymentType: 'FT',
        Picture: `${womenPath}11.jpg`,
        children: [
          { id: '1_3_1', Name: 'Tony Cleveland', Position: 'Records Clerk', EmploymentType: 'C', Picture: `${menPath}6.jpg`, isLeaf: true },
          { id: '1_3_2', Name: 'Julie Dawes', Position: 'Records Clerk', EmploymentType: 'PT', Picture: `${womenPath}5.jpg`, isLeaf: true },
          { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: `${menPath}7.jpg` }
        ]
      },
      {
        id: '1_4',
        Name: 'Jason Ayers',
        Position: 'HR Manager',
        EmploymentType: 'FT',
        Picture: `${menPath}12.jpg`,
        children: [
          { id: '1_4_1', Name: 'William Moore', Position: 'Benefits Specialist', EmploymentType: 'FT', Picture: `${menPath}8.jpg`, isLeaf: true },
          { id: '1_4_2', Name: 'Rachel Smith', Position: 'Compliance Specialist', EmploymentType: 'FT', Picture: `${womenPath}6.jpg`, isLeaf: true },
        ]
      },
      {
        id: '1_5',
        Name: 'Daniel Calhoun',
        Position: 'Manager',
        EmploymentType: 'FT',
        Picture: `${menPath}4.jpg`,
        children: [
          { id: '1_5_1', Name: 'Michael Bolton', Position: 'Software Engineer', EmploymentType: 'C', Picture: `${menPath}3.jpg`, isLeaf: true },
          { id: '1_5_2', Name: 'Emily Johnson', Position: 'Senior Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}9.jpg`, isLeaf: true },
          { id: '1_5_3', Name: 'Kari Anderson', Position: 'Principle Software Engineer', EmploymentType: 'FT', Picture: `${womenPath}10.jpg`, isLeaf: true },
        ]
      },
      { id: '1_1-e', Name: 'Sarah Smith', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
      { id: '1_2-f', Name: 'Greg Peterson', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
    ]
  }];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(orgdata));
}
