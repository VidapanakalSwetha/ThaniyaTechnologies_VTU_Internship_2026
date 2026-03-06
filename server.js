const express = require("express")
const app = express()

app.use(express.json())

let students = [
  { id: 1, name: "Swetha", course: "ECE" },
  { id: 2, name: "Vidhya", course: "ECE" },
  { id: 3, name: "Rahul", course: "CSE" }
];


app.get("/students", (req, res) => {
    res.send(students)
})


app.post("/students", (req, res) => {

    const id = req.body.id
    const name = req.body.name
    const course = req.body.course

    const student = {
        id: id,
        name: name,
        course: course
    }

    students.push(student)

    res.send("Student added successfully")
})


app.put("/students/:id", (req, res) => {

    const id = parseInt(req.params.id)

    const student = students.find(s => s.id === id)

    if(student){
        student.name = req.body.name
        student.course = req.body.course

        res.send("Student updated")
    }
    else{
        res.send("Student not found")
    }

})


app.delete("/students/:id", (req, res) => {

    const id = parseInt(req.params.id)

    students = students.filter(s => s.id !== id)

    res.send("Student deleted")

})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})