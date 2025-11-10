'use strict'

import { lerContatos } from "./contatos.js"
import { criarContato } from "./contatos.js"

function mostrarCards(listaDeContatos){

    const container = document.getElementById('container')

    listaDeContatos.forEach(contato =>{

        const cardContato = document.createElement('div')
        cardContato.classList.add('card-contato')

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

    const celularInput = document.getElementById('celular')
    celularInput.placeholder = 'digite seu numero'
    celularInput.pattern = '\d{11}'
    celularInput.required = true
    celularInput.disabled = true

    const enderecoInput = document.getElementById('endereco')
    enderecoInput.placeholder = 'digite seu endereco'
    enderecoInput.disabled = true

    const cidadeInput = document.getElementById('cidade')
    cidadeInput.disabled = true

    nomeInput.addEventListener('input', function(){
        if(nomeInput.checkValidity() && emailInput.checkValidity()){
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

const contatos = await lerContatos()


mostrarCards(contatos)
mostrarFormulario()
cadastrarUsuario()

