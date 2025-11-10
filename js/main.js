'use strict'

import { lerContatos } from "./contatos.js"

function mostrarCards(){

const container = document.getElementById('container')
const caminhoImagem = '../img/'

container.forEach(func =>{

const cardContato = document.createElement('div')
cardContato.classList.add('card-contato')

const imagemContato = document.createElement('img')
imagemContato.src = caminhoImagem + func.imagem

const nomeContato = document.createElement('h2')
nomeContato.textContent = func.nome

const numeroContato = document.createElement('p')
numeroContato.textContent = func.celular

container.appendChild(cardContato)
container.appendChild(imagemContato)
container.appendChild(nomeContato)
container.appendChild(numeroContato)



})
}
console.log(await lerContatos())

