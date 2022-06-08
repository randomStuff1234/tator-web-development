function showElement(el) {
    el.style.display = 'block';
}

function hideElement(el) {
    el.style.display = 'none';
}

// Turns html string into html object
function createElementFromText(str) {
    let div = document.createElement('div');
    div.innerHTML = str;
    return div.children[0];
}