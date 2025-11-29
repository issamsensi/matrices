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

    if (data.hasOwnProperty('det')){
        results.innerHTML += `<p>Determinant: ${data.det.toFixed(2)}</p>`;
        if(data.hasOwnProperty('inverse')){
            results.innerHTML += `<p>L'inverse: </p>`;
            results.innerHTML += renderMatrix(data.inverse);
        }
        if(Array.isArray(data.vals_pr)){
            results.innerHTML += `<p>Les valeurs propres: </p>`;
            results.innerHTML += `<div class="eig-vals">` + data.vals_pr.map(v => (typeof v === 'number') ? v.toFixed(6) : v).join(' ') + `</div>`;
        }
        if(Array.isArray(data.vecs_pr)){
            results.innerHTML += `<p>Les vecteurs propres (colonnes): </p>`;
            const n = data.vecs_pr.length; 
            const m = (data.vecs_pr[0] && data.vecs_pr[0].length) ? data.vecs_pr[0].length : 0;
            for(let k = 0; k < m; k++){
                results.innerHTML += `v${k+1}: <br>`;
                for(let i = 0; i < n; i++){
                    const val = data.vecs_pr[i][k];
                    results.innerHTML += `${(typeof val === 'number') ? val.toFixed(6) : val}<br>`;
                }
            }
        }
        }
})