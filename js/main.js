'use strict'

//Lógica do import de funções de arquivo adjacente/especifico para falar com a API
import { lerContatos } from "./contatos.js"
import { criarContato } from "./contatos.js"
import { atualizarContato } from "./contatos.js"
import { deletarContato } from "./contatos.js"

//Declarando os elementos que serão modificados a partir do querySelector que seleciona o primeiro elemento caracterizado com a classe.
const mainView = document.querySelector('main');
const cardsContainer = document.querySelector('#container');
const updateForm = document.querySelector('main > form');

//declarando os inputs que são localizados no formulário.
const inputNome = document.querySelector('#nome');
const inputEmail = document.querySelector('#email');
const inputCelular = document.querySelector('#celular');
const inputEndereco = document.querySelector('#endereco');
const inputCidade = document.querySelector('#cidade');
const imgPreview = document.querySelector('#preview-image');
const inputFile = document.querySelector('#foto');

// declarando os botões que são localizado no formulário.
const btnEditar = document.querySelector('#editar');
const btnDeletar = document.querySelector('#deletar');
const btnSalvar = document.querySelector('#salvar');
const btnCancelar = document.querySelector('#cancelar');

// 1° evento - armazenamento de informações no card.
cardsContainer.addEventListener('click', (event) => {
    //Ao clicar no card, aciona o evento
    const cardClicado = event.target.closest('.card-contato'); //
    if (!cardClicado) {
        //se clicar em qualquer lugar sem ser o card, continua normal
        return; 
    }

    //Aqui serão guardados as informações anteriormente salvas ao cadastrar o usuário.
    const id = cardClicado.dataset.id; //pegamos o id que foi atribuido
    const nome = cardClicado.querySelector('h2').textContent; //O texto que foi escrito
    const celular = cardClicado.querySelector('p').textContent; //O numero que foi escrito
    const email = cardClicado.dataset.email //o email
    const endereco = cardClicado.dataset.endereco //endereço
    const cidade = cardClicado.dataset.cidade //cidade

    //atribuimos as const que guardam os valores que foram pegos do card ao input do formulário que nos utilizamos.
    inputNome.value = nome; //ficará o valor do nome antigo atributido
    inputCelular.value = celular; //o valor do celular
    inputEmail.value = email //o valor do email
    inputEndereco.value = endereco //o valor do endereço
    inputCidade.value = cidade //o valor da cidade informado;

    updateForm.dataset.editingId = id; //Ao utilizarmos o formulário, ele guardará em um data-editingId o id que estava armazenado.

    
    mainView.classList.replace('card-show', 'form-show'); //Trocamos novamente a classe do main, de card-show para form-show
});

//Botão de deletar, ao ser acionado.
btnDeletar.addEventListener('click', () => {
    //primeiramente, aqui pegamos a const id que estava armazenada no formulario atualizado que receberá o valor antigo.
    const id = updateForm.dataset.editingId;
    //Condicional para que caso o usuário não tenha certeza que quer ou não apagar o contato em especifico.
    if (confirm('Tem certeza?')) {
        //O then funciona para funções assincronas. Ele é como um callback de sucesso: Exemplo(Se essa função for acionada corretamente faça[...])
        deletarContato(id).then(() => {
            //Entra-se no container, seleciona o id do card, e remove ele (apagando o mesmo)
            cardsContainer.querySelector(`[data-id="${id}"]`).remove();
            //Volta-se para a visualização dos card.
            mainView.classList.replace('form-show', 'card-show');
        });
    }
});

// Botão SALVAR (para ATUALIZAR)
btnSalvar.addEventListener('click', () => {
    const id = updateForm.dataset.editingId;

    // Pega os dados ATUALIZADOS do formulário
    const dadosAtualizados = {
        nome: inputNome.value,
        email: inputEmail.value,
        celular: inputCelular.value,
        endereco: inputEndereco.value,
        cidade: inputCidade.value,
        // foto: ... (lógica do input file é mais complexa)
    };

    atualizarContato(id, dadosAtualizados).then(() => {
        // Atualiza o card na tela
        const card = cardsContainer.querySelector(`[data-id="${id}"]`);
        card.querySelector('.card-nome').textContent = dadosAtualizados.nome;
        card.querySelector('.card-celular').textContent = dadosAtualizados.celular;
        // ...
        
        // Volta pra tela de cards
        mainView.classList.replace('form-show', 'card-show');
    });
});

// Botão CANCELAR
btnCancelar.addEventListener('click', () => {
    // Apenas volta para a tela de cards
    mainView.classList.replace('form-show', 'card-show');
});

// Criação dos cards.
function mostrarCards(listaDeContatos){
    //Pegando o elemento container
    const container = document.getElementById('container')
    //Criando um forEach para criar uma repetição de criação de cards caso haja os dados
    listaDeContatos.forEach(contato =>{
        //Criando o elemento, adicionando a classe e por fim adicionando os dataset para ter dados acoplados que mesmo que não sejam visiveis, possam ser utilizados.
        const cardContato = document.createElement('div')
        cardContato.classList.add('card-contato')
        cardContato.dataset.id = contato.id
        cardContato.dataset.email = contato.email
        cardContato.dataset.endereco = contato.endereco
        cardContato.dataset.cidade = contato.cidade

        //Aqui para o elemento da imagem, caso não tenha a foto, assume uma foto padrão;
        const imagemContato = document.createElement('img')
        imagemContato.src = contato.foto || '../img/avatar1.avif'

        //Criando a parte do nome, para que se aplique. Caso não haja um nome:  atribui o argumento "Não Encontrado."
        const nomeContato = document.createElement('h2')
        nomeContato.textContent = contato.nome || 'Não encontrado'

        //Numero de contato, em resumo para mostrar o numero.
        const numeroContato = document.createElement('p')
        numeroContato.textContent = contato.celular 
            
        //Atribuindo e juntando como pai e filhos.
            cardContato.appendChild(imagemContato)
            cardContato.appendChild(nomeContato)
            cardContato.appendChild(numeroContato)

            container.appendChild(cardContato)
    })
}

//Aplicação da função para mostrar o formulário para o usuário.
function mostrarFormulario() {
    
    const adicionarContato = document.getElementById('novo-contato');
    
    const mainElement = document.querySelector('main');
    //Em resumo, pega o elemento do botão, pego o main, utilizo uma função de evento para click e por fim faço uma troca
    adicionarContato.addEventListener('click', function() {
        
        mainElement.classList.toggle('card-show');
        mainElement.classList.toggle('form-show');
    });

    //mesma coisa, só que nesse caso: O caso do 
    const botaoCancelar = document.getElementById('cancelar');
    botaoCancelar.addEventListener('click', function(){
        mainElement.classList.replace('form-show', 'card-show')
    });
}

async function cadastrarUsuario(cadastro){
    const nomeInput = document.getElementById('nome')
    nomeInput.placeholder = 'digite seu nome'
    nomeInput.maxLength = '100'
    nomeInput.required = true

    const emailInput = document.getElementById('email')
    emailInput.placeholder = 'digite seu email'
    emailInput.required = true
    emailInput.disabled = true

    const celularInput = document.getElementById('celular')
    celularInput.placeholder = 'digite seu numero'
    celularInput.required = true
    celularInput.disabled = true

    const enderecoInput = document.getElementById('endereco')
    enderecoInput.placeholder = 'digite seu endereco'
    enderecoInput.disabled = true

    const cidadeInput = document.getElementById('cidade')
    cidadeInput.disabled = true

    nomeInput.addEventListener('input', function(){
        if(nomeInput.checkValidity()){
            emailInput.disabled = false
        } else {
            emailInput.disabled = true
        }
    })
    emailInput.addEventListener('input', function(){
        if(emailInput.checkValidity()){
        celularInput.disabled = false
            enderecoInput.disabled = false
            cidadeInput.disabled = false
        } else{
            celularInput.disabled = true
            enderecoInput.disabled = true
            cidadeInput.disabled = true
        }
    })

    const botaoSalvar = document.getElementById('salvar')
    const form = document.querySelector('main form')

    botaoSalvar.addEventListener('click', async function(){
        const nomeInput = document.getElementById('nome')
        const emailInput = document.getElementById('email')
        const celularInput = document.getElementById('celular')
        const enderecoInput = document.getElementById('endereco')
        const cidadeInput = document.getElementById('cidade')
        const fotoInput = document.getElementById('foto')

        if(!form.checkValidity()){
            alert("Escreva todos os campos obrigatório")
            form.reportValidity()
            return
        }
    

    const formularioEnviado = {
        "nome": nomeInput.value,
        "celular": celularInput.value,
        "foto": fotoInput.value,
        "email": emailInput.value,
        "endereco": enderecoInput.value,
        "cidade": cidadeInput.value
    }

    const sucesso = await criarContato(formularioEnviado)

    if (sucesso) {
        alert('Contato cadastrado com sucesso!');
        form.reset(); // Limpa o formulário

        // Volta para a tela de cards
        const mainElement = document.querySelector('main');
        mainElement.classList.remove('form-show');
        mainElement.classList.add('card-show');

        // ATUALIZA A LISTA: Recarrega os contatos e mostra os cards
        const contatosAtualizados = await lerContatos();
        document.getElementById('container').innerHTML = ''; // Limpa os cards antigos
        mostrarCards(contatosAtualizados); // Mostra a lista atualizada

    } else {
        alert('Erro ao cadastrar o contato. Tente novamente.');
    }
})
}

async function attcontatos (){

}

async function apagarContato(id){

}

const contatos = await lerContatos()


mostrarCards(contatos)
mostrarFormulario()
cadastrarUsuario()

