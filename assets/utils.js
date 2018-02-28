function isCSSColor(value) {
    const div = document.createElement('div');

    // insert the div so it gets access to CSS variables
    document.body.appendChild(div);

    // set its color to the tested value
    div.style.backgroundColor = value;
    
    // now check if its backgroundColor has changed. Because the browser verifies if the value is a valid CSS color before applying it to a color-type property.
    // backgroundColor property, if not applied, remains a default of rgba(0, 0, 0, 0)
    const currentColor = window.getComputedStyle(div).backgroundColor;
    const isColor = currentColor !== 'rgba(0, 0, 0, 0)';
    
    div.remove();

    return isColor;
}

function getCSSProperties() {
    return new Promise(function(resolve, reject) {
        fetch('../underwear.css').then(res => res.text()).then(text => {
            const veryStart = text.indexOf(':root{');
            const start = text.indexOf('--', veryStart);
            const end = text.indexOf('}', start);
            const valuesString = text.substr(start, end - start /* length */).trim();
            const valuesRaw = valuesString.split(';');
            const values = valuesRaw.map(v => {                
                const [name, value] = v.split(':');
                return {name, value, isCSSColor: isCSSColor(value)};
            });
            resolve(values);            
        })
    });
}

function constructRow(data) {
    return `
    <tr>
        <td><code>${data.name}</code></td>
        <td><code>${data.value}</code></td>
        <td>${data.isCSSColor? `<div class="color-sample" style="background-color: ${data.value}"><div>` : 'Hello World'}</td>
    </tr>`
}

async function populateCSSPropertiesTable() {
    const properties = await getCSSProperties();
    const rows = properties.map(constructRow);
    propsTable.innerHTML = rows.join('\n');

    populationDone();
}

populateCSSPropertiesTable();