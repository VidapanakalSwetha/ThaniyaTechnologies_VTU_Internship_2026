let students = [
  { id: 1, name: "Swetha" },
  { id: 2, name: "Bharath" }
];

const getStudents = (req, res) => {
  res.json(students);
};

const addStudent = (req, res) => {
  const newStudent = req.body;
  students.push(newStudent);
  res.json({ message: "Student added", student: newStudent });
};

const deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);
  students = students.filter(student => student.id !== id);
  res.json({ message: "Student deleted" });
};

module.exports = { getStudents, addStudent, deleteStudent };