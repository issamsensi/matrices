# Matrices — Linear Algebra Tools (Flask + NumPy)

Welcome to **Matrices**, a lightweight Flask + NumPy web app to analyze and compute key matrix operations such as transpose, norm, rank, SVD, QR factorization, pseudo-inverse, determinant, inverse, eigenvalues/vectors, and many statistics.

This project is a learning/demo project for performing numerical matrix operations server-side and displaying results in the browser.

## 🚀 Project Overview
This project demonstrates a compact matrix analysis app built using Flask on the backend and a lightweight JavaScript frontend (ES6). The backend performs its linear algebra operations using NumPy and returns JSON that the front-end formats for display.

## 🌟 Features
- Transpose, flatten, trace, and diagonal extraction
- Norm, rank, and statistics (min/max/mean/sum)
- Singular Value Decomposition (U, S, Vt)
- QR factorization (Q, R)
- Pseudoinverse and inverse (where applicable)
- Determinant (for square matrices)
- Eigenvalues and eigenvectors (for square matrices)

## 🌐 Live Demo

## 🛠️ Technologies Used
- Python 3
- Flask (web server)
- NumPy (numerical operations)
- HTML / CSS / JavaScript (frontend)

## 📦 Project Structure
```
matrices/
├─ app.py               # Flask application (WSGI entrypoint)
├─ requirements.txt     # Python dependencies
├─ templates/
│  ├─ layout.html
│  └─ index.html        # UI that builds a matrix form
└─ static/
	 ├─ css/
	 ├─ js/               # frontend logic for matrix UI and display
	 └─ cour/             # course PDFs and assets
```

## 📸 Screenshots
[screen](static/matrice.png)

## ✨ How to use locally
1. Create a Python virtual environment and install dependencies:
```bash
cd matrices
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
2. Run the Flask app:
```bash
python app.py
# Visit http://127.0.0.1:5000/ in your browser
```
**Note**: `app.py` runs the Flask development server; in production you should run behind a proper WSGI server and disable `debug=True` in the Flask app.

## ☁️ Deploy on PythonAnywhere
1. Create a PythonAnywhere account and start a new Web app (choose manual configuration, Python 3.x).
2. Upload or `git clone` this `matrices` folder into your home directory.
3. Create a virtualenv on PythonAnywhere and install dependencies from `requirements.txt`.
4. Configure the WSGI file to point to `matrices/app.py` and `app` (Flask app variable):
	 - Example WSGI snippet (update paths to match your PythonAnywhere setup):

```python
import sys
path = '/home/yourusername/path/to/matrices'
if path not in sys.path:
    sys.path.insert(0, path)
from app import app as application
```
	 - Set the path to your project and virtualenv path in the WSGI file.
5. Reload the PythonAnywhere web app and visit your site.


## 📦 Requirements
Dependencies are stored in `requirements.txt` (Flask and NumPy). PythonAnywhere or any WSGI host should install from this file.

## 👤 Author
**ISSAM SENSI**

---
© 2025 [issamsensi](https://github.com/issamsensi)

