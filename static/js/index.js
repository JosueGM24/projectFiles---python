let url = "";
function selectServer(name, group, port) {
    var menu = document.getElementById("menu");
    menu.style.top = "-100vh";
    document.getElementById("file-section").style.display = "flex";
    switch (name) {
        case 'Debian':
            url = 'http://localhost:5000/';
            break;
        case 'Fedora':
            url = 'http://localhost:5001/';
            break;
        case 'FreeBSD':
            url = 'http://localhost:5002/';
            break;
        case 'Solaris':
            url = 'http://localhost:5003/';
            break;
        default:
            console.error('Nombre de servidor no reconocido:', name);
            return;
    }
    listFiles();
}

function listFiles() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Limpiar el contenido del contenedor fileList    
    let localURL = url +  'files';

    fetch(localURL)
        .then(response => response.json())
        .then(data => {
            data.files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'fileItem';
                fileItem.innerHTML = `
                    <input type="checkbox" id="${file}" class="btnFile poppins-regular fs-20 typeW">
                    <label class="typeW poppins-bold fs-20" for="${file}">${file}</label>
                `;
                fileList.appendChild(fileItem);
            });
        })
        .catch(error => {
            console.error('Error al obtener archivos:', error);
        });
}

function downloadSelectedFiles() {
    const checkboxes = document.querySelectorAll('.btnFile:checked');
    const filesToDownload = [];
    checkboxes.forEach(checkbox => {
        filesToDownload.push(checkbox.id);
    });

    if (filesToDownload.length > 0) {
        fetch(url + 'download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ files: filesToDownload })
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'files.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error al descargar archivos:', error);
        });
    } else {
        alert('Please select at least one file to download.');
    }
}

function showOptions() {
    const menu = document.getElementById('menu');
    menu.style.top = "0";
}
document.getElementById('fileInput').addEventListener('change', function() {
    const file = this.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch(url + 'upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        listFiles();
    });
});

function deleteSelectedFiles() {
    const checkboxes = document.querySelectorAll('.btnFile:checked');
    checkboxes.forEach(checkbox => {
        const filename = checkbox.id;
        fetch(url + `delete/${filename}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            listFiles();
        });
    });
}
