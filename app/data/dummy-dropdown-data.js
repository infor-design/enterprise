const data = import('../src/js/get-junk-dropdown-data');

export default function dummyData(req, res) {
  res.json(data);
}
