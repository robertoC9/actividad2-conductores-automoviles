// ==========================================
// FRONTEND (Fetch + Render de tablas)
// ==========================================

// URL base del backend (CORREGIDO: usar IPv4 explícito)
const API_URL = "http://127.0.0.1:3000";

// Elemento contenedor donde se renderizan los resultados
const resultado = document.getElementById("resultado");

// ==========================================
// Helper: fetchJSON
// ==========================================
async function fetchJSON(url) {
  const res = await fetch(url);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.mensaje))
      ? (data.error || data.mensaje)
      : `Error HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

// ==========================================
// Render: renderTabla
// ==========================================
function renderTabla(data) {
  if (data == null) {
    resultado.innerHTML = "<p style='color:red;'>Sin respuesta del servidor</p>";
    return;
  }

  if (!Array.isArray(data)) {
    if (typeof data === "object" && data.error) {
      resultado.innerHTML = `<p style="color:red;">${data.error}</p>`;
      return;
    }

    if (typeof data === "object" && data.mensaje) {
      resultado.innerHTML = `<p style="color:red;">${data.mensaje}</p>`;
      return;
    }

    data = [data];
  }

  if (data.length === 0) {
    resultado.innerHTML = "<p>No hay resultados</p>";
    return;
  }

  const keys = Object.keys(data[0]);

  let html = "<table><thead><tr>";
  keys.forEach(k => html += `<th>${k}</th>`);
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    keys.forEach(k => html += `<td>${row[k]}</td>`);
    html += "</tr>";
  });

  html += "</tbody></table>";
  resultado.innerHTML = html;
}

// ==========================================
// Render: renderTablaHTML
// ==========================================
function renderTablaHTML(data) {
  if (!Array.isArray(data) || data.length === 0) return "<p>Sin datos</p>";

  const keys = Object.keys(data[0]);

  let html = "<table><thead><tr>";
  keys.forEach(k => html += `<th>${k}</th>`);
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    keys.forEach(k => html += `<td>${row[k]}</td>`);
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

// ==========================================
// Helper: renderErrorEnPantalla
// ==========================================
function renderErrorEnPantalla(err) {
  const msg = (err && err.message) ? err.message : "Error desconocido";
  resultado.innerHTML = `<p style="color:red;">${msg}</p>`;
}

// ==========================================
// ENDPOINTS
// ==========================================

// GET /conductores
async function getConductores() {
  try {
    const data = await fetchJSON(`${API_URL}/conductores`);
    renderTabla(data);
  } catch (err) {
    renderErrorEnPantalla(err);
  }
}

// GET /automoviles
async function getAutomoviles() {
  try {
    const data = await fetchJSON(`${API_URL}/automoviles`);
    renderTabla(data);
  } catch (err) {
    renderErrorEnPantalla(err);
  }
}

// GET /conductoressinauto?edad=#
async function getConductoresSinAuto() {
  const edad = document.getElementById("edadInput").value;

  try {
    const data = await fetchJSON(`${API_URL}/conductoressinauto?edad=${edad}`);
    renderTabla(data);
  } catch (err) {
    renderErrorEnPantalla(err);
  }
}

// GET /solitos
async function getSolitos() {
  try {
    const data = await fetchJSON(`${API_URL}/solitos`);

    resultado.innerHTML = `
      <h3>Conductores sin auto</h3>
      ${renderTablaHTML(data.conductoresSinAuto)}

      <h3>Autos sin conductor</h3>
      ${renderTablaHTML(data.autosSinConductor)}
    `;
  } catch (err) {
    renderErrorEnPantalla(err);
  }
}

// GET /auto?patente=#
async function getAutoPorPatente() {
  const patente = document.getElementById("patenteInput").value;

  try {
    const data = await fetchJSON(`${API_URL}/auto?patente=${patente}`);
    renderTabla(data);
  } catch (err) {
    renderErrorEnPantalla(err);
  }
}

// GET /auto?iniciopatente=#
async function getAutoPorInicio() {
  const inicio = document.getElementById("inicioInput").value;

  try {
    const data = await fetchJSON(`${API_URL}/auto?iniciopatente=${inicio}`);
    renderTabla(data);
  } catch (err) {
    renderErrorEnPantalla(err);
  }
}

