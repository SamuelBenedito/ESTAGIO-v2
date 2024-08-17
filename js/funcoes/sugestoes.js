const clientInput = document.getElementById("cliente");
const suggestionsContainer = document.getElementById("suggestions");
const temaInput = document.getElementById("tema");
const temaSuggestionsContainer = document.getElementById("temaSuggestions");
const servicoInput = document.getElementById("servico");
const servicoSuggestionsContainer = document.getElementById("servicoSuggestions");
const brinquedoInput = document.getElementById("brinquedo");
const brinquedoSuggestionsContainer = document.getElementById("brinquedoSuggestions");
const formasPagamentoInput = document.getElementById("formaPag");
const formasPagamentoSuggestionsContainer = document.getElementById("formasPagamentoSuggestions");

// Obtém os dados do localStorage ou inicializa com arrays vazios
let temas = JSON.parse(localStorage.getItem("temas")) || [];
let clients = JSON.parse(localStorage.getItem("clients")) || [];
let servicos = JSON.parse(localStorage.getItem("servicos")) || [];
let brinquedos = JSON.parse(localStorage.getItem("brinquedos")) || [];
let formasPagamento = JSON.parse(localStorage.getItem("formasPagamento")) || [];

// Funções para filtrar os dados
function filterClients(query) {
    return clients.filter(client => client.cliente.toLowerCase().includes(query.toLowerCase()));
}

function filterTemas(query) {
    return temas.filter(tema => tema.name.toLowerCase().includes(query.toLowerCase()));
}

function filterServices(query) {
    return servicos.filter(service => service.name.toLowerCase().includes(query.toLowerCase()));
}

function filterBrinquedos(query) {
    return brinquedos.filter(brinquedo => brinquedo.name.toLowerCase().includes(query.toLowerCase()));
}

function filterFormasPagamento(query) {
    return formasPagamento.filter(forma => forma.nome.toLowerCase().includes(query.toLowerCase()));
}

// Função para mostrar as sugestões
function showSuggestions(suggestions, container, input) {
    container.innerHTML = "";
    if (suggestions.length > 0) {
        suggestions.forEach(item => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "autocomplete-suggestion";
            suggestionItem.textContent = item.cliente || item.name || item.nome;
            suggestionItem.addEventListener("click", () => {
                input.value = item.cliente || item.name || item.nome;
                container.innerHTML = "";
            });
            container.appendChild(suggestionItem);
        });
    }
}

// Adiciona os eventos de input para os campos
clientInput.addEventListener("input", () => {
    const query = clientInput.value;
    if (query.length > 0) {
        const suggestions = filterClients(query);
        showSuggestions(suggestions, suggestionsContainer, clientInput);
    } else {
        suggestionsContainer.innerHTML = "";
    }
});

temaInput.addEventListener("input", () => {
    const query = temaInput.value;
    if (query.length > 0) {
        const suggestions = filterTemas(query);
        showSuggestions(suggestions, temaSuggestionsContainer, temaInput);
    } else {
        temaSuggestionsContainer.innerHTML = "";
    }
});

servicoInput.addEventListener("input", () => {
    const query = servicoInput.value;
    if (query.length > 0) {
        const suggestions = filterServices(query);
        showSuggestions(suggestions, servicoSuggestionsContainer, servicoInput);
    } else {
        servicoSuggestionsContainer.innerHTML = "";
    }
});

brinquedoInput.addEventListener("input", () => {
    const query = brinquedoInput.value;
    if (query.length > 0) {
        const suggestions = filterBrinquedos(query);
        showSuggestions(suggestions, brinquedoSuggestionsContainer, brinquedoInput);
    } else {
        brinquedoSuggestionsContainer.innerHTML = "";
    }
});

formasPagamentoInput.addEventListener("input", () => {
    const query = formasPagamentoInput.value;
    if (query.length > 0) {
      const suggestions = filterFormasPagamento(query);
      showSuggestions(suggestions, formasPagamentoSuggestionsContainer, formasPagamentoInput);
    } else {
      formasPagamentoSuggestionsContainer.innerHTML = "";
    }
});