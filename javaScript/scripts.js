// studentModal.open = true // funciona para abrir o dialog
// studentModal.open = false// funciona para fechar o dialog
// studentModal.setAttribute('open', true) // funciona para abrir o dialog
// studentModal.setAttribute('open', false) // não funciona para fechar o dialog
// studentModal.removeAttribute('open') funciona para fechar o dialog
// studentModal.showModal() // funciona para abrir o dialog
// studentModal.close() funciona para fechar o dialog

const baseUrl = "http://localhost:3000";

// Passo 1: Selecionar os elementos HTML necessários
const studentModal = document.querySelector("#student-modal");
const studentTable = document.querySelector("#student-table");
const studentForm = document.querySelector("#student-form");
const studentModalTitle = document.querySelector("#student-modal-title");
const saveStudentButton = document.querySelector("#save-student");
// studentModal.showModal()
// Passo 2: Definir função para abrir o modal do estudante
const openStudentModal = () => studentModal.showModal();
const createStudent = () => {
  studentModalTitle.innerHTML = `Novo Aluno`;
  saveStudentButton.innerHTML = "Criar";
  openStudentModal();
  saveStundentData(`${baseUrl}/alunos`, "POST");
};
// Passo 3: Definir função para fechar o modal do estudante
const closeStudentModal = () => studentModal.close();
// Passo 4: Criar uma linha na tabela do estudante
const createStudentTableRow = (id, name, matricula, curso) => {
  const tableTr = document.createElement("tr");
  tableTr.innerHTML = `
    <td>${name}</td>
    <td>${matricula}</td>
    <td>${curso}</td>
    <td align="center">
      <button class="button button--danger" onclick="deleteStudentTable(${id})">Apagar</button>
      <button class="button button--success" onclick="editdStudentModal(${id})"}>Editar</button>
    </td>`;
  studentTable.appendChild(tableTr);
};

const saveStundentData = (url, method) => {
  studentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // capturar os dados do formulário
    const formData = new FormData(studentForm);
    // transformar os dados do formulário em um objeto
    const payload = new URLSearchParams(formData);
    fetch(url, {
      method: method,
      body: payload,
    }).catch((error) => {
      closeStudentModal();
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
  });
};

// Passo 7: Abrir o modal para criar um novo aluno
// Passo 8: Excluir um aluno da tabela
const deleteStudentTable = (id) => {
  fetch(`${baseUrl}/alunos/${id}`, {
    method: "DELETE",
  }).catch((error) => {
    alert("Ocorreu um erro. Tente mais tarde.");
    console.error(error);
  });
};
// Passo 9: Abrir o modal de edição e carregar os dados do aluno
const editdStudentModal = (id) => {
  fetch(`${baseUrl}/alunos/${id}`)
    .then((resp) => resp.json())
    .then((data) => {
      const { nome, matricula, curso } = data;
      studentModalTitle.innerHTML = `Editar Aluno ${nome}`;
      document.querySelector("#nome").value = nome;
      document.querySelector("#matricula").value = matricula;
      document.querySelector("#curso").value = curso;
      saveStudentButton.innerHTML = "Salvar";
      openStudentModal();
      saveStundentData(`${baseUrl}/alunos/${id}`, "PUT");
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
};

// Passo 10: Chamar a função para carregar dados iniciais da tabela ao carregar a página
const loadStudentTable = async () => {
  try {
    const response = await fetch("http://localhost:3000/alunos");
    const data = await response.json();
    data.forEach((student) => {
      createStudentTableRow(
        student.id,
        student.nome,
        student.matricula,
        student.curso
      );
    });
  } catch (error) {
    alert("Ocorreu um erro. Tente mais tarde.");
    console.error(error);
  }
};

const loadStudentTable2 = () => {
  fetch("http://localhost:3000/alunos")
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((student) => {
        // pode ser feito assim também
        // const { nome, matricula, curso } = student;
        createStudentTableRow(
          student.id,
          student.nome,
          student.matricula,
          student.curso
        );
      });
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
};

loadStudentTable();
//--------------------------------------------------------------------------------------------------------------
//CODIGOS REFERENTE A DISCIPLINAS
const disciplinaModal = document.querySelector("#disciplina-modal");
const disciplinaForm = document.querySelector("#disciplina-form");
const disciplinaSubjectList = document.querySelector(".subject-list");
const disciplinaSubjectCardTitle = document.querySelector(".subject-card__title");
const disciplinaModalTitle = document.querySelector("#disciplina-modal-title");
const saveDisciplinaButton = document.querySelector("#save-disciplina");
const getRequiredFields = document.querySelectorAll('.required');


// Passo 2: Definir função para abrir o modal do disciplina
const openDisciplinaModal = () => {
  resetarCssDialog();
  disciplinaModal.showModal();
}
const createDisciplina = () => {
  disciplinaModalTitle.innerHTML = `Nova Disciplina`;
  saveDisciplinaButton.innerHTML = 'Criar';
  openDisciplinaModal();
  saveDisciplinaData(`${baseUrl}/disciplinas`, "POST");
};

// Passo 3: Definir função para fechar o modal da Disciplina
const closeDisciplinaModal = () => disciplinaModal.close();

// Passo 4: Criar um card nas Disciplinas
const createDisciplinaCardRow = (id, nome, cargaHoraria, professor, status, observacos) => {
  const subjectCard = document.createElement("div");
  const tagButton = status === 'Obrigatória' ? 'tag--danger' : 'tag--success';
  subjectCard.className = 'subject-card';
  subjectCard.innerHTML = `
    <h3 class="subject-card__title">${nome}</h3>
    <hr />
    <ul class="subject-card__list">
      <li>Carga Horária: ${cargaHoraria}</li>
      <li>Professor: ${professor}</li>
      <li>Status <span class="tag ${tagButton}">${status}</span></li>
    </ul>
    <p>${observacos}</p> 
    <br>         
    <button class="button button--danger" onclick="deleteDisciplinaCard(${id})">Apagar</button>
    <button class="button button--success" onclick="editdDisciplinaModal(${id})">Editar</button>`;
  disciplinaSubjectList.appendChild(subjectCard);
};



//SALVAR DISCIPLINA
const saveDisciplinaData = (url, method) => {
  disciplinaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // capturar os dados do formulário
    const formData = new FormData(disciplinaForm);
    // transformar os dados do formulário em um objeto
    const payload = new URLSearchParams(formData);

    let validacao = 0;

    getRequiredFields.forEach(field => {
      const fieldName = field.id;
      const fieldValue = field.value.trim();
      const label = document.querySelector(`#${fieldName}Lbl`);


      if (fieldValue.length === 0) {
        if (field.className === 'require') {
          label.textContent = `${label.textContent} é obrigatório`;
          field.className = 'require--danger';
        }
      } else {
        validacao = validacao + 1;
      }
    });

    if (validacao === getRequiredFields.length) {
      console.log(payload);
      fetch(url, {
        method: method,
        body: payload,
      }).catch((error) => {
        closeDisciplinaModal();
        alert("Ocorreu um erro. Tente mais tarde.");
      });
    };
  });
};

//DELETAR A DISCIPLINA
const deleteDisciplinaCard = (id) => {
  fetch(`${baseUrl}/disciplinas/${id}`, {
    method: "DELETE",
  }).catch((error) => {
    alert("Ocorreu um erro. Tente mais tarde.");
  });
};

// Passo 9: Abrir o modal de edição e carregar os dados do aluno
const editdDisciplinaModal = (id) => {
  fetch(`${baseUrl}/disciplinas/${id}`)
    .then((resp) => resp.json())
    .then((data) => {
      const { id, nome, cargaHoraria, professor, status, observacos } = data;
      disciplinaModalTitle.innerHTML = `Editar Disciplina ${nome}`;
      document.querySelector("#nome").value = nome;
      document.querySelector("#cargaHoraria").value = cargaHoraria;
      document.querySelector("#professor").value = professor;
      document.querySelector("#status").value = status;
      document.querySelector("#observacos").value = observacos;
      saveDisciplinaButton.innerHTML = "Salvar";

      openDisciplinaModal();
      saveDisciplinaData(`${baseUrl}/disciplinas/${id}`, "PUT");
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
    });
};

const resetarCssDialog = () => {
  const labelDisciplina = document.querySelector(`#nomeLbl`);
  const labelCargaHoraria = document.querySelector(`#cargaHorariaLbl`);
  const labelProfessor = document.querySelector(`#professorLbl`);
  const labelStatus = document.querySelector(`#statusLbl`);
  const labelObseracoes = document.querySelector(`#observacosLbl`);

  labelDisciplina.textContent = 'Disciplina';
  labelCargaHoraria.textContent = 'Carga Horária';
  labelProfessor.textContent = 'Professor';
  labelStatus.textContent = 'Status';
  labelObseracoes.textContent = 'Observações';

  getRequiredFields.forEach(field => {
    field.className = 'require';
  });

};


// Passo 10: Chamar a função para carregar dados iniciais das Disciplinas a página
const loadDisciplinaCard = () => {
  fetch(`${baseUrl}/disciplinas`)
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((disciplina) => {
        const { id, nome, cargaHoraria, professor, status, observacos } = disciplina;
        createDisciplinaCardRow(
          id,
          nome,
          cargaHoraria,
          professor,
          status,
          observacos
        );
      });
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
};
const obr = 'Obrigatória';
console.log(obr === 'Obrigatória' ? 'Sim' : 'Não');

disciplinaForm.addEventListener('submit', e => {
  e.preventDefault();
});

loadDisciplinaCard();





