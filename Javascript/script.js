const localStorageKey = 'ControleFinanceiroBernardo'
let saldoAtual = document.getElementById("saldoAtual")
let receitas = document.getElementById("receitas")
let despesas  = document.getElementById("despesas")
let ul = document.getElementById("ul")

const inputNome = document.getElementById("idNome")
const inputValor = document.getElementById("idValor")
const form = document.querySelector(".form")
let values = JSON.parse(localStorage.getItem(localStorageKey) || '[]')

form.addEventListener("submit", adicionarValores)

const formatCurrency = (value, currency) => {
    return value.toLocaleString('pt-br', {
      style: 'currency',
      currency
    });
};

const setFormatCurrencyBrl = num => formatCurrency(Math.abs(num), 'BRL')

const acharDespesa = array => 
    array.reduce((acc, { valor }) => {
        if (valor < 0) {
            acc += Number(valor)
        }
        return acc
    }, 0)

const acharReceita = array => 
    array.reduce((acc, { valor }) => {
        if (valor > 0) {
            acc += Number(valor)
        }
        return acc
    }, 0)

const acharSaldoAtual = array => array.reduce((acc, { valor }) => {
    acc += Number(valor)
    return acc
}, 0)

const infoGlobal = (array) => {
    receitas.innerHTML = setFormatCurrencyBrl(acharReceita(array))
    saldoAtual.innerHTML = verificarPositivoNegativo(acharSaldoAtual(array), saldoAtual) + setFormatCurrencyBrl(acharSaldoAtual(array))
    despesas.innerHTML = setFormatCurrencyBrl(acharDespesa(array))
}

function verificarPositivoNegativo (value, lista) {
    if (value >= 0) {
        lista.classList.add("positivo")
        return ""
    } else {
        lista.classList.add("negativo")
        return "-"
    }
}

function adicionarValores(e) {
    e.preventDefault()
    let li = document.createElement('li')
    const lastValueId = Number(values.length)+1
    li.innerHTML = `<button class="btnRemove">X</button>
                    <p>${inputNome.value}</p>
                    <p>${verificarPositivoNegativo(inputValor.value, li)} ${setFormatCurrencyBrl(inputValor.value)}</p>
                    <p class="idDoItem">${lastValueId}</p>`

    li.classList.add('transacoes')
    ul.prepend(li)
    btnRemove()

    values.push({
        id: values.length == 0 ? 1 : lastValueId, 
        nome: inputNome.value, 
        valor: inputValor.value
    })
    localStorage.setItem(localStorageKey, JSON.stringify(values)) 
    infoGlobal(values)
    limparInput()
}

const limparInput = () => {
    inputNome.value = "";
    inputValor.value = "";
}

function excluirTransacao(target) {
    const targetElement = target.target
    const parentElement = targetElement.closest('li')
    const parentChild = parentElement.children[3].textContent

    let newArray = values.filter(({id}) => id != parentChild)

    window.location.reload()
    percorrerArray(newArray)
    localStorage.clear()
    localStorage.setItem(localStorageKey, JSON.stringify(newArray))
}

function mostrarControle() {
    percorrerArray(values)
    localStorage.setItem(localStorageKey, JSON.stringify(values)) 
    infoGlobal(values)
}

function percorrerArray(array) {
    let numChildUl = 1
    for (let c = 0; c < array.length; c++) {
        array[c].id = numChildUl
        let li = document.createElement('li')
        li.innerHTML = `<button class="btnRemove">X</button>
                    <p>${array[c].nome}</p>
                    <p>${verificarPositivoNegativo(array[c].valor, li)} ${setFormatCurrencyBrl(array[c].valor)}</p>
                    <p class="idDoItem">${array[c].id}</p>`

        li.classList.add('transacoes')
        ul.prepend(li)
        btnRemove()

        numChildUl++
    }
}

const btnRemove = () => {
    const btnRemove = document.querySelectorAll(`.transacoes button`)
    btnRemove.forEach(element => {
        element.addEventListener('click', excluirTransacao)
    })
}