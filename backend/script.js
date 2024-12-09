const header = document.querySelector('.header_js')

window.addEventListener('scroll', ()=> {
    scroll = pageYOffset

    if (scroll >= 100) {
        header.style.backgroundColor = '#dde8ee'
    } else{
        header.style.backgroundColor = ''
    }


    console.log(scroll)
})

let ids;
let idAtual

// GET NOMES DOS CLIENTES

// FUNÇÃO QUE PEGA OS NOMES DE TODOS OS CLIENTES
// DA TABELA E AGRUPA EM UMA LISTA, DEPOIS, PARA CADA
// NOME DENTRO DELA, RENDERIZA UM ELEMENTO HTML QUE EXIBE
// O NOME E PERMITE EDITAR O STYLE.

async function listarClientNames() {
    try {
        const response = await fetch('http://localhost:3000/cliente/listarNames');

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

                // GET ID DOS CLIENTES

                // FUNÇÃO QUE PEGA O NOME DO CLIENTE QUE VAMOS EDITAR
                // E O USA DE FATOR PARA ENCONTRAR O ID DO MESMO, JÁ
                // TODOS OS NOMES SÃO ÚNICOS.

                async function getID() {
                    try {
                        const data = nomes[index].nome;
                        const response = await fetch(`http://localhost:3000/cliente/getID?nome=${(data)}`, {
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

listarClientNames();

const editName = document.getElementById('editName')
const editNumber = document.getElementById('editNumber')
const editAdress = document.getElementById('editAdress')
let informa

// GET INFORMAÇÕES DOS CLIENTES

// FUNÇÃO QUE PUXA AS TODAS AS INFORMAÇÕES DE UM ID ESPECÍFICO
// (DEFINIDO QUANDO CLICADO NO BOTÃO DE EDITAR) E AGRUPA
// NA VARIÁVEL INFORMA, DEPOIS, CHAMA A FUNÇÃO AJUSTARMODAL().


async function getIDinfo() {
    try {
        const response = await fetch(`http://localhost:3000/cliente/getIDinfo?id=${encodeURIComponent(idAtual)}`, {
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
    editName.value = informa[0].nome;
    editNumber.value = informa[0].telefone;
    editAdress.value = informa[0].endereco;
}

// POST EDITAR CLIENTES

// FUNÇÃO QUE PEGA O VALOR DOS INPUTS DO MODAL DE EDIÇÃO
// E DÁ UM UPDATE NA TABELA DE CLIENTE ONDE LOCALIZAR O
// O MESMO ID DO USUÁRIO QUE ESTA SENDO EDITADO, MUDANDO
// OS VALORES DAS COLUNAS PARA OQUE ESTIVER ESCRITO NO MODAL.

document.getElementById('editForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const valorEditName = editName.value
    const valorEditNumber = editNumber.value
    const valorEditAdress = editAdress.value

    const data = { valorEditName, valorEditNumber, valorEditAdress, idAtual };

    try {
        const response = await fetch('http://localhost:3000/cliente/editClient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            listarClientNames();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {

        alert('Erro ao cadastrar CLIENTE:', error);
    }
})

// POST CRIAR CLIENTES

// FUNÇÃO QUE PEGA O VALOR DOS INPUTS DIRETAMENTE
// DO HTML, AGRUPA DO BODY DO POST, QUEINSERE ESSAS INFORMAÇÕES
// NA TABLE DE CLIENTES COMO UMA NOVA ROW, RECEBENDO UM ERRO CASO
// ACONTEÇA ALGO DE INESPERADO NA REQUISIÇÃO, RESETANDO O FORMULARIO 
// CASO DE CERTO.

document.getElementById('clienteForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('clientName').value;
    const telefone = document.getElementById('clientNumber').value;
    const endereco = document.getElementById('clientAdress').value;

    const data = { nome, telefone, endereco };
    console.log('data', data)

    try {
        const response = await fetch('http://localhost:3000/cliente/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            document.getElementById('clienteForm').reset();
            listarClientNames(); // Atualiza a lista
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        console.log('Erro ao cadastrar Cliente:');
    }
})

const modalBG = document.querySelector('.modalBG');
const modal = document.querySelector('.modal');

// POST DELETAR CLIENTE

// FUNÇÃO QUE USA O VALOR DE UM ID ESPECÍFICO
// PARA DELETAR A ROW A QUAL ELE PERTENCE 
// (LOGO DELETANDO O CLIENTE)

document.getElementById('delete').addEventListener('click', async (event) => {
    event.preventDefault();

    const data = { idAtual };

    try {
        const response = await fetch('http://localhost:3000/cliente/deleteClient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            listarClientNames();
            modal.style.filter = ''
            modalBG.style.opacity = ''
            modalBG.style.zIndex = ''
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        alert('Erro ao deletar CLIENTE:', error);
    }
})