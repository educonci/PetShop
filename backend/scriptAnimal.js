// POST CRIAR ANIMAIS

// FUNÇÃO QUE PEGA O VALOR DOS INPUTS E DO SELECT DIRETAMENTE
// DO HTML E AGRUPA DO BODY DO POST, QUE INSERE ESSAS INFORMAÇÕES
// NA TABLE DE ANIMAIS COMO UMA NOVA ROW, RECEBENDO UM ERRO CASO
// ACONTEÇA ALGO DE ERRADO NA REQUISIÇÃO E RESETANDO O FORMULARIO 
// CASO DE TUDO CERTO.

document.getElementById('animalForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('animalName').value;
    const idade = document.getElementById('animalAge').value;
    const tipo = document.getElementById('animalType').value;
    const donos = document.getElementById('donos').value;

    const data = { nome, idade, tipo, donos };

    try {
        const response = await fetch('http://localhost:3000/animais/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            document.getElementById('animalForm').reset();
            listarAnimalNames();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        alert('Erro ao cadastrar animal:', error);
    }
})

// GET NOMES DOS CLIENTES PARA SELECT

// FUNÇÃO QUE PEGA OS NOMES DE TODOS OS CLIENTES
// NA TABELA DE CLIENTE E CRIA UMA TAG DE OPTION
// PARA CADA UM DENTRO DO SELECT RESPONSÁVEL PELA
// SELEÇÃO DE UM DONO NA HORA DE CADASTRAR UM ANIMAL.

async function listarClientes() {
    try {
        const response = await fetch('http://localhost:3000/clientes/listar'); // Faz a requisição para o backend
        const clientes = await response.json(); // Converte a resposta em JSON

        const selectDono = document.getElementById('donos'); // ID do <select>
        selectDono.innerHTML = ''; // Limpa as opções existentes

        if (clientes.length > 0) {
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione um cliente';
            selectDono.appendChild(optionDefault);

            // Adiciona cada cliente como uma opção
            clientes.forEach((cliente) => {
                const option = document.createElement('option');
                option.value = cliente.nome; // Valor da opção será o nome do cliente
                option.textContent = cliente.nome; // Texto exibido
                selectDono.appendChild(option);
            });
        } else {
            // Caso não existam clientes
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum cliente cadastrado';
            selectDono.appendChild(option);
        }
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
    }
}

listarClientes();


let ids;
let idAtual

// GET NOMES DOS ANIMAIS

// FUNÇÃO QUE PEGA OS NOMES DE TODOS OS ANIMAIS
// DA TABELA E AGRUPA EM UMA LISTA, DEPOIS, PARA CADA
// NOME DENTRO DELA, RENDERIZA UM ELEMENTO HTML QUE EXIBE
// O NOME E PERMITE EDITAR O STYLE.

async function listarAnimalNames() {
    try {
        const response = await fetch('http://localhost:3000/animais/listarNames');

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const nomes = await response.json(); // Converte a resposta para JSON
        const listaContainer = document.getElementById('lista-nomes'); // Container para os nomes

        // Remove elementos anteriores (caso exista)
        listaContainer.innerHTML = '';

        nomes.forEach(nome => {
            const item = document.createElement('div');
            item.classList.add('animal')
            item.textContent = nome.nome;

            const subDiv = document.createElement('div');
            subDiv.classList.add('info');

            item.appendChild(subDiv);
            listaContainer.appendChild(item); // Adiciona o elemento à lista
        });

        const editButtons = document.querySelectorAll('.info');
        const modalBG = document.querySelector('.modalBG');
        const modal = document.querySelector('.modal');

        editButtons.forEach((button, index) => {
            button.addEventListener('click', () => {

                // GET ID DOS ANIMAIS

                // FUNÇÃO QUE PEGA O NOME DO ANIMAL QUE VAMOS EDITAR
                // E O USA DE FATOR PARA ENCONTRAR O ID DO MESMO, JÁ
                // TODOS OS NOMES SÃO ÚNICOS.

                async function getID() {
                    try {
                        const data = nomes[index].nome;
                        const response = await fetch(`http://localhost:3000/animais/getID?nome=${(data)}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        });
                        ids = await response.json();
                        idAtual = ids[0].id
                        await getIDinfo()
                    } catch (error) {
                        console.error('Erro ao pegar ID:', error);
                    }
                }
                getID();
                modal.style.filter = 'blur(0vi)'
                modalBG.style.opacity = '1';
                modalBG.style.zIndex = '10';
            });
        });

        const closeModal = document.querySelector('.close');
        closeModal.addEventListener('click', () => {
            modal.style.filter = ''
            modalBG.style.opacity = ''
            modalBG.style.zIndex = ''

            console.log('informações', informa)
        })

    } catch (error) {
        console.error('Erro ao listar animais:', error);
    }
}

listarAnimalNames();

const editName = document.getElementById('editName')
const editAge = document.getElementById('editAge')
const editType = document.getElementById('editType')
const editDonos = document.getElementById('editDonos')
let informa

// GET INFORMAÇÕES DOS ANIMAIS

// FUNÇÃO QUE PUXA AS TODAS AS INFORMAÇÕES DE UM ID ESPECÍFICO
// (DEFINIDO QUANDO CLICADO NO BOTÃO DE EDITAR) E AGRUPA
// NA VARIÁVEL INFORMA, DEPOIS, CHAMA A FUNÇÃO AJUSTARMODAL().

async function getIDinfo() {
    try {
        const response = await fetch(`http://localhost:3000/animais/getIDinfo?id=${encodeURIComponent(idAtual)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        informa = await response.json();
        ajustarModal()
        console.log('Informações do animal:', informa);
    } catch (error) {
        console.error('Erro ao pegar informações do ID:', error);
    }
}

// AJUSTAR MODAL

// FUNÇÃO QUE AJUSTA AS INFORMAÇÕES EXIBIDAS NO MODAL
// DE EDIÇÃO DE CLIENTE, DEFININDO O VALOR DOS INPUTS
// COM BASE NAS INFORMAÇÕES CONTIDAS EM INFORMA.

async function ajustarModal() {
    try {
        const response = await fetch('http://localhost:3000/clientes/listar'); // Faz a requisição para o backend
        const clientes = await response.json(); // Converte a resposta em JSON

        const selectDono = document.getElementById('editDonos'); // ID do <select>
        selectDono.innerHTML = ''; // Limpa as opções existentes

        if (clientes.length > 0) {
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione um cliente';
            selectDono.appendChild(optionDefault);

            clientes.forEach((cliente) => {
                const option = document.createElement('option');
                option.value = cliente.nome;
                option.textContent = cliente.nome;

                if (cliente.nome === informa[0].nome_dono) {
                    option.selected = true;
                }

                selectDono.appendChild(option);
            });
        } else {
            // Caso não existam clientes
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum cliente cadastrado';
            selectDono.appendChild(option);
        }
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
    }

    editName.value = informa[0].nome;
    editAge.value = informa[0].idade;
    editType.value = informa[0].tipo;
    editDonos.value = informa[0].nome_dono;
}

// POST EDITAR ANIMAL

// FUNÇÃO QUE PEGA O VALOR DOS INPUTS DO MODAL DE EDIÇÃO
// E DÁ UM UPDATE NA TABELA DE ANIMAIS ONDE LOCALIZAR O
// O MESMO ID DO ANIMAL QUE ESTA SENDO EDITADO, MUDANDO
// OS VALORES DAS COLUNAS PARA OQUE ESTIVER ESCRITO NO MODAL.

document.getElementById('editForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const valorEditName = editName.value
    const valorEditAge = editAge.value
    const valorEditType = editType.value
    const valorEditDonos = editDonos.value

    const data = { valorEditName, valorEditAge, valorEditType, valorEditDonos, idAtual };

    try {
        const response = await fetch('http://localhost:3000/animais/editAnimal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            listarAnimalNames();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        alert('Erro ao cadastrar animal:', error);
    }
})

const modalBG = document.querySelector('.modalBG');
const modal = document.querySelector('.modal');

// POST DELETAR ANIMAL

// FUNÇÃO QUE USA O VALOR DE UM ID ESPECÍFICO
// PARA DELETAR A ROW A QUAL ELE PERTENCE 
// (LOGO DELETANDO O ANIMAL)

document.getElementById('delete').addEventListener('click', async (event) => {
    event.preventDefault();

    const data = { idAtual };

    try {
        const response = await fetch('http://localhost:3000/animais/deleteAnimal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            listarAnimalNames();
            modal.style.filter = ''
            modalBG.style.opacity = ''
            modalBG.style.zIndex = ''
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        alert('Erro ao deletar animal:', error);
    }
})