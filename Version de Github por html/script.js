const releasesDiv = document.getElementById('releases');
const repoOwner = 'aldostools';
const repoName = 'IRISMAN';

fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al obtener releases: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const releases = data.map(release => {
            // Buscar el primer asset disponible (si lo hay)
            const asset = release.assets.length > 0 ? release.assets[0] : null;
            const downloadBtn = asset
                ? `<a href="${asset.browser_download_url}" download class="btn-descarga">⬇️ Descargar ${asset.name}</a>`
                : `<p><em>No hay archivos para descargar.</em></p>`;

            return `
                <div class="release">
                    <h2>${release.name} - Versión: ${release.tag_name}</h2>
                    <p>${release.body || "Sin descripción"}</p>
                    <p>Publicado el ${new Date(release.published_at).toLocaleString()}</p>
                    <a href="${release.html_url}" target="_blank">Ver release</a>
                    <br>
                    ${downloadBtn}
                </div>
            `;
        }).join('');
        releasesDiv.innerHTML = releases;
    })
    .catch(error => console.error('Error:', error));