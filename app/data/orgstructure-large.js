module.exports = (req, res) => {
  const menPath = `${res.opts.basepath}images/`;
  const womenPath = `${res.opts.basepath}images/`;
  const orgdata = [{
    id: '1',
    Name: 'Jonathan Cargill',
    Position: 'Director',
    EmploymentType: 'FT',
    Picture: `${menPath}21.jpg`,
    children: [
      { id: '1_1', Name: 'Partricia Clark', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
      { id: '1_2', Name: 'Drew Buchanan', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },

      { id: '1_1-a', Name: 'One', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
      { id: '1_2-b', Name: 'Two', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
      { id: '1_1-c', Name: 'Three', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
      { id: '1_2-d', Name: 'Four', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },
      { id: '1_1-e', Name: 'Five', Position: 'Administration', EmploymentType: 'FT', Picture: `${womenPath}4.jpg`, isLeaf: true },
      { id: '1_2-f', Name: 'Six', Position: 'Assistant Director', EmploymentType: 'FT', Picture: `${menPath}5.jpg`, isLeaf: true },

      {
        id: '1_3',
        Name: 'Kaylee Edwards',
        Position: 'Records Manager',
        EmploymentType: 'FT',
        Picture: `${womenPath}11.jpg`,
        children: [
          { id: '1_3_1', Name: 'Tony Cleveland', Position: 'Records Clerk', EmploymentType: 'C', Picture: `${menPath}6.jpg`, isLeaf: true },
          { id: '1_3_2', Name: 'Julie Dawes', Position: 'Records Clerk', EmploymentType: 'PT', Picture: `${womenPath}5.jpg`, isLeaf: true },
          { id: '1_3_3', Name: 'Richard Fairbanks', Position: 'Records Clerk', EmploymentType: 'FT', Picture: `${menPath}7.jpg`, isLeaf: true }
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
          { id: '1_4_3', Name: 'Jessica Peterson', Position: 'Employment Specialist', EmploymentType: 'FT', Picture: `${womenPath}7.jpg`, isLeaf: true },
          { id: '1_4_4', Name: 'Sarah Lee', Position: 'HR Specialist', EmploymentType: 'FT', Picture: `${womenPath}8.jpg`, isLeaf: true },
          { id: '1_4_5', Name: 'Jacob Williams', Position: 'HR Specialist', EmploymentType: 'FT', Picture: `${menPath}9.jpg`, isLeaf: true }
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
          { id: '1_5_4', Name: 'Michelle Bell', Position: 'Software Engineer', EmploymentType: 'PT', Picture: `${womenPath}11.jpg`, isLeaf: true },
          { id: '1_5_5', Name: 'Dave Davidson', Position: 'Software Engineer', EmploymentType: 'FT', Picture: `${menPath}10.jpg`, isLeaf: true }
        ]
      },
      {
        id: '1_6',
        Name: 'Amber Carter',
        Position: 'Library Manager',
        EmploymentType: 'FT',
        Picture: `${womenPath}2.jpg`,
        children: [
          { id: '1_6_1', Name: 'Hank Cruise', Position: 'Law Librarian', EmploymentType: 'C', Picture: `${menPath}11.jpg`, isLeaf: true },
          { id: '1_6_2', Name: 'Peter Craig', Position: 'Law Librarian', EmploymentType: 'FT', Picture: `${menPath}12.jpg`, isLeaf: true }
        ]
      },
      {
        id: '1_7',
        Name: 'Mary Butler',
        Position: 'Workers’ Compensation Manager',
        EmploymentType: 'FT',
        Picture: `${womenPath}3.jpg`,
        children: [
          { id: '1_7_1', Name: 'Katie Olland', Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: `${womenPath}12.jpg`, isLeaf: true },
          { id: '1_7_2', Name: 'Tanya Wright', Position: 'Workers’ Compensation Specialist', EmploymentType: 'FT', Picture: `${womenPath}13.jpg`, isLeaf: true },
          { id: '1_7_3', Name: 'OPEN', Position: 'Workers’ Compensation Specialist', EmploymentType: 'O', isLeaf: true }
        ]
      }
    ]
  }];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(orgdata));
};
