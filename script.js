/* ================================================
   CORCHEA HOUSE – script.js  (v2 – Modo en vivo)
   Nuevas funciones:
   - Modo setlist en vivo: nav anterior/siguiente
   - Vista "Solo letra" / "Con acordes"
   - Barra de secciones con scroll interno
================================================ */

/* ================================================
   DATOS DE EJEMPLO
================================================ */
const CANCIONES_DEFAULT = [
  {
    id: 'cancion-1',
    titulo: 'Eres Todo para Mí',
    artista: 'Comunidad Worship',
    tono: 'G',
    categoria: 'Adoración',
    usuario: 'María G.',
    letra: `[Verso 1]
[G]Señor, tú eres [D]bueno
[Em]Grande es tu [C]amor
[G]Fiel en cada [D]mañana
[Em]Tú eres mi [C]Dios

[Pre-Coro]
[Am]Con todo mi [D]ser
[Am]Te voy a [D]adorar

[Coro]
[G]Eres todo para [D]mí
[Em]No hay nadie como [C]tú
[G]Mi corazón te [D]busca
[Em]Señor, solo a [C]ti

[Verso 2]
[G]En el valle o la [D]cima
[Em]Tú no me deja[C]rás
[G]Tu mano me sos[D]tiene
[Em]Siempre fiel esta[C]rás

[Puente]
[C]Al que es digno de honor
[G]Al que venció la muerte
[D]Al único Señor
[Em]Toda la gloria sea
[C]Solo a ti, Señor`
  },
  {
    id: 'cancion-2',
    titulo: 'Renuévame',
    artista: 'Iglesia Nueva Vida',
    tono: 'D',
    categoria: 'Ministración',
    usuario: 'Carlos M.',
    letra: `[Verso 1]
[D]Aquí estoy delante [A]de ti
[Bm]Con el alma abierta, [G]Señor
[D]Necesito de tu [A]presencia
[Bm]Necesito de tu [G]amor

[Coro]
[D]Renuévame, [A]transfórmame
[Bm]Con tu Espíritu, [G]Dios
[D]Renuévame, [A]hazme más como tú
[Bm]Eso es lo que [G]pido hoy

[Puente]
[G]Como el águila [D]vuela
[A]Así quiero yo [Bm]volar
[G]Renovado por [D]tu gracia
[A]En tu presencia estar`
  },
  {
    id: 'cancion-3',
    titulo: 'Grande y Poderoso',
    artista: 'Ministerio Hosanna',
    tono: 'A',
    categoria: 'Alabanza',
    usuario: 'Ana R.',
    letra: `[Intro]
[A] [E] [F#m] [D]

[Verso 1]
[A]Hoy vengo a can[E]tarte
Con toda mi [F#m]voz
[D]Porque tú eres [A]digno
[E]Digno eres, Se[D]ñor

[Verso 2]
[A]Los cielos declaran
Tu [E]gloria, Señor
[F#m]La tierra te alaba
[D]Con un solo [A]clamor

[Coro]
[A]¡Grande y pode[E]roso!
[F#m]Es el Dios que [D]sirvo yo
[A]¡Grande y pode[E]roso!
[F#m]Rey de reyes es mi [D]Dios

[Puente]
[D]¡Aleluya, ale[A]luya!
[E]¡Aleluya al Se[D]ñor!
[D]¡Aleluya, ale[A]luya!
[E]¡Toda la gloria a [D]ti!`
  },
  {
    id: 'cancion-4',
    titulo: 'Ven, Espíritu',
    artista: 'Fuente de Vida',
    tono: 'E',
    categoria: 'Entrada',
    usuario: 'Pedro H.',
    letra: `[Verso 1]
[E]Ven, Espíritu [B]Santo
[C#m]Llena este [A]lugar
[E]Muévete entre no[B]sotros
[C#m]Como solo tú [A]puedes dar

[Coro]
[E]Ven, Espíritu, [B]ven
[A]Necesitamos de [E]ti
[E]Ven, Espíritu, [B]ven
[A]Cae sobre no[B]sotros [E]hoy

[Verso 2]
[E]Tu fuego nos con[B]suma
[C#m]Tu paz nos llene [A]ya
[E]Que nada nos im[B]pida
[C#m]Entrar en tu [A]lugar

[Puente]
[A]Sopla sobre noso[E]tros
[B]Como viento pode[A]roso
[A]Llena cada co[E]razón
[B]Con tu presencia y tu [E]amor`
  },
  {
    id: 'cancion-5',
    titulo: 'Tu Gracia Me Alcanzó',
    artista: 'Casa de Oración',
    tono: 'C',
    categoria: 'Ofertorio',
    usuario: 'Luisa V.',
    letra: `[Verso 1]
[C]Perdido me encon[G]tró tu amor
[Am]Me levantó del [F]polvo
[C]Cuando no merecía [G]nada
[Am]Tu gracia me al[F]canzó

[Verso 2]
[C]Las cadenas rom[G]piste, Señor
[Am]Me diste liber[F]tad
[C]Ahora vivo para [G]servirte
[Am]Con toda mi vo[F]luntad

[Coro]
[F]Tu gracia, tu [C]gracia
[G]Es todo lo que [Am]tengo hoy
[F]Tu gracia, tu [C]gracia
[G]La razón de mi [C]canción

[Puente]
[Am]Nada puedo [F]ofrecer
[C]Sino lo que tú [G]me das
[Am]En mis manos solo [F]tengo
[G]Lo que tú has [C]puesto ya`
  }
];

/* ================================================
   ESCALAS DE TRANSPOSICIÓN
================================================ */
const NOTAS_SOSTENIDO = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTAS_BEMOL    = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

/* ================================================
   ESTADO GLOBAL
================================================ */
let canciones       = [];
let setlist         = [];
let filtroCategoria = '';
let cancionActual   = null;
let tonoActual      = '';
let semitonosActuales = 0;   // delta acumulado de transposición
let tamanoFuente    = 16;
let autoscrollInterval = null;
let modoEdicion     = null;

// Modo en vivo
let modoEnVivo      = false;  // true cuando se abre desde el setlist
let indexEnVivo     = -1;     // posición actual dentro del setlist

// Vista acordes/letra
let soloLetra       = false;

/* ================================================
   INICIALIZACIÓN
================================================ */
document.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  renderizarCanciones();
  actualizarBadgeSetlist();
  inicializarFiltros();
  importarSetlistDesdeURL(); // debe ir después de cargarDatos

  // Atajos de teclado para navegación en vivo
  document.addEventListener('keydown', manejarTeclado);
});

function manejarTeclado(e) {
  // Solo activos en vista canción
  const vistaCancion = document.getElementById('vista-cancion');
  if (!vistaCancion.classList.contains('activa')) return;
  // No activar si hay un modal abierto o foco en input
  if (document.getElementById('modal-cancion').style.display === 'flex') return;
  if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); navegarEnVivo(1); }
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); navegarEnVivo(-1); }
}

/* ================================================
   PERSISTENCIA
================================================ */
function cargarDatos() {
  const guardadas = localStorage.getItem('ch_canciones');
  const setlistGuardado = localStorage.getItem('ch_setlist');
  canciones = guardadas ? JSON.parse(guardadas) : [...CANCIONES_DEFAULT];
  if (!guardadas) guardarCanciones();
  setlist = setlistGuardado ? JSON.parse(setlistGuardado) : [];
}
function guardarCanciones() { localStorage.setItem('ch_canciones', JSON.stringify(canciones)); }
function guardarSetlist()    { localStorage.setItem('ch_setlist',   JSON.stringify(setlist));   }

/* ================================================
   NAVEGACIÓN ENTRE VISTAS
================================================ */
 function mostrarVista(nombre) {
  detenerAutoscroll();

  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
  document.getElementById(`vista-${nombre}`).classList.add('activa');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (nombre === 'setlist') renderizarSetlist();
  if (nombre === 'inicio') renderizarCanciones();

  const barraSecciones = document.getElementById('barra-secciones');

  if (nombre !== 'cancion') {
    document.getElementById('barra-en-vivo').style.display = 'none';

    if (barraSecciones) {
      barraSecciones.style.display = 'none';
      barraSecciones.innerHTML = '';
    }
  }
}

/* ================================================
   RENDERIZADO DE CANCIONES
================================================ */
function renderizarCanciones() {
  const query = document.getElementById('input-buscar').value.toLowerCase().trim();
  const grid = document.getElementById('lista-canciones');
  const estadoVacio = document.getElementById('estado-vacio');
  const contador = document.getElementById('contador-canciones');

  const resultados = canciones.filter(c => {
    const matchBusqueda =
      c.titulo.toLowerCase().includes(query) ||
      c.artista.toLowerCase().includes(query) ||
      c.tono.toLowerCase().includes(query);
    const matchCategoria = filtroCategoria === '' || c.categoria === filtroCategoria;
    return matchBusqueda && matchCategoria;
  });

  const btnLimpiar = document.getElementById('btn-limpiar-buscar');
  btnLimpiar.classList.toggle('visible', query.length > 0);

  contador.textContent = (query || filtroCategoria)
    ? `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''}`
    : `${canciones.length} canción${canciones.length !== 1 ? 'es' : ''}`;

  if (resultados.length === 0) {
    grid.innerHTML = '';
    estadoVacio.style.display = 'block';
    return;
  }
  estadoVacio.style.display = 'none';
  grid.innerHTML = resultados.map(c => crearTarjeta(c)).join('');
}

function crearTarjeta(c) {
  const enSetlist = setlist.includes(c.id);
  return `
    <div class="cancion-card">
      ${c.categoria ? `<span class="card-categoria">${esc(c.categoria)}</span>` : ''}
      <div class="card-titulo">${esc(c.titulo)}</div>
      <div class="card-artista">${esc(c.artista)}</div>
      <div class="card-tono">♪ ${esc(c.tono)}</div>
      <div class="card-acciones">
        <button class="card-btn-acordes" onclick="abrirCancion('${c.id}', false)">Ver acordes</button>
        <button class="card-btn-setlist ${enSetlist ? 'en-setlist' : ''}" onclick="toggleSetlist('${c.id}', this)">
          ${enSetlist ? '✓ En setlist' : '+ Setlist'}
        </button>
      </div>
      ${c.usuario ? `<div class="card-usuario">↑ por ${esc(c.usuario)}</div>` : ''}
    </div>
  `;
}

/* ================================================
   FILTROS
================================================ */
function inicializarFiltros() {
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      filtroCategoria = btn.dataset.cat;
      renderizarCanciones();
    });
  });
}
function filtrarCanciones() { renderizarCanciones(); }
function limpiarBusqueda()  {
  document.getElementById('input-buscar').value = '';
  renderizarCanciones();
}

/* ================================================
   SETLIST
================================================ */
function toggleSetlist(id, btn) {
  if (setlist.includes(id)) {
    setlist = setlist.filter(x => x !== id);
    if (btn) { btn.textContent = '+ Setlist'; btn.classList.remove('en-setlist'); }
    mostrarToast('Canción quitada del setlist');
  } else {
    setlist.push(id);
    if (btn) { btn.textContent = '✓ En setlist'; btn.classList.add('en-setlist'); }
    mostrarToast('Canción agregada al setlist ✓');
  }
  guardarSetlist();
  actualizarBadgeSetlist();
}

function agregarDesdeDetalle() {
  if (!cancionActual) return;
  const id = cancionActual.id;
  const btn = document.getElementById('btn-agregar-detalle');
  if (setlist.includes(id)) {
    setlist = setlist.filter(x => x !== id);
    btn.textContent = '+ Agregar al setlist';
    btn.classList.remove('en-setlist');
    mostrarToast('Canción quitada del setlist');
  } else {
    setlist.push(id);
    btn.textContent = '✓ En setlist';
    btn.classList.add('en-setlist');
    mostrarToast('Canción agregada al setlist ✓');
  }
  guardarSetlist();
  actualizarBadgeSetlist();
}

function limpiarSetlist() {
  if (setlist.length === 0) return;
  if (!confirm('¿Limpiar el setlist?')) return;
  setlist = [];
  guardarSetlist();
  actualizarBadgeSetlist();
  renderizarSetlist();
  mostrarToast('Setlist limpiado');
}

function actualizarBadgeSetlist() {
  const badge = document.getElementById('badge-setlist');
  badge.textContent = setlist.length;
  badge.classList.remove('bounce');
  void badge.offsetWidth;
  badge.classList.add('bounce');
}

function moverEnSetlist(index, direccion) {
  const nuevoIndex = index + direccion;
  if (nuevoIndex < 0 || nuevoIndex >= setlist.length) return;
  [setlist[index], setlist[nuevoIndex]] = [setlist[nuevoIndex], setlist[index]];
  guardarSetlist();
  renderizarSetlist();
}

function quitarDelSetlist(id) {
  setlist = setlist.filter(x => x !== id);
  guardarSetlist();
  actualizarBadgeSetlist();
  renderizarSetlist();
  mostrarToast('Canción quitada del setlist');
}

/* ================================================
   RENDERIZADO DEL SETLIST
================================================ */
function renderizarSetlist() {
  const lista      = document.getElementById('setlist-lista');
  const estadoVacio = document.getElementById('setlist-vacio');
  const resumen    = document.getElementById('setlist-resumen');
  const countTexto = document.getElementById('setlist-count-texto');

  countTexto.textContent = `${setlist.length} canción${setlist.length !== 1 ? 'es' : ''}`;

  if (setlist.length === 0) {
    lista.innerHTML = '';
    estadoVacio.style.display = 'block';
    resumen.style.display = 'none';
    return;
  }
  estadoVacio.style.display = 'none';
  resumen.style.display = 'block';

  lista.innerHTML = setlist.map((id, i) => {
    const c = canciones.find(x => x.id === id);
    if (!c) return '';
    return `
      <li class="setlist-item">
        <div class="setlist-mover-btns">
          <button class="setlist-btn-mover" onclick="moverEnSetlist(${i}, -1)" ${i === 0 ? 'disabled' : ''} title="Subir">▲</button>
          <button class="setlist-btn-mover" onclick="moverEnSetlist(${i},  1)" ${i === setlist.length - 1 ? 'disabled' : ''} title="Bajar">▼</button>
        </div>
        <span class="setlist-num">${i + 1}</span>
        <div class="setlist-item-info">
          <div class="setlist-item-titulo">${esc(c.titulo)}</div>
          <div class="setlist-item-sub">${esc(c.artista)} · ${esc(c.tono)}${c.categoria ? ' · ' + esc(c.categoria) : ''}</div>
        </div>
        <div class="setlist-item-acciones">
          <button class="setlist-btn-ver" onclick="abrirCancion('${c.id}', true, ${i})">▶ En vivo</button>
          <button class="setlist-btn-quitar" onclick="quitarDelSetlist('${c.id}')">Quitar</button>
        </div>
      </li>
    `;
  }).join('');

  const resumenContenido = document.getElementById('setlist-resumen-contenido');
  resumenContenido.innerHTML = setlist.map((id, i) => {
    const c = canciones.find(x => x.id === id);
    if (!c) return '';
    return `
      <div class="resumen-fila">
        <span><span class="resumen-num">${i + 1}.</span> ${esc(c.titulo)} <span style="color:var(--color-text-muted);font-size:.8rem">— ${esc(c.artista)}</span></span>
        <span class="resumen-tono">${esc(c.tono)}</span>
      </div>
    `;
  }).join('');
}

/* ================================================
   ABRIR CANCIÓN
   enVivo: true  → viene del setlist, activa nav
   index:  posición en el setlist (si enVivo)
================================================ */
function abrirCancion(id, enVivo = false, index = -1) {
  const c = canciones.find(x => x.id === id);
  if (!c) return;

  cancionActual     = c;
  tonoActual        = c.tono;
  semitonosActuales = 0;
  tamanoFuente      = 16;
  soloLetra         = false;

  // Modo en vivo
  modoEnVivo  = enVivo;
  indexEnVivo = enVivo ? index : setlist.indexOf(id);
  // Si se abre desde tarjeta y la canción está en el setlist, igual habilitamos nav
  if (!enVivo && setlist.includes(id)) {
    modoEnVivo  = true;
    indexEnVivo = setlist.indexOf(id);
  }

  // Header meta
  document.getElementById('detalle-titulo').textContent    = c.titulo;
  document.getElementById('detalle-artista').textContent   = c.artista;
  document.getElementById('detalle-tono').textContent      = '♪ ' + c.tono;
  document.getElementById('detalle-categoria').textContent = c.categoria || '';
  document.getElementById('detalle-aportado').textContent  =
    c.usuario ? `Aportado por ${c.usuario}` : '';

  // Botón agregar setlist
  const btnAgregar = document.getElementById('btn-agregar-detalle');
  if (setlist.includes(id)) {
    btnAgregar.textContent = '✓ En setlist';
    btnAgregar.classList.add('en-setlist');
  } else {
    btnAgregar.textContent = '+ Agregar al setlist';
    btnAgregar.classList.remove('en-setlist');
  }

  // Botón modo letra
  actualizarBtnLetra();

  actualizarControlTono();
  renderizarAcordes(c.letra, 0);
renderizarBarraSecciones(c.letra);

mostrarVista('cancion');

actualizarBarraEnVivo();

}

/* ================================================
   MODO EN VIVO – BARRA DE NAVEGACIÓN
================================================ */
function actualizarBarraEnVivo() {
  const barra = document.getElementById('barra-en-vivo');
  if (!barra) return;

  if (!modoEnVivo || setlist.length === 0) {
    barra.style.display = 'none';
    return;
  }

  barra.style.display = 'flex';

  const total   = setlist.length;
  const idx     = indexEnVivo;
  const esPrimera = idx <= 0;
  const esUltima  = idx >= total - 1;

  // Indicador
  document.getElementById('env-indicador').textContent = `${idx + 1} / ${total}`;

  // Nombre canción actual en la barra
  const c = canciones.find(x => x.id === setlist[idx]);
  document.getElementById('env-nombre').textContent = c ? c.titulo : '';

  // Botones
  const btnAnt = document.getElementById('env-anterior');
  const btnSig = document.getElementById('env-siguiente');
  btnAnt.disabled = esPrimera;
  btnSig.disabled = esUltima;
}

function navegarEnVivo(delta) {
  if (!modoEnVivo) return;
  const nuevoIdx = indexEnVivo + delta;
  if (nuevoIdx < 0 || nuevoIdx >= setlist.length) return;
  const idDestino = setlist[nuevoIdx];
  abrirCancion(idDestino, true, nuevoIdx);
}

/* ================================================
   BARRA DE SECCIONES (scroll interno)
================================================ */
function renderizarBarraSecciones(letra) {
  const barra = document.getElementById('barra-secciones');
  if (!barra) return;

  // Extraer etiquetas de sección
  const secciones = [];
  const regex = /^\[([^\]]+)\]$/gm;
  let match;
  while ((match = regex.exec(letra)) !== null) {
    const label = match[1];
    // Excluir si es un acorde puro
    if (!/^[A-G][b#]?/.test(label)) {
      secciones.push(label);
    }
  }

  if (secciones.length <= 1) {
    barra.style.display = 'none';
    return;
  }

  barra.style.display = 'flex';
  barra.innerHTML = secciones.map(s =>
    `<button class="seccion-nav-btn" onclick="scrollASeccion('${esc(s)}')">${esc(s)}</button>`
  ).join('');
}

function scrollASeccion(nombre) {
  // Buscar el span con la clase seccion-label que tenga ese texto
  const labels = document.querySelectorAll('.seccion-label');
  for (const el of labels) {
    if (el.textContent.trim() === nombre) {
      // Offset por barras fijas: navbar + barra en vivo + barra secciones
      const navbarH   = document.querySelector('.navbar')?.offsetHeight || 60;
      const enVivoH   = document.getElementById('barra-en-vivo')?.offsetHeight || 0;
      const seccionH  = document.getElementById('barra-secciones')?.offsetHeight || 0;
      const totalOffset = navbarH + enVivoH + seccionH + 12;
      const y = el.getBoundingClientRect().top + window.scrollY - totalOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }
  }
}

/* ================================================
   VISTA SOLO LETRA / CON ACORDES
================================================ */
function toggleLetra() {
  soloLetra = !soloLetra;
  actualizarBtnLetra();
  renderizarAcordes(cancionActual.letra, semitonosActuales);
}

function actualizarBtnLetra() {
  const btn = document.getElementById('btn-solo-letra');
  if (!btn) return;
  btn.textContent    = soloLetra ? '🎸 Con acordes' : '🎤 Solo letra';
  btn.title          = soloLetra ? 'Mostrar acordes' : 'Ocultar acordes';
  btn.classList.toggle('activo', soloLetra);
}

/* ================================================
   VISTA DE ACORDES – RENDER
================================================ */
function renderizarAcordes(letra, semitonos) {
  const contenido = document.getElementById('acordes-contenido');
  contenido.style.fontSize = tamanoFuente + 'px';

  const lineas = letra.split('\n');
  let html = '';
  let seccionIdx = 0;

  for (const linea of lineas) {
    const trimmed = linea.trim();

    // Etiqueta de sección
    if (/^\[(?!.*[A-G][b#]?\d*(?:m|maj|min|sus|add|aug|dim)?)\w[\w\s\-]*\]$/.test(trimmed) && !esLineaDeAcordes(trimmed)) {
      const label = trimmed.slice(1, -1);
      html += `<span class="seccion-label" data-seccion="${esc(label)}">${esc(label)}</span>`;
      seccionIdx++;
      continue;
    }

    if (trimmed === '') { html += '<br/>'; continue; }

    html += procesarLinea(linea, semitonos);
  }

  contenido.innerHTML = html;

  // Si modo solo letra, ocultar filas de acordes
  if (soloLetra) {
    contenido.querySelectorAll('.linea-acordes').forEach(el => {
      el.style.display = 'none';
    });
  }
}

function esLineaDeAcordes(str) {
  return (str.match(/\[/g) || []).length > 1;
}

function procesarLinea(linea, semitonos) {
  const regex = /\[([A-G][b#]?(?:m|maj|min|sus|add|aug|dim|7|9|11|13)*(?:\d)*(?:\/[A-G][b#]?)?)\]/g;

  if (!regex.test(linea)) {
    return `<span class="linea-acordes-grupo"><span class="linea-letra">${esc(linea)}</span></span>`;
  }

  regex.lastIndex = 0;
  let acordesRow = '';
  let letraRow   = '';
  let lastIndex  = 0;
  let match;

  while ((match = regex.exec(linea)) !== null) {
    const textoAntes = linea.slice(lastIndex, match.index);
    acordesRow += ' '.repeat(textoAntes.length);
    letraRow   += textoAntes;

    const acordeOriginal   = match[1];
    const acordeTransp     = transponerAcorde(acordeOriginal, semitonos);
    acordesRow += acordeTransp;

    const diff = acordeTransp.length - match[0].length + 2;
    if (diff > 0) letraRow += ' '.repeat(diff);

    lastIndex = match.index + match[0].length;
  }

  const textoDespues = linea.slice(lastIndex);
  acordesRow += ' '.repeat(textoDespues.length);
  letraRow   += textoDespues;

  return `
    <span class="linea-acordes-grupo">
      <span class="linea-acordes">${esc(acordesRow)}</span>
      <span class="linea-letra">${esc(letraRow)}</span>
    </span>
  `;
}

/* ================================================
   TRANSPOSICIÓN
================================================ */
function transponerAcorde(acorde, semitonos) {
  if (semitonos === 0) return acorde;
  const match = acorde.match(/^([A-G][b#]?)((?:m|maj|min|sus|add|aug|dim|7|9|11|13)*)?(\/([A-G][b#]?))?$/);
  if (!match) return acorde;
  const raiz   = match[1];
  const sufijo = match[2] || '';
  const bajo   = match[4] || null;
  return transponerNota(raiz, semitonos) + sufijo + (bajo ? '/' + transponerNota(bajo, semitonos) : '');
}

function transponerNota(nota, semitonos) {
  const usaBemol = nota.includes('b');
  const escala   = usaBemol ? NOTAS_BEMOL : NOTAS_SOSTENIDO;
  let idx = escala.indexOf(nota);
  if (idx === -1) {
    const otra = usaBemol ? NOTAS_SOSTENIDO : NOTAS_BEMOL;
    idx = otra.indexOf(nota);
    if (idx === -1) return nota;
  }
  return escala[((idx + semitonos) % 12 + 12) % 12];
}

function cambiarTono(delta) {
  if (!cancionActual) return;
  semitonosActuales += delta;
  tonoActual = transponerNota(cancionActual.tono, semitonosActuales);
  actualizarControlTono();
  renderizarAcordes(cancionActual.letra, semitonosActuales);
}

function actualizarControlTono() {
  const el = document.getElementById('ctrl-tono-actual');
  if (el) el.textContent = tonoActual;
}

function cambiarFuente(delta) {
  tamanoFuente = Math.max(12, Math.min(32, tamanoFuente + delta));
  const el = document.getElementById('acordes-contenido');
  if (el) el.style.fontSize = tamanoFuente + 'px';
}

/* ================================================
   AUTO SCROLL
================================================ */
function toggleAutoscroll() {
  const btn = document.getElementById('btn-autoscroll');
  if (autoscrollInterval) {
    detenerAutoscroll();
  } else {
    if (btn) { btn.textContent = '⏸ Detener'; btn.classList.add('activo'); }
    autoscrollInterval = setInterval(() => window.scrollBy({ top: 1, behavior: 'smooth' }), 50);
  }
}

function detenerAutoscroll() {
  if (autoscrollInterval) {
    clearInterval(autoscrollInterval);
    autoscrollInterval = null;
    const btn = document.getElementById('btn-autoscroll');
    if (btn) { btn.textContent = '⏩ Auto scroll'; btn.classList.remove('activo'); }
  }
}

/* ================================================
   FORMULARIO: SUBIR / EDITAR CANCIÓN
================================================ */
function abrirFormularioCancion(idEditar = null) {
  modoEdicion = idEditar;
  const modal  = document.getElementById('modal-cancion');
  const titulo = document.getElementById('modal-titulo-texto');

  if (idEditar) {
    const c = canciones.find(x => x.id === idEditar);
    if (!c) return;
    titulo.textContent = 'Editar canción';
    document.getElementById('campo-titulo').value    = c.titulo;
    document.getElementById('campo-artista').value   = c.artista;
    document.getElementById('campo-tono').value      = c.tono;
    document.getElementById('campo-categoria').value = c.categoria || '';
    document.getElementById('campo-usuario').value   = c.usuario || '';
    document.getElementById('campo-acordes').value   = c.letra;
  } else {
    titulo.textContent = 'Subir canción';
    ['campo-titulo','campo-artista','campo-usuario','campo-acordes'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('campo-tono').value      = '';
    document.getElementById('campo-categoria').value = '';
  }

  document.getElementById('modal-error').style.display = 'none';
  modal.style.display = 'flex';
  document.getElementById('campo-titulo').focus();
}

function editarCancionActual() {
  if (!cancionActual) return;
  abrirFormularioCancion(cancionActual.id);
}

function cerrarModal() {
  document.getElementById('modal-cancion').style.display = 'none';
  modoEdicion = null;
}

function cerrarModalSiOverlay(e) {
  if (e.target === document.getElementById('modal-cancion')) cerrarModal();
}

function guardarCancion() {
  const titulo    = document.getElementById('campo-titulo').value.trim();
  const artista   = document.getElementById('campo-artista').value.trim();
  const tono      = document.getElementById('campo-tono').value;
  const categoria = document.getElementById('campo-categoria').value;
  const usuario   = document.getElementById('campo-usuario').value.trim();
  const letra     = document.getElementById('campo-acordes').value.trim();
  const errorEl   = document.getElementById('modal-error');

  if (!titulo || !artista || !tono || !letra) {
    errorEl.textContent = 'Por favor completa los campos obligatorios (*)';
    errorEl.style.display = 'block';
    return;
  }
  errorEl.style.display = 'none';

  if (modoEdicion) {
    const idx = canciones.findIndex(x => x.id === modoEdicion);
    if (idx !== -1) {
      canciones[idx] = { ...canciones[idx], titulo, artista, tono, categoria, usuario, letra };
      if (cancionActual && cancionActual.id === modoEdicion) abrirCancion(modoEdicion, modoEnVivo, indexEnVivo);
    }
    mostrarToast('Canción actualizada ✓');
  } else {
    const nuevaId = 'cancion-' + Date.now();
    canciones.unshift({ id: nuevaId, titulo, artista, tono, categoria, usuario, letra });
    mostrarToast('Canción subida ✓');
  }

  guardarCanciones();
  cerrarModal();
  renderizarCanciones();
}

/* ================================================
   COMPARTIR SETLIST
================================================ */
function compartirSetlist() {
  if (setlist.length === 0) {
    mostrarToast('Agrega canciones al setlist primero');
    return;
  }
  // Codificar los ids del setlist en base64 dentro de un query param
  const payload = encodeURIComponent(btoa(JSON.stringify(setlist)));
  const url = `${location.origin}${location.pathname}?setlist=${payload}`;

  navigator.clipboard.writeText(url)
    .then(() => mostrarToast('Link del setlist copiado ✓'))
    .catch(() => {
      // Fallback: mostrar el link en un prompt si el clipboard falla
      prompt('Copia este link manualmente:', url);
    });
}

/* Revisa al cargar si la URL trae un setlist importado */
function importarSetlistDesdeURL() {
  const params = new URLSearchParams(location.search);
  const raw = params.get('setlist');
  if (!raw) return;

  try {
    const ids = JSON.parse(atob(decodeURIComponent(raw)));
    if (!Array.isArray(ids) || ids.length === 0) return;
    setlist = ids;
    guardarSetlist();
    actualizarBadgeSetlist();
    mostrarToast('Setlist importado ✓');
    // Limpiar el query param de la URL sin recargar la página
    history.replaceState(null, '', location.pathname);
    // Ir directo al setlist para que el músico lo vea
    mostrarVista('setlist');
  } catch (e) {
    console.warn('Setlist inválido en URL:', e);
  }
}

/* ================================================
   UTILIDADES
================================================ */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let toastTimeout = null;
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.add('visible');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 2200);
}
