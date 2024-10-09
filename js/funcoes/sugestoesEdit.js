const clientInput = document.getElementById("modalCliente");
const suggestionsContainer = document.getElementById("suggestions");
const temaInput = document.getElementById("modalTema");
const temaSuggestionsContainer = document.getElementById("temaSuggestions");
const servicoInput = document.getElementById("modalServico");
const servicoSuggestionsContainer = document.getElementById("servicoSuggestions");
const brinquedoInput = document.getElementById("modalBrinquedos");
const brinquedoSuggestionsContainer = document.getElementById("brinquedoSuggestions");
const formasPagamentoInput = document.getElementById("modalFormaPag");
const formasPagamentoSuggestionsContainer = document.getElementById("formasPagamentoSuggestions");

// Função para buscar sugestões
function fetchSuggestions(table, query, container, input) {
    fetch(`buscar_dados_modal.php?table=${table}&term=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => showSuggestions(data, container, input))
        .catch(error => console.error('Erro:', error));
}

// Função para mostrar as sugestões
function showSuggestions(suggestions, container, input) {
    container.innerHTML = "";
    if (suggestions.length > 0) {
        suggestions.forEach(item => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "autocomplete-suggestion";
            suggestionItem.textContent = item.cliente || item.name;
            suggestionItem.addEventListener("click", () => {
                input.value = item.cliente || item.name;
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
        fetchSuggestions('clientes', query, suggestionsContainer, clientInput);
    } else {
        suggestionsContainer.innerHTML = "";
    }
});

temaInput.addEventListener("input", () => {
    const query = temaInput.value;
    if (query.length > 0) {
        fetchSuggestions('temas', query, temaSuggestionsContainer, temaInput);
    } else {
        temaSuggestionsContainer.innerHTML = "";
    }
});

servicoInput.addEventListener("input", () => {
    const query = servicoInput.value;
    if (query.length > 0) {
        fetchSuggestions('servicos', query, servicoSuggestionsContainer, servicoInput);
    } else {
        servicoSuggestionsContainer.innerHTML = "";
    }
});

brinquedoInput.addEventListener("input", () => {
    const query = brinquedoInput.value;
    if (query.length > 0) {
        fetchSuggestions('brinquedos', query, brinquedoSuggestionsContainer, brinquedoInput);
    } else {
        brinquedoSuggestionsContainer.innerHTML = "";
    }
});

formasPagamentoInput.addEventListener("input", () => {
    const query = formasPagamentoInput.value;
    if (query.length > 0) {
        fetchSuggestions('formas_pagamento', query, formasPagamentoSuggestionsContainer, formasPagamentoInput);
    } else {
        formasPagamentoSuggestionsContainer.innerHTML = "";
    }
});