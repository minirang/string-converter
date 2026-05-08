function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function updateURLParam(value) {
    const url = new URL(window.location);
    if (value) {
        url.searchParams.set('text', value);
    } else {
        url.searchParams.delete('text');
    }
    window.history.replaceState({}, '', url);
}

function initURLSync(inputEl, onChange) {
    const paramText = getQueryParam('text');
    if (paramText) inputEl.value = paramText;
    inputEl.addEventListener('input', () => {
        const val = inputEl.value;
        updateURLParam(val);
        onChange();
    });
    // 뒤로가기 대응
    window.addEventListener('popstate', () => {
        const paramText = getQueryParam('text') || '';
        inputEl.value = paramText;
        onChange();
    });
}
