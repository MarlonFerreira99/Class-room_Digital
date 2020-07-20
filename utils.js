module.exports = {
  age: function(timestamp) {
    const today = new Date(); //novo objeto de data (dia atual), no qual ira ser criado.
    const birthDate = new Date(timestamp); // novo objeto de data, criado de acordo com o parametro passado pela funcao.

    // 2020 - 1988 = 32
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if(month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
      age = age - 1;
    }
    return age;
  },

  graduation: function(value) {
    switch(value) {
        case ("medio"): return "Ensino Médio Completo"
        case ("superior"): return "Ensino Superior Completo"
        case ("mestre"): return "Mestrado"
        case ("doutor"): return "Doutorado"
    }
  },

  grade: function(value) {
    switch(value) {
      case ("5EF"): return "5º ano do Ensino Fundamental"
      case ("6EF"): return "6º ano do Ensino Fundamental"
      case ("7EF"): return "7º ano do Ensino Fundamental"
      case ("8EF"): return "8º ano do Ensino Fundamental"
      case ("1EM"): return "1º ano do Ensino Médio"
      case ("2EM"): return "2º ano do Ensino Médio"
      case ("3EM"): return "3º ano do Ensino Médio"

    }
  },
  
  date: function(timestamp) {
    const date = new Date(timestamp); // novo objeto de data, criado de acordo com o parametro passado pela funcao.

    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);

    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`
    }
  }

}