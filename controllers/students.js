const fs = require('fs');
const Intl = require('intl');
const data = require('../data.json');
const { date, grade } = require('../utils');

// index
exports.index = function(req, res){
  const studentSchool = [];
  for (i in data.students) {
    let element = grade(data.students[i].school_year);
    studentSchool.push(element);
  }

  return res.render("students/index", {students: data.students, studentSchool });
}

// create
exports.create = function(req, res) {
  return res.render("students/create");
};

// post
exports.post = function(req, res) {
  // req.body
  const keys = Object.keys(req.body);
  // validação dos dados de entrada
  for(key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, you need fill all fields!");
    }
  }

  birth = Date.parse(req.body.birth);

  let id = 1;
  const lastStudent = data.students[data.students.length - 1]

  if (lastStudent) {
    id = lastStudent.id + 1
  }

  // adicionando os dados de entrada no data.json
  data.students.push({
    id,
    birth,
    ...req.body 
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write file error!!");

    return res.redirect(`/students/${id}`);
  })

}

// show
exports.show =function(req, res) {
  // req.params
  const { id } = req.params;

  const foundStudent = data.students.find(function(student) {
    return student.id == id;
  })

  if(!foundStudent) return res.send("Student not found!!");

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).birthDay,
    school_year: grade(foundStudent.school_year)
  }

  return res.render("students/show", { student });
}

// edit
exports.edit = function(req, res) {
  // req.params
  const { id } = req.params;

  const foundStudent = data.students.find(function(student) {
    return student.id == id;
  })

  if(!foundStudent) return res.send("Student not found!!");

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).iso
  }

  return res.render("students/edit", { student });
}

// Update - PUT
exports.update = function(req, res) {
  // req.body
  const { id } = req.body;
  let index = 0;

  const foundStudent = data.students.find(function(student, foundIndex) {
      if(id == student.id) {
        index = foundIndex;
        return true;
      }

  })

  if(!foundStudent) return res.send("Student not found!!");

  const student = {
    ...foundStudent,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.students[index] = student;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write file error!!");

    return res.redirect(`/students/${id}`);

  })
  
}

// delele
exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredStudents = data.students.filter(function(student) {
    return student.id != id;
  })

  data.students = filteredStudents;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write file error!!");

    return res.redirect("/students");

  })
}

