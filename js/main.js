'use strict'

import { lerContatos } from "./contatos.js"
import { criarContato } from "./contatos.js"
import { atualizarContato } from "./contatos.js"
import { deletarContato } from "./contatos.js"

const mainView = document.querySelector('main');
const cardsContainer = document.querySelector('#container');
const updateForm = document.querySelector('main > form');


const inputNome = document.querySelector('#nome');
const inputEmail = document.querySelector('#email');
const inputCelular = document.querySelector('#celular');
const inputEndereco = document.querySelector('#endereco');
const inputCidade = document.querySelector('#cidade');
const imgPreview = document.querySelector('#preview-image');
const inputFile = document.querySelector('#foto');


const btnEditar = document.querySelector('#editar');
const btnDeletar = document.querySelector('#deletar');
const btnSalvar = document.querySelector('#salvar');
const btnCancelar = document.querySelector('#cancelar');


cardsContainer.addEventListener('click', (event) => {

    const cardClicado = event.target.closest('.card-contato');
    if (!cardClicado) {
        return; 
    }

    const id = cardClicado.dataset.id;
    const nome = cardClicado.querySelector('h2').textContent; 
    const celular = cardClicado.querySelector('p').textContent;
    const email = cardClicado.dataset.email
    const endereco = cardClicado.dataset.endereco
    const cidade = cardClicado.dataset.cidade

    
    inputNome.value = nome;
    inputCelular.value = celular;
    inputEmail.value = email
    inputEndereco.value = endereco
    inputCidade.value = cidade

    updateForm.dataset.editingId = id;

    
    mainView.classList.replace('card-show', 'form-show');
});

btnDeletar.addEventListener('click', () => {
    const id = updateForm.dataset.editingId;
    if (confirm('Tem certeza?')) {
        deletarContato(id).then(() => {
            cardsContainer.querySelector(`[data-id="${id}"]`).remove();
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


function mostrarCards(listaDeContatos){

    const container = document.getElementById('container')

    listaDeContatos.forEach(contato =>{

        const cardContato = document.createElement('div')
        cardContato.classList.add('card-contato')
        cardContato.dataset.id = contato.id
        cardContato.dataset.email = contato.email
        cardContato.dataset.endereco = contato.endereco
        cardContato.dataset.cidade = contato.cidade

        const imagemContato = document.createElement('img')
        imagemContato.src = contato.foto || '../img/avatar1.avif'

        const nomeContato = document.createElement('h2')
        nomeContato.textContent = contato.nome || 'Não encontrado'

        const numeroContato = document.createElement('p')
        numeroContato.textContent = contato.celular 
            
            cardContato.appendChild(imagemContato)
            cardContato.appendChild(nomeContato)
            cardContato.appendChild(numeroContato)

            container.appendChild(cardContato)
    })
}

function mostrarFormulario() {
    
    const adicionarContato = document.getElementById('novo-contato');
    
    const mainElement = document.querySelector('main');

    adicionarContato.addEventListener('click', function() {
        
        mainElement.classList.toggle('card-show');
        mainElement.classList.toggle('form-show');
    });

    const botaoCancelar = document.getElementById('cancelar');
    botaoCancelar.addEventListener('click', function(){
        mainElement.classList.toggle('card-show');
        mainElement.classList.toggle('form-show');
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

