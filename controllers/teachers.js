const fs = require('fs');
const Intl = require('intl');
const data = require('../data.json');
const { age, graduation, date } = require('../utils');

// index
exports.index = function(req, res){
  const listedTeachers = data.teachers;

  for (const teacher of listedTeachers) {
    const service = teacher.services.toString().split(',');
    teacher.services = service;
  }

  return res.render("teachers/index", {teachers: listedTeachers });
}

// create
exports.create = function(req, res) {
  return res.render("teachers/create");
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

  // Tratamento dos dados entrada
  let {avatar_url, name, birth, degree, class_type, services } = req.body;

  birth = Date.parse(birth);
  const created_at = Date.now();
  const id = Number (data.teachers.length + 1);

  // adicionando os dados de entrada no data.json
  data.teachers.push({
    id,
    name,
    avatar_url,
    birth,
    degree,
    class_type,
    services,
    created_at,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write file error!!");

    return res.redirect("/teachers");
  })

  // return res.send(req.body);
}

// show
exports.show =function(req, res) {
  // req.params
  const { id } = req.params;

  const foundTeacher = data.teachers.find(function(teacher) {
    return teacher.id == id;
  })

  if(!foundTeacher) return res.send("Teacher not found!!");

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    degree: graduation(foundTeacher.degree),
    services: foundTeacher.services.toString().split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at),
  }

  return res.render("teachers/show", { teacher });
}

// edit
exports.edit = function(req, res) {
  // req.params
  const { id } = req.params;

  const foundTeacher = data.teachers.find(function(teacher) {
    return teacher.id == id;
  })

  if(!foundTeacher) return res.send("Teacher not found!!");

  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth).iso
  }

  return res.render("teachers/edit", { teacher });
}

// Update - PUT
exports.update = function(req, res) {
  // req.body
  const { id } = req.body;
  let index = 0;

  const foundTeacher = data.teachers.find(function(teacher, foundIndex) {
      if(id == teacher.id) {
        index = foundIndex;
        return true;
      }

  })

  if(!foundTeacher) return res.send("Teacher not found!!");

  const teacher = {
    ...foundTeacher,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id)
  }

  data.teachers[index] = teacher;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write file error!!");

    return res.redirect(`/teachers/${id}`);

  })
  
}

// delele
exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredTeachers = data.teachers.filter(function(teacher) {
    return teacher.id != id;
  })

  data.teachers = filteredTeachers;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write file error!!");

    return res.redirect("/teachers");

  })
}

