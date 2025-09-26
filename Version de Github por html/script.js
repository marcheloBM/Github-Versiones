const links = [
  "https://github.com/CTurt/FreeDVDBoot",
  "https://github.com/israpps/Funtuna-Fork",
  "https://github.com/bucanero/apollo-ps2",
  "https://github.com/ps2homebrew/Open-PS2-Loader",
  "https://github.com/israpps/wLaunchELF_ISR",
  "https://github.com/elmariolo/OPL-Server",
  "https://github.com/nokiajavi/JLojch",
  "https://github.com/ffgriever-pl/Memory-Card-Annihilator/releases",
  "https://github.com/bucanero/apollo-ps3/releases",
  "https://github.com/bucanero/ArtemisPS3/releases",
  // ...agrega todos los que quieras
];

// Genera repoList automáticamente desde links
const repoList = links.map(link => {
  const [, owner, name] = link.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  return { owner, name };
});

const releasesDiv = document.getElementById('releases');

// github.com/settings/tokens
const token = 'TU_TOKEN_AQUI'; // <-- Pon aquí tu token personal de GitHub

// Crear tabla
const table = document.createElement('table');
table.innerHTML = `
  <thead>
    <tr>
      <th>Repositorio</th>
      <th>Versión</th>
      <th>Descripción</th>
      <th>Fecha</th>
      <th>Release</th>
      <th>Descarga</th>
    </tr>
  </thead>
  <tbody id="tabla-body"></tbody>
`;
releasesDiv.appendChild(table);

const tbody = document.getElementById('tabla-body');

repoList.forEach(({ owner, name }) => {
  fetch(`https://api.github.com/repos/${owner}/${name}/releases`, {
    headers: {
      'Authorization': 'token ' + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error en ${name}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      const release = data[0]; // Última versión

      const fila = document.createElement('tr');

      if (!release) {
        // No hay releases disponibles
        fila.innerHTML = `
          <td>${name}</td>
          <td><em>—</em></td>
          <td><em>Sin descripción</em></td>
          <td><em>—</em></td>
          <td><a href="https://github.com/${owner}/${name}" target="_blank">🔗 Repositorio</a></td>
          <td><em>No disponible</em></td>
        `;
      } else {
        const asset = release.assets[0];

        fila.innerHTML = `
          <td>${name}</td>
          <td>${release.tag_name}</td>
          <td>${release.body ? release.body.slice(0, 100) + "..." : "Sin descripción"}</td>
          <td>${new Date(release.published_at).toLocaleDateString()}</td>
          <td><a href="${release.html_url}" target="_blank">🔗 Ver</a></td>
          <td>${asset ? `<a href="${asset.browser_download_url}" download>⬇️ ${asset.name}</a>` : `<em>Sin archivo</em>`}</td>
        `;
      }

      tbody.appendChild(fila);
    })
    .catch(err => {
      const fila = document.createElement('tr');
      fila.innerHTML = `<td colspan="6" style="color:red;">❌ Error en ${name}: ${err.message}</td>`;
      tbody.appendChild(fila);
    });
});
