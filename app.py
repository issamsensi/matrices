from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():

    return render_template('index.html')


@app.route("/calcules", methods=["POST"])
def calcules():
    try:
        col = int(request.form.get('columns'))
        row = int(request.form.get('rows'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid or missing rows/columns'}), 400

    if col <= 0 or row <= 0:
        return jsonify({'error': 'Rows and columns must be positive integers'}), 400

    max_elements = 5000
    if col * row > max_elements:
        return jsonify({'error': f'Maximum allowed elements is {max_elements}'}), 400

    matrice = []
    for i in range(col * row):
        val = request.form.get(f"{i}")
        if val is None or val.strip() == '':
            return jsonify({'error': f'Missing value for element {i}'}), 400
        try:
            matrice.append(float(val))
        except ValueError:
            return jsonify({'error': f'Invalid number for element {i}'}), 400
    
    matrice = np.array(matrice).reshape(row, col)

    transpose = matrice.T
    norm = np.linalg.norm(matrice)
    rank = np.linalg.matrix_rank(matrice)
    U, S, Vt = np.linalg.svd(matrice)
    Q, R = np.linalg.qr(matrice)
    pseudo_inverse = np.linalg.pinv(matrice)
    flatten = matrice.flatten()
    diagonal_externe = np.diag(matrice)
    trace = np.trace(matrice)
    min_val = matrice.min()
    max_val = matrice.max()
    mean_val = matrice.mean()
    sum_val = matrice.sum()

    response = {
        "matrice": matrice.tolist(),
        "transpose": transpose.tolist(),
        "norm": float(norm),
        "rank": int(rank),
        "svd": [U.tolist(), S.tolist(), Vt.tolist()],
        "qr": [Q.tolist(), R.tolist()],
        "pseudo_inverse": pseudo_inverse.tolist(),
        "flatten": flatten.tolist(),
        "diagonal_externe": diagonal_externe.tolist(),
        "trace": float(trace),
        "min": float(min_val),
        "max": float(max_val),
        "mean": float(mean_val),
        "sum": float(sum_val),
        "columns": col,
        "rows": row
    }

    det = None
    if col == row:
        det = np.linalg.det(matrice)
        response["det"] = float(det)
        
        if det != 0:
            response["inverse"] = np.linalg.inv(matrice).tolist()
        
        vals, vecs = np.linalg.eig(matrice)
        response["vals_pr"] = vals.tolist()
        response["vecs_pr"] = vecs.tolist()

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)