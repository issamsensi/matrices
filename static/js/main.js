const confirmer = document.getElementById("confirm");
let matrice = document.querySelector("#matrice");
let columns = 0;
let rows = 0;

confirmer.addEventListener('click', e => {
    e.preventDefault();
    columns = Number(document.getElementById("columns").value);
    rows = Number(document.getElementById("rows").value);
    matrice.innerHTML = ``;
    
    if(columns > 0 && rows > 0){
        for(let i = 0; i < columns*rows; i++){
            matrice.innerHTML += `
                <input type="number" name="${i}" autocomplete="off" step="any">
            `;
        }
        matrice.innerHTML += `
                <input type="number" value="${columns}" name="columns" hidden>
                <input type="number" value="${rows}" name="rows" hidden>
            `;
        matrice.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        const existingSubmit = document.getElementById('calcule');
        if(existingSubmit) existingSubmit.remove();
        const existingResults = document.querySelector('.results');
        if(existingResults) existingResults.remove();
        document.body.insertAdjacentHTML("beforeend", `<input type="submit" id="calcule" value="calculate" form="matrice">
            <br><div class="results"></div>
            `);
        
    }
})


matrice.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(matrice);
    const response = await fetch('/calcules', {
        method: 'POST',
        body: formData
    });
    if(!response.ok){
        let err = await response.json().catch(()=>({error: 'Unknown server error'}));
        alert('Error: ' + (err.error || 'Server returned an error'));
        return;
    }
    const data = await response.json();
    let results = document.querySelector(".results");
    results.innerHTML = '';
    results.innerHTML += `<p>La matrice: </p>`
    function renderMatrix(mat){
        if(!Array.isArray(mat) || !mat.length) return '<p>Empty</p>';
        let html = '<table class="mat-table">';
        for(let i = 0; i < mat.length; i++){
            html += '<tr>';
            for(let j = 0; j < (mat[i] ? mat[i].length : 0); j++){
                const val = mat[i][j];
                html += `<td>${(typeof val === 'number') ? val.toFixed(2) : val}</td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    }
    results.innerHTML += renderMatrix(data.matrice);
    results.innerHTML += `<p>transpose A<sup>T</sup>: </p>`
    results.innerHTML += renderMatrix(data.transpose);
    results.innerHTML += `<p>La norme: ${data.norm.toFixed(2)}</p>`;
    results.innerHTML += `<p>Rank: ${data.rank}</p>`;
    results.innerHTML += `<p>SVD: </p>`;
    results.innerHTML += `<p>U: </p>`;
    if(Array.isArray(data.svd) && Array.isArray(data.svd[0])){
        results.innerHTML += renderMatrix(data.svd[0]);
    }
    results.innerHTML += `<p>S: </p>`;
    if(Array.isArray(data.svd) && Array.isArray(data.svd[1])){
        results.innerHTML += `<div class="singular-values">`;
        results.innerHTML += data.svd[1].map(v => (typeof v === 'number') ? v.toFixed(2) : v).join(' ');
        results.innerHTML += `</div>`;
    }
    results.innerHTML += `<p>Vt: </p>`;
    if(Array.isArray(data.svd) && Array.isArray(data.svd[2])){
        results.innerHTML += renderMatrix(data.svd[2]);
    }
    results.innerHTML += `<p>QR: </p>`;
    results.innerHTML += `<p>Q: </p>`;
    if(Array.isArray(data.qr) && Array.isArray(data.qr[0])){
        results.innerHTML += renderMatrix(data.qr[0]);
    }
    results.innerHTML += `<p>R: </p>`;
    if(Array.isArray(data.qr) && Array.isArray(data.qr[1])){
        results.innerHTML += renderMatrix(data.qr[1]);
    }
    results.innerHTML += `<p>pseudo inverse: </p>`;
    if(Array.isArray(data.pseudo_inverse) && Array.isArray(data.pseudo_inverse[0])){
        results.innerHTML += renderMatrix(data.pseudo_inverse);
    }
    results.innerHTML += `<p>Flatten: </p>`;
    if(Array.isArray(data.flatten)){
        results.innerHTML += `<div class="flatten">` + data.flatten.map(v => (typeof v==='number')?v.toFixed(2):v).join(' ') + `</div>`;
    }
    results.innerHTML += `<p>Diagonal Externe: </p>`;
    if(Array.isArray(data.diagonal_externe)){
        results.innerHTML += `<div class="diag">` + data.diagonal_externe.map(v => (typeof v==='number')?v.toFixed(2):v).join(' ') + `</div>`;
    }
    results.innerHTML += `<p>Trace: ${data.trace}</p>`;
    results.innerHTML += `<p>Minimum: ${data.min}</p>`;
    results.innerHTML += `<p>Maximum: ${data.max}</p>`;
    results.innerHTML += `<p>Mean: ${data.mean}</p>`;
    results.innerHTML += `<p>Somme: ${data.sum}</p>`;

    if (data.hasOwnProperty('det') && data.det !== 0){
        results.innerHTML += `<p>Determinant: ${data.det.toFixed(2)}</p>`;
        results.innerHTML += `<p>L'inverse: </p>`;
        for(let i = 0; i < data.rows; i++){
            for(let j = 0; j < data.columns; j++){
                results.innerHTML += `${data.inverse[i][j].toFixed(2)}\t`;
            }
            results.innerHTML += `<br>`;
        }
        results.innerHTML += `<p>Les valeurs propres: </p>`;
        for(let i = 0; i < data.vecs_pr.length; i++){
            results.innerHTML += `V${i+1}: <br>`;
            for(let j = 0; j < data.vecs_pr[i].length; j++){
                    results.innerHTML += `${data.vecs_pr[i][j].toFixed(2)}  <br>`;
            }
        }
            for(let j = 0; j < data.vecs_pr[k].length; j++){
                    results.innerHTML += `${data.vecs_pr[k][j].toFixed(2)}  <br>`;
            }
        }
})