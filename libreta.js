// Libreta de algoritmos: índice y fichas técnicas.
// index.html la carga como script externo y le pasa lo que necesita.
(function () {
  'use strict';

  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;

  var PALETA = ['#e0951a', '#cf4a1f', '#3a7d65', '#a65d1a', '#0097b2', '#2b8cf0', '#c96ae8'];

  // Escuelas de pensamiento que ofrece el formulario. Para agregar una fija, añádela a esta lista.
  // (También puedes crear una nueva desde el formulario con la opción "Otra...".)
  var ESCUELAS_BASE = ['Divide y vencerás', 'Programación dinámica', 'Voraces'];
  var SIN_CLASIFICAR = 'Sin clasificar';
  var OTRA = '__otra__';

  var PREGUNTAS = {
    comprension: '¿Qué tan fácil o difícil fue entender este algoritmo? ¿Se ha comprendido ya por completo?',
    uso: '¿Tienes claridad de cuándo sería conveniente utilizar este algoritmo en la construcción de alguna aplicación de software?',
    reto: '¿Qué es lo más retador para implementar este algoritmo con tus habilidades de programación?',
    implementacion: 'En caso de que lo hayas implementado, agrega tu código y comenta cuáles fueron los retos de implementación y cómo la IA te apoyó en caso de que la hayas utilizado.'
  };

  // ---------- Estilos de esta sección ----------
  var CSS = [
    '.lib-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }',
    '.lib-title { font-family: var(--display); font-weight: 400; font-size: clamp(48px, 11vw, 104px); line-height: 0.95; margin: 0; text-transform: uppercase; }',
    '.lib-count { margin: 6px 0 0; color: var(--muted); font-size: 14px; }',
    '.lib-btn { padding: 8px 14px; border-radius: 10px; border: 1.5px solid var(--line); background: var(--cell); color: var(--ink); font: 600 13px var(--body); cursor: pointer; }',
    '.lib-btn:hover { background: var(--pick); }',
    '.lib-btn:disabled { opacity: 0.5; cursor: not-allowed; }',
    '.lib-btn:focus-visible, .lib-item:focus-visible, .lib-buscar:focus-visible { outline: 3px solid var(--panel); outline-offset: 2px; }',
    '.lib { display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); }',
    '@media (min-width: 920px) { .lib { grid-template-columns: 300px minmax(0, 1fr); align-items: start; } .lib-volver { display: none; } .lib-indice { position: sticky; top: 16px; max-height: calc(100vh - 32px); overflow-y: auto; } }',
    '@media (max-width: 919px) { .lib[data-ficha="1"] .lib-indice { display: none; } .lib[data-ficha="0"] .lib-ficha { display: none; } }',
    '.lib-indice, .lib-ficha { background: var(--cell); color: var(--ink); border: 1.5px solid var(--line); border-radius: 14px; padding: 20px 18px; }',
    '.lib-ind-titulo { font-family: var(--display); font-weight: 400; font-size: 28px; line-height: 1; margin: 0 0 12px; text-transform: uppercase; }',
    '.lib-buscar { width: 100%; padding: 10px 12px; margin-bottom: 8px; border-radius: 10px; border: 1.5px solid var(--line); background: var(--bg); color: var(--ink); font: 400 16px var(--body); }',
    '.lib-grupo h3 { display: flex; align-items: center; gap: 8px; margin: 16px 0 6px; font: 700 12px var(--body); letter-spacing: 0.06em; text-transform: uppercase; }',
    '.lib-punto { width: 10px; height: 10px; border-radius: 999px; flex: none; }',
    '.lib-cuenta { color: var(--muted); font-weight: 600; }',
    '.lib-item { display: block; width: 100%; text-align: left; padding: 8px 10px; border-radius: 10px; border: 1.5px solid transparent; background: transparent; color: var(--ink); font: 400 15px var(--body); cursor: pointer; }',
    '.lib-item:hover { background: var(--pick); }',
    '.lib-item[aria-current="true"] { border-color: var(--line); background: var(--pick); font-weight: 700; }',
    '.lib-ficha h2 { font-family: var(--display); font-weight: 400; font-size: clamp(34px, 6vw, 58px); line-height: 1; margin: 0 0 6px; text-transform: uppercase; }',
    '.lib-escuela { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 4px; font-size: 13px; font-weight: 700; }',
    '.lib-meta { margin: 0 0 18px; font-size: 12px; color: var(--muted); }',
    '.lib-sec { margin: 0 0 20px; }',
    '.lib-sec h4 { margin: 0 0 6px; font: 700 13px var(--body); letter-spacing: 0.05em; text-transform: uppercase; }',
    '.lib-sec p, .lib-sec li { margin: 0 0 6px; font-size: 15px; line-height: 1.5; white-space: pre-line; }',
    '.lib-sec ul { margin: 0; padding-left: 20px; }',
    '.lib-sec a { color: var(--ink); text-decoration: underline; word-break: break-word; }',
    '.lib-vacio { color: var(--muted); font-style: italic; }',
    '.lib-code { margin: 0; padding: 12px; overflow-x: auto; background: var(--bg); border: 1.5px solid var(--line); border-radius: 10px; font: 400 13px/1.5 ui-monospace, Menlo, Consolas, monospace; white-space: pre; }',
    '.lib-q { margin: 10px 0 3px; font-size: 13px; font-style: italic; color: var(--muted); white-space: normal; }',
    '.lib-volver { margin-bottom: 14px; }',
    '.lib-btn.lib-primario { background: var(--ink); color: var(--bg); }',
    '.lib-btn.lib-primario:hover { background: var(--ink); opacity: 0.9; }',
    '.lib-nueva { width: 100%; margin-bottom: 10px; }',
    '.lib-aviso { margin: 0 0 12px; padding: 9px 11px; border: 1.5px solid var(--today); border-radius: 10px; color: var(--today); font-size: 13px; font-weight: 600; line-height: 1.4; }',
    '.lib-acciones { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }',
    '.lib-error { margin: 12px 0 0; padding: 9px 11px; border: 1.5px solid var(--today); border-radius: 10px; color: var(--today); font-size: 14px; font-weight: 600; line-height: 1.4; }',
    '.lib-form h2 { font-family: var(--display); font-weight: 400; font-size: clamp(30px, 5vw, 46px); line-height: 1; margin: 0 0 4px; text-transform: uppercase; }',
    '.lib-campo { margin: 0 0 18px; }',
    '.lib-campo > label, .lib-campo > .lib-etq { display: block; margin: 0 0 6px; font: 700 13px var(--body); letter-spacing: 0.03em; }',
    '.lib-campo .lib-ayuda { margin: 0 0 6px; color: var(--muted); font-size: 12px; font-style: italic; line-height: 1.4; }',
    '.lib-campo input[type="text"], .lib-campo textarea, .lib-campo select { width: 100%; padding: 10px 11px; border-radius: 10px; border: 1.5px solid var(--line); background: var(--bg); color: var(--ink); font: 400 16px var(--body); }',
    '.lib-campo textarea { min-height: 96px; resize: vertical; line-height: 1.45; }',
    '.lib-campo textarea.lib-mono { min-height: 150px; font: 400 14px/1.5 ui-monospace, Menlo, Consolas, monospace; white-space: pre; overflow-x: auto; }',
    '.lib-campo input:focus-visible, .lib-campo textarea:focus-visible, .lib-campo select:focus-visible { outline: 3px solid var(--panel); outline-offset: 2px; }',
    '.lib-dos { display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr); } @media (min-width: 620px) { .lib-dos { grid-template-columns: 1fr 1fr; } }',
    '.lib-liga { display: grid; gap: 8px; grid-template-columns: minmax(0, 1fr); margin-bottom: 10px; padding: 10px; border: 1.5px dashed var(--line); border-radius: 10px; } @media (min-width: 620px) { .lib-liga { grid-template-columns: 1fr 1.4fr auto; align-items: center; } }',
    '.lib-sub { margin: 14px 0 6px; font: 700 12px var(--body); letter-spacing: 0.05em; text-transform: uppercase; }',
    '.lib-barra { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px; }',
    '.lib-borrador { margin: 0 0 14px; padding: 9px 11px; border: 1.5px dashed var(--line); border-radius: 10px; font-size: 13px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }',
    '.lib-ficha .coments { border-top-color: var(--line); }',
    '.lib-ficha .coment { background: var(--bg); border: 1.5px solid var(--line); }',
    '.lib-ficha .coments textarea { border-color: var(--line); }',
    '.lib-ficha .btn { color: var(--ink); border-color: var(--line); }',
    '.lib-ficha .btn:hover { background: var(--pick); }',
    '.lib-ficha .btn.solid { background: var(--ink); color: var(--bg); }',
    '.lib-ficha .panel-error { background: transparent; border: 1.5px solid var(--today); color: var(--today); }'
  ].join('\n') + '\n' + temaLibreta();

  if (!document.querySelector('style[data-libreta]')) {
    var estilo = document.createElement('style');
    estilo.setAttribute('data-libreta', '1');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);
  }

  // ---------- Tema de libreta de estudio (hojas rayadas, anillos, separadores, marcatextos) ----------
  function temaLibreta() {
    function svg(x) { return 'url("data:image/svg+xml,' + encodeURIComponent(x) + '")'; }
    // Anillos: dos agujeros y un alambre metálico que cruza el lomo (escritorio) o sale por arriba (móvil).
    var anilloV = svg('<svg xmlns="http://www.w3.org/2000/svg" width="56" height="36" viewBox="0 0 56 36">' +
      '<circle cx="7" cy="18" r="5" fill="#2e2c2a"/><circle cx="49" cy="18" r="5" fill="#2e2c2a"/>' +
      '<rect x="7" y="15.2" width="42" height="5.6" rx="2.8" fill="#8b9097"/>' +
      '<rect x="8" y="15.9" width="40" height="1.7" rx="0.85" fill="#e3e6ea"/>' +
      '<rect x="8" y="19.3" width="40" height="1" rx="0.5" fill="#575c62" opacity="0.75"/></svg>');
    var anilloH = svg('<svg xmlns="http://www.w3.org/2000/svg" width="36" height="34" viewBox="0 0 36 34">' +
      '<circle cx="18" cy="26" r="5" fill="#2e2c2a"/>' +
      '<rect x="15.2" y="3" width="5.6" height="23" rx="2.8" fill="#8b9097"/>' +
      '<rect x="15.9" y="4" width="1.7" height="21" rx="0.85" fill="#e3e6ea"/>' +
      '<rect x="19.3" y="4" width="1" height="21" rx="0.5" fill="#575c62" opacity="0.75"/></svg>');

    var claro =
      '--papel: #fffdf6; --raya: rgba(110, 150, 200, 0.30); --margen: rgba(214, 90, 90, 0.5); --tinta: #2b2b2b; --tinta-suave: #6d6b66; --sombra: rgba(50, 35, 20, 0.28);' +
      '--p-azul: #1e5fb8; --p-verde: #17784a; --p-rojo: #c62828; --p-morado: #7a3fb0; --p-naranja: #b85a08; --p-turquesa: #0a7a8f;' +
      '--mk-amarillo: #fff07a; --mk-verde: #b4f2c8; --mk-rosa: #ffc4dc; --mk-azul: #bfe3ff; --on-azul: #ffffff;';
    var oscuro =
      '--papel: #2a2927; --raya: rgba(140, 170, 215, 0.20); --margen: rgba(235, 125, 125, 0.45); --tinta: #ece8df; --tinta-suave: #aaa69c; --sombra: rgba(0, 0, 0, 0.55);' +
      '--p-azul: #86b6ff; --p-verde: #6fd49b; --p-rojo: #ff8f86; --p-morado: #c9a0ff; --p-naranja: #ffb36b; --p-turquesa: #62d4e8;' +
      '--mk-amarillo: rgba(255, 233, 60, 0.36); --mk-verde: rgba(105, 240, 174, 0.30); --mk-rosa: rgba(255, 128, 171, 0.34); --mk-azul: rgba(100, 181, 246, 0.34); --on-azul: #0d2342;';

    return [
      '.lib-libro { ' + claro + ' --manuscrita: "Caveat", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive; }',
      '.lib-libro .lib-ficha { --acento-texto: var(--acento-t1); } .lib-libro .lib-grupo { --esc-texto: var(--esc-t1); }',
      '@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .lib-libro { ' + oscuro + ' } :root:not([data-theme="light"]) .lib-libro .lib-ficha { --acento-texto: var(--acento-t2); } :root:not([data-theme="light"]) .lib-libro .lib-grupo { --esc-texto: var(--esc-t2); } }',
      ':root[data-theme="dark"] .lib-libro { ' + oscuro + ' }',
      ':root[data-theme="dark"] .lib-libro .lib-ficha { --acento-texto: var(--acento-t2); } :root[data-theme="dark"] .lib-libro .lib-grupo { --esc-texto: var(--esc-t2); }',
      '.lib-libro .lib-title { pointer-events: none; }',
      '@media (min-width: 920px) { .lib-libro { padding-right: 122px; } }',

      /* Tapa de la libreta: cambia de color con la escuela de la ficha abierta */
      '.lib-libro .lib { position: relative; gap: 0; padding: 14px; border-radius: 18px; background: var(--tapa, #46557f); box-shadow: 0 12px 26px rgba(0, 0, 0, 0.3), inset 0 0 0 2px rgba(255, 255, 255, 0.14); align-items: stretch; }',
      '@media (min-width: 920px) { .lib-libro .lib { grid-template-columns: 345px 28px minmax(0, 1fr); align-items: stretch; min-height: 560px; } }',

      /* Hojas rayadas con margen rojo */
      '.lib-libro .lib-indice, .lib-libro .lib-ficha { position: relative; z-index: 1; min-width: 0; color: var(--tinta); background-color: var(--papel); border: 1px solid rgba(0, 0, 0, 0.25);' +
        ' background-image: linear-gradient(90deg, transparent 52px, var(--margen) 52px, var(--margen) 54px, transparent 54px), repeating-linear-gradient(to bottom, transparent 0, transparent 27px, var(--raya) 27px, var(--raya) 28px);' +
        ' padding: 27px 24px 28px 72px; max-height: none; top: auto; overflow: visible; }',
      '.lib-libro .lib-indice { border-radius: 14px 2px 2px 14px; box-shadow: inset -16px 0 18px -16px rgba(0, 0, 0, 0.32); }',
      '.lib-libro .lib-ficha { border-radius: 2px 14px 14px 2px; box-shadow: inset 16px 0 18px -16px rgba(0, 0, 0, 0.32); padding-top: 55px; }',

      /* Anillos */
      '.lib-libro .lib-anillos { display: none; }',
      '@media (min-width: 920px) { .lib-libro .lib-anillos { display: block; position: relative; z-index: 3; margin: 0 -14px; background-image: ' + anilloV + '; background-repeat: repeat-y; background-position: center top; background-size: 56px 36px; } }',
      '@media (max-width: 919px) {',
      '  .lib-libro .lib { padding: 10px 10px 14px; }',
      '  .lib-libro .lib-anillos { display: block; order: -1; height: 34px; margin: -2px 0 -20px; position: relative; z-index: 3; background-image: ' + anilloH + '; background-repeat: repeat-x; background-position: left top; background-size: 36px 34px; }',
      '  .lib-libro .lib-indice, .lib-libro .lib-ficha { border-radius: 10px; padding: 34px 16px 28px 50px; background-image: linear-gradient(90deg, transparent 36px, var(--margen) 36px, var(--margen) 38px, transparent 38px), repeating-linear-gradient(to bottom, transparent 0, transparent 27px, var(--raya) 27px, var(--raya) 28px); }',
      '  .lib-libro .lib-ficha { padding-top: 40px; }',
      '}',

      /* Separadores laterales por escuela */
      '.lib-libro .lib-pestanas { display: flex; flex-direction: column; gap: 8px; }',
      '@media (min-width: 920px) { .lib-libro .lib-pestanas { position: absolute; z-index: 2; top: 40px; right: -122px; width: 136px; } }',
      '@media (max-width: 919px) { .lib-libro .lib-pestanas { order: -2; flex-direction: row; overflow-x: auto; padding: 2px 2px 14px; } .lib-libro .lib[data-ficha="1"] .lib-pestanas { display: none; } }',
      '.lib-tab { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-height: 40px; padding: 8px 10px 8px 14px; text-align: left; cursor: pointer; color: #2b2b2b; background: var(--tab, #e6e7ea); border: 1.5px solid rgba(0, 0, 0, 0.5); border-left: 0; border-radius: 0 12px 12px 0; box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25); font: 700 13px/1.15 var(--body); transition: transform 0.12s ease; }',
      '.lib-tab[aria-pressed="true"] { background: var(--tab-sel, #c9cbd1); transform: translateX(10px); box-shadow: 3px 4px 8px rgba(0, 0, 0, 0.35); }',
      '.lib-tab:hover { filter: brightness(1.04); }',
      '.lib-tab:focus-visible { outline: 3px solid #fff; outline-offset: 1px; }',
      '.lib-tab-n { flex: none; min-width: 22px; height: 22px; padding: 0 5px; border-radius: 11px; background: rgba(255, 255, 255, 0.75); font: 700 12px/22px var(--body); text-align: center; }',
      '@media (max-width: 919px) { .lib-tab { flex: none; border-left: 1.5px solid rgba(0, 0, 0, 0.5); border-radius: 10px; } .lib-tab[aria-pressed="true"] { transform: none; } }',

      /* Índice (hoja izquierda) */
      '.lib-libro .lib-ind-titulo { display: inline-block; margin: 0 0 4px; font: 700 40px/1 var(--manuscrita); text-transform: none; color: var(--p-azul); background: linear-gradient(transparent 68%, var(--mk-amarillo) 68%, var(--mk-amarillo) 92%, transparent 92%); padding: 0 6px; }',
      '.lib-libro .lib-buscar { border: none; border-bottom: 2px solid var(--tinta-suave); border-radius: 0; background: transparent; color: var(--tinta); font: 500 23px/1.1 var(--manuscrita); padding: 4px 2px; margin: 6px 0 4px; }',
      '.lib-libro .lib-buscar::placeholder { color: var(--tinta-suave); }',
      '.lib-libro .lib-grupo h3 { display: inline-block; margin: 12px 0 2px; padding-bottom: 0; font: 700 25px/1.05 var(--manuscrita); letter-spacing: 0; text-transform: none; color: var(--esc-texto, var(--tinta)); border-bottom: 3px solid var(--esc, var(--tinta)); }',
      '.lib-libro .lib-cuenta { font: 500 20px var(--manuscrita); color: var(--tinta-suave); }',
      '.lib-libro .lib-item { display: flex; align-items: baseline; gap: 6px; width: 100%; padding: 0 4px; border: none; border-radius: 0; background: transparent; color: var(--tinta); font: 400 17px/28px var(--body); text-align: left; cursor: pointer; }',
      '.lib-libro .lib-item:hover .lib-item-nombre { text-decoration: underline; text-decoration-color: var(--esc, var(--tinta)); text-decoration-thickness: 2px; }',
      '.lib-libro .lib-item[aria-current="true"] { background: transparent; }',
      '.lib-libro .lib-item[aria-current="true"] .lib-item-nombre { font-weight: 700; background: linear-gradient(transparent 18%, var(--mk-amarillo) 18%, var(--mk-amarillo) 90%, transparent 90%); padding: 0 4px; }',
      '.lib-libro .lib-puntos { flex: 1 1 auto; min-width: 12px; border-bottom: 2px dotted var(--tinta-suave); transform: translateY(-5px); opacity: 0.7; }',
      '.lib-libro .lib-pagn { font: 500 22px/1 var(--manuscrita); color: var(--tinta-suave); }',
      '.lib-libro .lib-vacio { color: var(--tinta-suave); font-style: italic; }',

      /* Botones sobre papel */
      '.lib-libro .lib-btn { background: var(--papel); color: var(--tinta); border-color: var(--tinta); }',
      '.lib-libro .lib-btn:hover { background: var(--mk-amarillo); color: #2b2b2b; }',
      '.lib-libro .lib-btn.lib-primario { background: var(--p-azul); color: var(--on-azul); border-color: transparent; }',
      '.lib-libro .lib-btn.lib-primario:hover { background: var(--p-azul); opacity: 0.92; color: var(--on-azul); }',
      '.lib-libro .lib-nueva { margin: 10px 0 6px; }',

      /* Ficha (hoja derecha) */
      '.lib-cinta { position: absolute; top: -13px; left: 50%; width: 120px; height: 30px; transform: translateX(-50%) rotate(-2deg); background: var(--acento-suave, rgba(200, 200, 200, 0.5)); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22); pointer-events: none; z-index: 2; }',
      '.lib-libro .lib-encabezado { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; }',
      '.lib-libro .lib-ficha h2 { margin: 0; font-weight: 400; line-height: 1.16; }',
      '.lib-nombre { font: 400 clamp(32px, 4.2vw, 50px)/1.2 Anton, Impact, "Arial Narrow", sans-serif; text-transform: uppercase; letter-spacing: 0.01em; padding: 0 0.16em; background: linear-gradient(transparent 60%, var(--acento-suave, #fff07a) 60%, var(--acento-suave, #fff07a) 93%, transparent 93%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }',
      '.lib-pag { flex: none; padding-top: 6px; font: 500 24px/1 var(--manuscrita); color: var(--tinta-suave); white-space: nowrap; }',
      '.lib-libro .lib-escuela { display: inline-flex; margin: 8px 0 0; font: 700 28px/1 var(--manuscrita); color: var(--acento-texto, var(--tinta)); transform: rotate(-1deg); }',
      '.lib-libro .lib-meta { margin: 6px 0 26px; font: 400 12px/1.4 var(--body); color: var(--tinta-suave); }',

      '.lib-libro .lib-sec { margin: 0 0 28px; }',
      '.lib-libro .lib-sec h4 { display: inline-block; margin: 0 0 6px; font: 700 27px/28px var(--manuscrita); letter-spacing: 0; text-transform: none; color: var(--pluma, var(--tinta)); text-decoration: underline; text-decoration-color: var(--pluma, var(--tinta)); text-decoration-thickness: 3px; text-underline-offset: 6px; text-decoration-skip-ink: none; }',
      '.lib-libro .lib-num { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; margin-right: 8px; border: 2.5px solid var(--pluma, var(--tinta)); border-radius: 50%; font: 700 19px/1 var(--manuscrita); text-decoration: none; vertical-align: 1px; }',
      '.lib-libro .lib-sec[data-s="2"] { --pluma: var(--p-azul); }',
      '.lib-libro .lib-sec[data-s="3"] { --pluma: var(--p-verde); }',
      '.lib-libro .lib-sec[data-s="4"] { --pluma: var(--p-rojo); }',
      '.lib-libro .lib-sec[data-s="4"] h4 { text-decoration-style: wavy; text-decoration-thickness: 2px; }',
      '.lib-libro .lib-sec[data-s="5"] { --pluma: var(--acento-texto, var(--p-naranja)); }',
      '.lib-libro .lib-sec[data-s="6"] { --pluma: var(--p-morado); }',
      '.lib-libro .lib-sec[data-s="7"] { --pluma: var(--p-turquesa); }',
      '.lib-libro .lib-sec[data-s="8"] { --pluma: var(--p-azul); }',
      '.lib-libro .lib-sec[data-s="9"] { --pluma: var(--p-verde); }',
      '.lib-libro .lib-sec[data-s="10"] { --pluma: var(--p-naranja); }',
      '.lib-libro .lib-sec p, .lib-libro .lib-sec li { margin: 0 0 2px; font: 400 17px/28px var(--body); color: var(--tinta); }',
      '.lib-libro .lib-sec ul { margin: 0; padding-left: 22px; list-style: square; }',
      '.lib-libro .lib-sec a { color: var(--p-azul); text-decoration-thickness: 2px; text-underline-offset: 3px; font-weight: 600; }',

      /* Subrayado con marcatextos */
      '.lib-mk { padding: 0 5px; color: inherit; font-weight: 700; background: linear-gradient(transparent 16%, var(--mk-amarillo) 16%, var(--mk-amarillo) 90%, transparent 90%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }',
      '.lib-mk.verde { background: linear-gradient(transparent 16%, var(--mk-verde) 16%, var(--mk-verde) 90%, transparent 90%); }',
      '.lib-mk.rosa { background: linear-gradient(transparent 16%, var(--mk-rosa) 16%, var(--mk-rosa) 90%, transparent 90%); }',
      '.lib-mk.acento { background: linear-gradient(transparent 16%, var(--acento-suave, #fff07a) 16%, var(--acento-suave, #fff07a) 90%, transparent 90%); }',

      /* Pseudocódigo y código como tarjeta */
      '.lib-libro .lib-code { margin: 4px 0 6px; padding: 12px 14px; border: none; border-left: 5px solid var(--p-turquesa); border-radius: 4px 8px 8px 4px; background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), var(--papel); color: var(--tinta); font: 400 13.5px/1.55 ui-monospace, Menlo, Consolas, monospace; }',

      /* Reflexiones como notas adhesivas */
      '.lib-posts { display: grid; gap: 22px 18px; grid-template-columns: minmax(0, 1fr); margin-top: 8px; }',
      '@media (min-width: 1180px) { .lib-posts { grid-template-columns: 1fr 1fr; } .lib-post:nth-child(4) { grid-column: 1 / -1; } }',
      '.lib-post { position: relative; padding: 18px 16px 14px; border-radius: 3px 3px 16px 3px; box-shadow: 0 4px 9px rgba(0, 0, 0, 0.22); color: #2b2b2b; }',
      '.lib-post::before { content: ""; position: absolute; top: -9px; left: 50%; width: 64px; height: 18px; transform: translateX(-50%) rotate(-2deg); background: rgba(255, 255, 255, 0.55); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15); }',
      '.lib-post.amarillo { background: #fff59d; transform: rotate(-0.6deg); }',
      '.lib-post.rosa { background: #f8bbd9; transform: rotate(0.5deg); }',
      '.lib-post.azul { background: #b3e5fc; transform: rotate(-0.4deg); }',
      '.lib-post.verde { background: #c8e6c9; transform: rotate(0.6deg); }',
      '.lib-libro .lib-post .lib-q { margin: 0 0 8px; font: 700 21px/1.12 var(--manuscrita); font-style: normal; color: #2b2b2b; white-space: normal; }',
      '.lib-libro .lib-post p { color: #2b2b2b; font: 400 16px/24px var(--body); white-space: pre-line; }',
      '.lib-libro .lib-post .lib-vacio { color: rgba(0, 0, 0, 0.45); }',
      '.lib-libro .lib-post .lib-code { background: rgba(255, 255, 255, 0.55); color: #2b2b2b; border-left-color: rgba(0, 0, 0, 0.4); }',

      /* Comentarios del profesor: a pluma roja, como una corrección */
      '.lib-libro .lib-ficha .coments { margin-top: 30px; padding-top: 10px; border-top: 4px double var(--p-rojo); }',
      '.lib-libro .lib-ficha .coments h4 { display: block; margin: 0 0 6px; font: 700 28px/1.1 var(--manuscrita); letter-spacing: 0; text-transform: none; color: var(--p-rojo); text-decoration: none; }',
      '.lib-libro .lib-ficha .coment { margin: 0 0 12px; padding: 2px 4px 2px 14px; background: var(--papel); border: none; border-left: 4px solid var(--p-rojo); border-radius: 0; }',
      '.lib-libro .lib-ficha .coments .coment-texto { font: 500 23px/1.18 var(--manuscrita); color: var(--p-rojo); }',
      '.lib-libro .lib-ficha .coment-meta { opacity: 1; color: var(--tinta-suave); }',
      '.lib-libro .lib-ficha .coments textarea { background: var(--papel); color: var(--tinta); border-color: var(--tinta-suave); }',

      /* Formulario sobre la hoja */
      '.lib-libro .lib-form h2 { font: 700 40px/1 var(--manuscrita); text-transform: none; color: var(--p-azul); }',
      '.lib-libro .lib-campo > label, .lib-libro .lib-campo > .lib-etq { font: 700 24px/1.1 var(--manuscrita); letter-spacing: 0; color: var(--p-azul); }',
      '.lib-libro .lib-campo input[type="text"], .lib-libro .lib-campo textarea, .lib-libro .lib-campo select { background: var(--papel); color: var(--tinta); border-color: var(--tinta-suave); }',
      '.lib-libro .lib-sub { font: 700 21px/1.15 var(--manuscrita); letter-spacing: 0; text-transform: none; color: var(--p-naranja); }',
      '.lib-libro .lib-meta { color: var(--tinta-suave); }'
    ].join('\n');
  }

  // ---------- Utilidades ----------
  if (!document.querySelector('link[data-libreta-fuente]')) {
    var fuente = document.createElement('link');
    fuente.rel = 'stylesheet';
    fuente.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap';
    fuente.setAttribute('data-libreta-fuente', '1');
    document.head.appendChild(fuente);
  }

  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  // Cada escuela conocida tiene su propio color fijo (así los separadores nunca se repiten ni cambian).
  // Las escuelas que crees tú reciben un color de la paleta de forma estable.
  var COLORES_ESCUELA = {
    'divide y venceras': '#2b8cf0',
    'programacion dinamica': '#e0951a',
    'voraces': '#3a7d65',
    'backtracking': '#cf4a1f',
    'fuerza bruta': '#a65d1a',
    'ramificacion y poda': '#0097b2',
    'reducir y venceras': '#c96ae8'
  };

  function colorDe(escuela) {
    var t = norm(escuela);
    if (t === norm(SIN_CLASIFICAR)) return '#8a8f98';
    if (COLORES_ESCUELA[t]) return COLORES_ESCUELA[t];
    var n = 0;
    for (var i = 0; i < t.length; i++) n = (n * 31 + t.charCodeAt(i)) % 9973;
    return PALETA[n % PALETA.length];
  }

  function hexRgb(hex) {
    var t = String(hex).replace('#', '');
    return [parseInt(t.slice(0, 2), 16), parseInt(t.slice(2, 4), 16), parseInt(t.slice(4, 6), 16)];
  }
  function rgba(hex, a) { var c = hexRgb(hex); return 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + a + ')'; }
  function aclarar(hex, t) {
    var c = hexRgb(hex).map(function (v) { return Math.round(v + (255 - v) * t); });
    return 'rgb(' + c.join(', ') + ')';
  }
  function oscurecer(hex, t) {
    var c = hexRgb(hex).map(function (v) { return Math.round(v * (1 - t)); });
    return 'rgb(' + c.join(', ') + ')';
  }

  // Solo se muestran como enlace las direcciones http o https (nada de javascript: ni otras).
  function urlSegura(u) {
    try {
      var x = new URL(String(u || '').trim());
      return (x.protocol === 'https:' || x.protocol === 'http:') ? x.href : null;
    } catch (e) { return null; }
  }

  function ligasDe(alg) {
    return Array.isArray(alg.ligas)
      ? alg.ligas.filter(function (l) { return l && typeof l === 'object'; })
      : [];
  }

  function lleno(v) { return v && String(v).trim() !== ''; }

  function limpiar(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function sinFinal(s) { return String(s || '').replace(/\s+$/, ''); }

  function hostDe(href) {
    try { return new URL(href).hostname; } catch (e) { return href; }
  }

  // Lista de escuelas para el formulario: las fijas + las que ya existen en tus fichas.
  function opcionesDeEscuela(algoritmos) {
    var vistos = {}, lista = [];
    function agregar(e) {
      var t = limpiar(e), n = norm(t);
      if (!n || vistos[n] || n === norm(SIN_CLASIFICAR)) return;
      vistos[n] = true; lista.push(t);
    }
    ESCUELAS_BASE.forEach(agregar);
    var extras = [];
    algoritmos.forEach(function (a) { if (a.escuela) extras.push(a.escuela); });
    extras.sort(function (a, b) { return norm(a) < norm(b) ? -1 : (norm(a) > norm(b) ? 1 : 0); });
    extras.forEach(agregar);
    return lista;
  }

  // Si escribes una escuela que ya existe (sin importar acentos o mayúsculas), usa la existente.
  function resolverEscuela(f, opciones) {
    if (f.escuela !== OTRA) return f.escuela;
    var t = limpiar(f.escuelaOtra);
    if (!t) return null;
    var n = norm(t), todas = opciones.concat([SIN_CLASIFICAR]);
    for (var i = 0; i < todas.length; i++) if (norm(todas[i]) === n) return todas[i];
    return t;
  }

  function armarLigas(ligas) {
    var out = [];
    for (var i = 0; i < ligas.length; i++) {
      var t = limpiar(ligas[i].titulo), u = String(ligas[i].url || '').trim();
      if (!t && !u) continue;
      if (!u) return { error: 'La liga ' + (i + 1) + ' no tiene dirección.' };
      var seg = urlSegura(u);
      if (!seg) return { error: 'La liga ' + (i + 1) + ' no es una dirección válida: debe empezar con http:// o https://.' };
      out.push({ titulo: t || hostDe(seg), url: seg });
    }
    return { ligas: out };
  }

  // ----- Formulario: valores iniciales y borrador -----
  function formDeFicha(a) {
    var ligas = a && Array.isArray(a.ligas)
      ? a.ligas.filter(function (l) { return l && typeof l === 'object'; }).map(function (l) { return { titulo: String(l.titulo || ''), url: String(l.url || '') }; })
      : [];
    return {
      nombre: a ? String(a.nombre || '') : '',
      creador: a ? String(a.creador || '') : '',
      utilidad: a ? String(a.utilidad || '') : '',
      restricciones: a ? String(a.restricciones || '') : '',
      escuela: a ? String(a.escuela || SIN_CLASIFICAR) : SIN_CLASIFICAR,
      escuelaOtra: '',
      complejidad_temporal: a ? String(a.complejidad_temporal || '') : '',
      complejidad_espacial: a ? String(a.complejidad_espacial || '') : '',
      pseudocodigo: a ? String(a.pseudocodigo || '') : '',
      ligas: ligas,
      paradigma: a ? String(a.paradigma || '') : '',
      reflexion_comprension: a ? String(a.reflexion_comprension || '') : '',
      reflexion_uso: a ? String(a.reflexion_uso || '') : '',
      reflexion_reto: a ? String(a.reflexion_reto || '') : '',
      codigo: a ? String(a.codigo || '') : '',
      reflexion_implementacion: a ? String(a.reflexion_implementacion || '') : ''
    };
  }

  function leerBorrador(clave) {
    try {
      var raw = window.localStorage.getItem(clave);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || typeof o !== 'object') return null;
      var base = formDeFicha(null);
      Object.keys(base).forEach(function (k) {
        if (k === 'ligas') { base.ligas = Array.isArray(o.ligas) ? o.ligas.map(function (l) { return { titulo: String((l && l.titulo) || ''), url: String((l && l.url) || '') }; }) : []; }
        else if (typeof o[k] === 'string') base[k] = o[k];
      });
      return base;
    } catch (e) { return null; }
  }

  function escribirBorrador(clave, f) {
    try { window.localStorage.setItem(clave, JSON.stringify(f)); } catch (e) { /* si no se puede, seguimos sin borrador */ }
  }

  function borrarBorrador(clave) {
    try { window.localStorage.removeItem(clave); } catch (e) { /* nada */ }
  }

  function vacio() { return h('span', { className: 'lib-vacio' }, 'Sin completar'); }

  function parrafo(v) {
    return lleno(v) ? h('p', null, v) : h('p', { className: 'lib-vacio' }, 'Sin completar');
  }

  function seccion(num, titulo, hijos) {
    return h('div', { className: 'lib-sec', 'data-s': String(num) },
      h('h4', null, h('span', { className: 'lib-num' }, num + '.'), ' ' + titulo),
      hijos);
  }

  // Nota adhesiva para las reflexiones.
  function postit(color, pregunta, contenido) {
    return h('div', { className: 'lib-post ' + color },
      h('p', { className: 'lib-q' }, pregunta),
      contenido);
  }

  function marca(valor, clase) {
    return lleno(valor) ? h('mark', { className: 'lib-mk ' + clase }, valor) : vacio();
  }

  function mensajeDeCarga(e) {
    var txt = e && (e.message || '');
    if (e && (e.code === 'PGRST205' || e.code === '42P01' || /schema cache|does not exist/i.test(txt))) {
      return 'Falta crear las tablas de la libreta en Supabase. Ejecuta el archivo libreta.sql en el SQL Editor y vuelve a intentar.';
    }
    return 'No se pudo cargar la libreta. Revisa tu internet e inténtalo de nuevo.';
  }

  // ---------- Acciones de la ficha (solo Camila): editar y borrar ----------
  function Acciones(props) {
    var s1 = useState(false); var confirmar = s1[0], setConfirmar = s1[1];
    var s2 = useState(false); var ocupado = s2[0], setOcupado = s2[1];
    var s3 = useState(''); var error = s3[0], setError = s3[1];

    function borrar() {
      setOcupado(true); setError('');
      props.onBorrar().then(function (r) {
        if (!r.ok) { setOcupado(false); if (r.mensaje) setError(r.mensaje); }
      });
    }

    return h('div', null,
      h('div', { className: 'lib-acciones' },
        confirmar
          ? [
              h('span', { key: 'q' }, 'Se borrará la ficha y sus comentarios. ¿Seguro?'),
              h('button', { key: 'si', className: 'lib-btn lib-primario', disabled: ocupado, onClick: borrar }, ocupado ? 'Borrando...' : 'Sí, borrar'),
              h('button', { key: 'no', className: 'lib-btn', disabled: ocupado, onClick: function () { setConfirmar(false); setError(''); } }, 'Cancelar')
            ]
          : [
              h('button', { key: 'ed', className: 'lib-btn', disabled: props.deshabilitado, onClick: props.onEditar }, 'Editar ficha'),
              h('button', { key: 'del', className: 'lib-btn', onClick: function () { setConfirmar(true); } }, 'Borrar ficha')
            ]),
      error ? h('p', { className: 'lib-error', role: 'alert' }, error) : null
    );
  }

  // ---------- Formulario para crear o editar una ficha ----------
  function FichaForm(props) {
    var inicial = props.inicial;
    var clave = 'bitacora-borrador-ficha-' + (inicial ? inicial.id : 'nueva');

    var sb = useState(function () { return formDeFicha(inicial); }); var base = sb[0];
    var sf = useState(function () { return leerBorrador(clave) || formDeFicha(inicial); }); var f = sf[0], setF = sf[1];
    var sr = useState(function () { return !!leerBorrador(clave); }); var restaurado = sr[0], setRestaurado = sr[1];
    var so = useState(false); var ocupado = so[0], setOcupado = so[1];
    var se = useState(''); var error = se[0], setError = se[1];
    var sc = useState(false); var confirmando = sc[0], setConfirmando = sc[1];

    var serial = JSON.stringify(f);
    var sucio = serial !== JSON.stringify(base);

    // Borrador automático: si se cierra la página o se vence la sesión, no se pierde lo escrito.
    useEffect(function () {
      if (sucio) escribirBorrador(clave, f); else borrarBorrador(clave);
    }, [serial]);

    useEffect(function () {
      if (!sucio) return undefined;
      function aviso(e) { e.preventDefault(); e.returnValue = ''; }
      window.addEventListener('beforeunload', aviso);
      return function () { window.removeEventListener('beforeunload', aviso); };
    }, [sucio]);

    function poner(k) {
      return function (e) {
        var v = e.target.value;
        setF(function (p) { var n = Object.assign({}, p); n[k] = v; return n; });
      };
    }
    function cambiarLiga(i, k, v) {
      setF(function (p) {
        var n = Object.assign({}, p);
        n.ligas = p.ligas.map(function (l, j) { if (j !== i) return l; var c = Object.assign({}, l); c[k] = v; return c; });
        return n;
      });
    }
    function quitarLiga(i) {
      setF(function (p) { return Object.assign({}, p, { ligas: p.ligas.filter(function (l, j) { return j !== i; }) }); });
    }
    function agregarLiga() {
      setF(function (p) { return Object.assign({}, p, { ligas: p.ligas.concat([{ titulo: '', url: '' }]) }); });
    }

    function guardar() {
      if (ocupado) return;
      var nombre = limpiar(f.nombre);
      if (!nombre) { setError('El nombre del algoritmo es obligatorio.'); return; }
      var escuela = resolverEscuela(f, props.opciones);
      if (!escuela) { setError('Escribe el nombre de la escuela de pensamiento.'); return; }
      var l = armarLigas(f.ligas);
      if (l.error) { setError(l.error); return; }
      var datos = {
        nombre: nombre,
        creador: f.creador.trim(),
        utilidad: f.utilidad.trim(),
        restricciones: f.restricciones.trim(),
        escuela: escuela,
        complejidad_temporal: f.complejidad_temporal.trim(),
        complejidad_espacial: f.complejidad_espacial.trim(),
        pseudocodigo: sinFinal(f.pseudocodigo),
        ligas: l.ligas,
        paradigma: f.paradigma.trim(),
        reflexion_comprension: f.reflexion_comprension.trim(),
        reflexion_uso: f.reflexion_uso.trim(),
        reflexion_reto: f.reflexion_reto.trim(),
        codigo: sinFinal(f.codigo),
        reflexion_implementacion: f.reflexion_implementacion.trim()
      };
      setOcupado(true); setError('');
      props.onGuardar(datos).then(function (r) {
        if (r.ok) { borrarBorrador(clave); return; }
        setOcupado(false);
        if (r.mensaje) setError(r.mensaje);
      });
    }

    function cancelar() {
      if (sucio && !confirmando) { setConfirmando(true); return; }
      borrarBorrador(clave);
      props.onCancelar();
    }

    function campo(id, etiqueta, ayuda, control) {
      return h('div', { className: 'lib-campo' },
        h('label', { htmlFor: id }, etiqueta),
        ayuda ? h('p', { className: 'lib-ayuda' }, ayuda) : null,
        control);
    }
    function texto(id, k, extra) {
      return h('input', Object.assign({ id: id, type: 'text', value: f[k], onChange: poner(k) }, extra || {}));
    }
    function area(id, k, mono) {
      return h('textarea', { id: id, className: mono ? 'lib-mono' : '', value: f[k], onChange: poner(k), spellCheck: !mono });
    }

    var opcs = props.opciones.slice();
    if (f.escuela !== OTRA && f.escuela !== SIN_CLASIFICAR && opcs.indexOf(f.escuela) < 0) opcs.push(f.escuela);

    return h('div', { className: 'lib-form' },
      h('button', { className: 'lib-btn lib-volver', onClick: cancelar }, '\u2190 Volver'),
      h('h2', null, inicial ? 'Editar ficha' : 'Nueva ficha'),
      h('p', { className: 'lib-meta' }, 'Los puntos siguen la guía de tu reporte. Lo que escribas se guarda como borrador mientras trabajas.'),

      (restaurado && sucio)
        ? h('div', { className: 'lib-borrador', role: 'status' },
            h('span', null, 'Recuperé un borrador que no habías guardado.'),
            h('button', { className: 'lib-btn', onClick: function () { setF(base); setRestaurado(false); } }, 'Descartar borrador'))
        : null,

      campo('f-nombre', '1. Nombre del algoritmo', null, texto('f-nombre', 'nombre', { maxLength: 120, placeholder: 'Ej. Merge sort' })),
      campo('f-creador', '2. Creador y fecha de creación', null, texto('f-creador', 'creador', { maxLength: 200, placeholder: 'Ej. John von Neumann, 1945' })),
      campo('f-utilidad', '3. Utilidad principal o aplicaciones en donde se puede encontrar', null, area('f-utilidad', 'utilidad')),
      campo('f-restricciones', '4. Restricciones o limitaciones del algoritmo', null, area('f-restricciones', 'restricciones')),

      h('div', { className: 'lib-campo' },
        h('label', { htmlFor: 'f-escuela' }, '5. Escuela de pensamiento a la que pertenece su estrategia de solución'),
        h('select', { id: 'f-escuela', value: f.escuela, onChange: poner('escuela') },
          opcs.map(function (o) { return h('option', { key: o, value: o }, o); }),
          h('option', { key: 'sin', value: SIN_CLASIFICAR }, SIN_CLASIFICAR),
          h('option', { key: 'otra', value: OTRA }, 'Otra...')),
        f.escuela === OTRA
          ? h('div', { style: { marginTop: '8px' } },
              h('input', { id: 'f-escuela-otra', type: 'text', value: f.escuelaOtra, maxLength: 80, 'aria-label': 'Nombre de la nueva escuela', placeholder: 'Nombre de la escuela', onChange: poner('escuelaOtra') }))
          : null),

      h('div', { className: 'lib-campo' },
        h('span', { className: 'lib-etq' }, '6. Orden de complejidad'),
        h('div', { className: 'lib-dos' },
          h('div', null, h('label', { htmlFor: 'f-temporal' }, 'Temporal'), texto('f-temporal', 'complejidad_temporal', { maxLength: 80, placeholder: 'Ej. O(n log n)' })),
          h('div', null, h('label', { htmlFor: 'f-espacial' }, 'Espacial'), texto('f-espacial', 'complejidad_espacial', { maxLength: 80, placeholder: 'Ej. O(n)' })))),

      campo('f-pseudo', '7. Descripción general del algoritmo (en pseudocódigo preferentemente)', 'Se conserva la sangría tal como la escribas o la pegues.', area('f-pseudo', 'pseudocodigo', true)),

      h('div', { className: 'lib-campo' },
        h('span', { className: 'lib-etq' }, '8. Ligas a explicaciones o tutoriales valiosos'),
        f.ligas.length === 0 ? h('p', { className: 'lib-ayuda' }, 'Todavía no hay ligas.') : null,
        f.ligas.map(function (l, i) {
          return h('div', { key: i, className: 'lib-liga' },
            h('input', { type: 'text', value: l.titulo, 'aria-label': 'Título de la liga ' + (i + 1), placeholder: 'Título (opcional)', onChange: function (e) { cambiarLiga(i, 'titulo', e.target.value); } }),
            h('input', { type: 'text', value: l.url, 'aria-label': 'Dirección de la liga ' + (i + 1), placeholder: 'https://...', onChange: function (e) { cambiarLiga(i, 'url', e.target.value); } }),
            h('button', { className: 'lib-btn', 'aria-label': 'Quitar la liga ' + (i + 1), onClick: function () { quitarLiga(i); } }, 'Quitar'));
        }),
        h('button', { className: 'lib-btn', onClick: agregarLiga }, '+ Agregar liga')),

      campo('f-paradigma', '9. Paradigma de programación conveniente para implementarlo', null, texto('f-paradigma', 'paradigma', { maxLength: 200, placeholder: 'Ej. Recursivo, orientado a objetos...' })),

      h('div', { className: 'lib-campo' },
        h('span', { className: 'lib-etq' }, '10. Reflexiones personales'),
        h('p', { className: 'lib-sub' }, PREGUNTAS.comprension), area('f-comprension', 'reflexion_comprension'),
        h('p', { className: 'lib-sub' }, PREGUNTAS.uso), area('f-uso', 'reflexion_uso'),
        h('p', { className: 'lib-sub' }, PREGUNTAS.reto), area('f-reto', 'reflexion_reto'),
        h('p', { className: 'lib-sub' }, PREGUNTAS.implementacion),
        h('label', { htmlFor: 'f-codigo', className: 'lib-ayuda', style: { display: 'block' } }, 'Tu código (si lo implementaste)'),
        area('f-codigo', 'codigo', true),
        h('label', { htmlFor: 'f-implementacion', className: 'lib-ayuda', style: { display: 'block', marginTop: '8px' } }, 'Retos de implementación y cómo te apoyó la IA (si la usaste)'),
        area('f-implementacion', 'reflexion_implementacion')),

      confirmando
        ? h('div', { className: 'lib-barra', role: 'alert' },
            h('span', null, 'Tienes cambios sin guardar. ¿Descartarlos?'),
            h('button', { className: 'lib-btn lib-primario', onClick: cancelar }, 'Sí, descartar'),
            h('button', { className: 'lib-btn', onClick: function () { setConfirmando(false); } }, 'Seguir editando'))
        : h('div', { className: 'lib-barra' },
            h('button', { className: 'lib-btn lib-primario', disabled: ocupado, onClick: guardar }, ocupado ? 'Guardando...' : 'Guardar ficha'),
            h('button', { className: 'lib-btn', disabled: ocupado, onClick: cancelar }, 'Cancelar')),
      error ? h('p', { className: 'lib-error', role: 'alert' }, error) : null
    );
  }

  // ---------- Componente principal ----------
  function Libreta(props) {
    var client = props.client;
    var rol = props.rol;
    var Comentarios = props.Comentarios;
    var formatoFecha = props.formatoFecha;

    var s1 = useState('cargando'); var estado = s1[0], setEstado = s1[1];
    var s2 = useState([]); var algoritmos = s2[0], setAlgoritmos = s2[1];
    var s3 = useState([]); var comentarios = s3[0], setComentarios = s3[1];
    var s4 = useState(null); var sel = s4[0], setSel = s4[1];
    var s5 = useState(''); var busqueda = s5[0], setBusqueda = s5[1];
    var s6 = useState(''); var aviso = s6[0], setAviso = s6[1];
    var s7 = useState(false); var refrescando = s7[0], setRefrescando = s7[1];
    var s8 = useState(null); var modo = s8[0], setModo = s8[1];          // null | { id: null } (nueva) | { id } (editar)
    var s9 = useState(false); var faltaAjuste = s9[0], setFaltaAjuste = s9[1];
    var s10 = useState(null); var escuelaSel = s10[0], setEscuelaSel = s10[1];   // separador elegido (null = todas)

    function traer() {
      return Promise.all([
        Promise.resolve(client.from('algoritmos').select('*').order('nombre', { ascending: true })),
        Promise.resolve(client.from('comentarios_algoritmos').select('*').order('creado_en', { ascending: true }))
      ]).then(function (rs) {
        if (rs[0].error) throw rs[0].error;
        if (rs[1].error) throw rs[1].error;
        return { algoritmos: rs[0].data || [], comentarios: rs[1].data || [] };
      });
    }

    function aplicar(datos) {
      setAlgoritmos(datos.algoritmos);
      setComentarios(datos.comentarios);
      setSel(function (actual) {
        return datos.algoritmos.some(function (a) { return a.id === actual; }) ? actual : null;
      });
      setAviso('');
      setEstado('listo');
    }

    function fallo(e) {
      if (props.sesionVencida && props.sesionVencida(e)) { props.onSesionVencida(); return; }
      setAviso(mensajeDeCarga(e));
      setEstado('error');
    }

    useEffect(function () {
      var vivo = true;
      traer().then(function (d) { if (vivo) aplicar(d); }).catch(function (e) { if (vivo) fallo(e); });
      return function () { vivo = false; };
    }, []);

    // ¿Ya existen las columnas de la cuarta reflexión? Si no, hay que ejecutar libreta-ajuste.sql.
    useEffect(function () {
      if (rol !== 'camila') return undefined;
      var vivo = true;
      try {
        Promise.resolve(client.from('algoritmos').select('codigo, reflexion_implementacion').limit(0)).then(function (r) {
          if (vivo && r && r.error && /codigo|reflexion_implementacion|column/i.test((r.error.message || '') + ' ' + (r.error.code || ''))) setFaltaAjuste(true);
        }).catch(function () {});
      } catch (e) { /* esta comprobación es opcional: si falla, la libreta sigue normal */ }
      return function () { vivo = false; };
    }, []);

    function reintentar() {
      setEstado('cargando');
      traer().then(aplicar).catch(fallo);
    }

    function actualizar() {
      setRefrescando(true); setAviso('');
      traer().then(function (d) { aplicar(d); setRefrescando(false); }).catch(function (e) {
        setRefrescando(false);
        if (props.sesionVencida && props.sesionVencida(e)) { props.onSesionVencida(); return; }
        setAviso('No se pudo actualizar.');
      });
    }

    // ----- Comentarios del profesor (solo él puede escribirlos; lo verifica Supabase) -----
    function crearComentario(algId, texto) {
      return props.ejecutar(client.from('comentarios_algoritmos').insert({ algoritmo_id: algId, texto: texto }).select(), 'No se pudo guardar el comentario.').then(function (r) {
        if (r.ok) setComentarios(function (prev) { return prev.concat([r.data[0]]); });
        return r;
      });
    }

    function actualizarComentario(id, texto) {
      return props.ejecutar(client.from('comentarios_algoritmos').update({ texto: texto }).eq('id', id).select(), 'No se pudo guardar el cambio.').then(function (r) {
        if (r.ok) setComentarios(function (prev) { return prev.map(function (c) { return c.id === id ? r.data[0] : c; }); });
        return r;
      });
    }

    function borrarComentario(id) {
      return props.ejecutar(client.from('comentarios_algoritmos').delete().eq('id', id).select(), 'No se pudo borrar el comentario.').then(function (r) {
        if (r.ok) setComentarios(function (prev) { return prev.filter(function (c) { return c.id !== id; }); });
        return r;
      });
    }

    // ----- Fichas: crear, editar y borrar (solo Camila; lo verifica Supabase) -----
    function guardarFicha(id, datos) {
      var consulta = id
        ? client.from('algoritmos').update(datos).eq('id', id).select()
        : client.from('algoritmos').insert(datos).select();
      return props.ejecutar(consulta, 'No se pudo guardar la ficha.').then(function (r) {
        if (r.ok) {
          var fila = r.data[0];
          setAlgoritmos(function (prev) {
            return id ? prev.map(function (a) { return a.id === id ? fila : a; }) : prev.concat([fila]);
          });
          setSel(fila.id);
          setModo(null);
        }
        return r;
      });
    }

    function borrarFicha(id) {
      return props.ejecutar(client.from('algoritmos').delete().eq('id', id).select(), 'No se pudo borrar la ficha.').then(function (r) {
        if (r.ok) {
          setAlgoritmos(function (prev) { return prev.filter(function (a) { return a.id !== id; }); });
          setComentarios(function (prev) { return prev.filter(function (c) { return c.algoritmo_id !== id; }); });
          setSel(null);
        }
        return r;
      });
    }

    function elegir(id) {
      setModo(null);
      setSel(id);
      setTimeout(function () {
        if (window.innerWidth < 920) {
          var el = document.querySelector('.lib-ficha');
          if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }

    // ----- Pantallas de carga y error -----
    if (estado === 'cargando') {
      return h('p', { className: 'state-msg', role: 'status' }, 'Cargando la libreta...');
    }
    if (estado === 'error') {
      return h('div', { className: 'state-msg' },
        h('p', null, aviso),
        h('button', { className: 'btn', onClick: reintentar }, 'Reintentar')
      );
    }

    // ----- Índice agrupado por escuela de pensamiento -----
    function porNombre(a, b) { return norm(a.nombre) < norm(b.nombre) ? -1 : (norm(a.nombre) > norm(b.nombre) ? 1 : 0); }
    function porEscuela(a, b) {
      if (a === SIN_CLASIFICAR) return 1;
      if (b === SIN_CLASIFICAR) return -1;
      return norm(a) < norm(b) ? -1 : (norm(a) > norm(b) ? 1 : 0);
    }
    var todos = {};
    algoritmos.forEach(function (a) {
      var e = a.escuela || SIN_CLASIFICAR;
      if (!todos[e]) todos[e] = [];
      todos[e].push(a);
    });
    var escuelasTodas = Object.keys(todos).sort(porEscuela);
    var pagina = {}, nPag = 0;
    escuelasTodas.forEach(function (e) {
      todos[e].sort(porNombre);
      todos[e].forEach(function (a) { pagina[a.id] = ++nPag; });   // número de página, como en una libreta
    });
    var escuelaAct = (escuelaSel && todos[escuelaSel]) ? escuelaSel : null;

    var q = norm(busqueda.trim());
    var visibles = algoritmos.filter(function (a) {
      var e = a.escuela || SIN_CLASIFICAR;
      if (escuelaAct && e !== escuelaAct) return false;
      return !q || norm(a.nombre).indexOf(q) >= 0 || norm(e).indexOf(q) >= 0;
    });
    var grupos = {};
    visibles.forEach(function (a) {
      var e = a.escuela || SIN_CLASIFICAR;
      if (!grupos[e]) grupos[e] = [];
      grupos[e].push(a);
    });
    var escuelas = Object.keys(grupos).sort(porEscuela);
    escuelas.forEach(function (e) { grupos[e].sort(porNombre); });

    var indice = h('nav', { className: 'lib-indice', 'aria-label': 'Índice de algoritmos' },
      h('h2', { className: 'lib-ind-titulo' }, 'Índice'),
      (rol === 'camila' && faltaAjuste)
        ? h('p', { className: 'lib-aviso', role: 'alert' }, 'Falta un paso en Supabase: ejecuta libreta-ajuste.sql en el SQL Editor. Hasta entonces no se pueden guardar fichas.')
        : null,
      rol === 'camila'
        ? h('button', {
            className: 'lib-btn lib-primario lib-nueva', disabled: faltaAjuste,
            onClick: function () { setModo({ id: null }); }
          }, '+ Nueva ficha')
        : null,
      h('input', {
        className: 'lib-buscar', type: 'search', placeholder: 'Buscar algoritmo...', 'aria-label': 'Buscar algoritmo',
        value: busqueda, onChange: function (e) { setBusqueda(e.target.value); }
      }),
      algoritmos.length === 0
        ? h('p', { className: 'lib-vacio' }, rol === 'camila'
            ? 'Todavía no hay fichas. Pulsa "+ Nueva ficha" para crear la primera.'
            : 'Todavía no hay fichas.')
        : (visibles.length === 0
            ? h('p', { className: 'lib-vacio' }, 'No hay resultados para "' + busqueda.trim() + '".')
            : escuelas.map(function (esc) {
                return h('div', { key: esc, className: 'lib-grupo', style: { '--esc': colorDe(esc), '--esc-t1': oscurecer(colorDe(esc), 0.35), '--esc-t2': aclarar(colorDe(esc), 0.45) } },
                  h('h3', null,
                    esc,
                    h('span', { className: 'lib-cuenta' }, ' (' + grupos[esc].length + ')')),
                  grupos[esc].map(function (a) {
                    return h('button', {
                      key: a.id, className: 'lib-item',
                      'aria-current': sel === a.id ? 'true' : 'false',
                      onClick: function () { elegir(a.id); }
                    },
                      h('span', { className: 'lib-item-nombre' }, a.nombre),
                      h('span', { className: 'lib-puntos', 'aria-hidden': 'true' }),
                      h('span', { className: 'lib-pagn' }, String(pagina[a.id])));
                  })
                );
              }))
    );

    // ----- Ficha técnica -----
    var alg = null;
    algoritmos.forEach(function (a) { if (a.id === sel) alg = a; });

    var ficha;
    if (!alg) {
      ficha = h('section', { className: 'lib-ficha', 'aria-label': 'Ficha técnica' },
        h('p', { className: 'lib-vacio' }, 'Elige un algoritmo del índice para ver su ficha.'));
    } else {
      var ligas = ligasDe(alg);
      var lista = comentarios.filter(function (c) { return c.algoritmo_id === alg.id; });
      var meta = 'Creada: ' + formatoFecha(alg.creada_en);
      if (alg.actualizada_en && alg.creada_en && (new Date(alg.actualizada_en) - new Date(alg.creada_en)) > 1000) {
        meta += ' \u00B7 Editada: ' + formatoFecha(alg.actualizada_en);
      }

      var colorEsc = colorDe(alg.escuela);
      ficha = h('section', {
        className: 'lib-ficha', key: alg.id, 'aria-label': 'Ficha técnica de ' + alg.nombre,
        style: { '--acento': colorEsc, '--acento-suave': rgba(colorEsc, 0.42), '--acento-t1': oscurecer(colorEsc, 0.38), '--acento-t2': aclarar(colorEsc, 0.45) }
      },
        h('span', { className: 'lib-cinta', 'aria-hidden': 'true' }),
        h('button', { className: 'lib-btn lib-volver', onClick: function () { setSel(null); } }, '\u2190 Índice'),
        rol === 'camila'
          ? h(Acciones, {
              key: 'ac-' + alg.id, deshabilitado: faltaAjuste,
              onEditar: function () { setModo({ id: alg.id }); },
              onBorrar: function () { return borrarFicha(alg.id); }
            })
          : null,
        h('div', { className: 'lib-encabezado' },
          h('h2', null, h('span', { className: 'lib-nombre' }, alg.nombre)),
          h('span', { className: 'lib-pag' }, 'pág. ' + pagina[alg.id])),
        h('p', { className: 'lib-escuela' }, alg.escuela),
        h('p', { className: 'lib-meta' }, meta),

        seccion(2, 'Creador y fecha de creación', parrafo(alg.creador)),
        seccion(3, 'Utilidad principal o aplicaciones', parrafo(alg.utilidad)),
        seccion(4, 'Restricciones o limitaciones', parrafo(alg.restricciones)),
        seccion(5, 'Escuela de pensamiento', h('p', null, h('mark', { className: 'lib-mk acento' }, alg.escuela))),
        seccion(6, 'Orden de complejidad',
          h('ul', null,
            h('li', null, h('strong', null, 'Temporal: '), marca(alg.complejidad_temporal, 'amarillo')),
            h('li', null, h('strong', null, 'Espacial: '), marca(alg.complejidad_espacial, 'rosa')))),
        seccion(7, 'Descripción general (pseudocódigo)',
          lleno(alg.pseudocodigo)
            ? h('pre', { className: 'lib-code' }, alg.pseudocodigo)
            : h('p', { className: 'lib-vacio' }, 'Sin completar')),
        seccion(8, 'Ligas a explicaciones o tutoriales',
          ligas.length === 0
            ? h('p', { className: 'lib-vacio' }, 'Sin completar')
            : h('ul', null, ligas.map(function (l, i) {
                var href = urlSegura(l.url);
                var texto = lleno(l.titulo) ? l.titulo : (l.url || 'Liga');
                return h('li', { key: i },
                  href
                    ? h('a', { href: href, target: '_blank', rel: 'noopener noreferrer' }, texto)
                    : h('span', null, texto + ' (liga no válida)'));
              }))),
        seccion(9, 'Paradigma de programación conveniente', lleno(alg.paradigma) ? h('p', null, h('mark', { className: 'lib-mk verde' }, alg.paradigma)) : parrafo(alg.paradigma)),
        seccion(10, 'Reflexiones personales',
          h('div', { className: 'lib-posts' },
            postit('amarillo', PREGUNTAS.comprension, parrafo(alg.reflexion_comprension)),
            postit('rosa', PREGUNTAS.uso, parrafo(alg.reflexion_uso)),
            postit('azul', PREGUNTAS.reto, parrafo(alg.reflexion_reto)),
            postit('verde', PREGUNTAS.implementacion,
              (lleno(alg.codigo) || lleno(alg.reflexion_implementacion))
                ? h('div', null,
                    lleno(alg.codigo) ? h('pre', { className: 'lib-code' }, alg.codigo) : null,
                    lleno(alg.reflexion_implementacion) ? h('p', null, alg.reflexion_implementacion) : null)
                : h('p', { className: 'lib-vacio' }, 'Sin completar')))),

        h(Comentarios, {
          lista: lista,
          esProfesor: rol === 'profesor',
          onCrear: function (texto) { return crearComentario(alg.id, texto); },
          onActualizar: actualizarComentario,
          onBorrar: borrarComentario
        })
      );
    }

    // Si hay un formulario abierto, reemplaza a la ficha en el panel derecho.
    var inicialModo = null;
    if (modo && modo.id) algoritmos.forEach(function (a) { if (a.id === modo.id) inicialModo = a; });
    var enEdicion = !!modo && (modo.id === null || !!inicialModo);
    if (enEdicion) {
      ficha = h('section', { className: 'lib-ficha', 'aria-label': modo.id === null ? 'Nueva ficha' : 'Editar ficha' },
        h(FichaForm, {
          key: modo.id === null ? 'nueva' : modo.id,
          inicial: inicialModo,
          opciones: opcionesDeEscuela(algoritmos),
          onGuardar: function (datos) { return guardarFicha(modo.id, datos); },
          onCancelar: function () { setModo(null); }
        }));
    }

    // Separadores laterales (uno por escuela) y color de la tapa según la ficha abierta.
    var pestanas = h('nav', { className: 'lib-pestanas', 'aria-label': 'Separadores por escuela' },
      h('button', {
        className: 'lib-tab', 'aria-pressed': escuelaAct ? 'false' : 'true',
        style: { '--tab': aclarar('#8a8f98', 0.6), '--tab-sel': aclarar('#8a8f98', 0.35) },
        onClick: function () { setEscuelaSel(null); }
      }, h('span', null, 'Todas'), h('span', { className: 'lib-tab-n' }, String(algoritmos.length))),
      escuelasTodas.map(function (esc) {
        return h('button', {
          key: esc, className: 'lib-tab', 'aria-pressed': escuelaAct === esc ? 'true' : 'false',
          style: { '--tab': aclarar(colorDe(esc), 0.6), '--tab-sel': aclarar(colorDe(esc), 0.32) },
          onClick: function () { setEscuelaSel(esc); }
        }, h('span', null, esc), h('span', { className: 'lib-tab-n' }, String(todos[esc].length)));
      })
    );
    var escTapa = alg ? alg.escuela : (inicialModo ? inicialModo.escuela : escuelaAct);
    var tapa = escTapa ? oscurecer(colorDe(escTapa), 0.42) : '#46557f';

    return h('div', { className: 'lib-libro' },
      h('div', { className: 'lib-head' },
        h('div', null,
          h('h1', { className: 'lib-title' }, 'Libreta'),
          h('p', { className: 'lib-count' }, algoritmos.length === 1 ? '1 ficha' : algoritmos.length + ' fichas')),
        h('div', null,
          aviso ? h('span', { className: 'warn', role: 'status' }, aviso + ' ') : null,
          h('button', { className: 'lib-btn', disabled: refrescando, onClick: actualizar }, refrescando ? 'Actualizando...' : 'Actualizar'))
      ),
      h('div', { className: 'lib', 'data-ficha': (alg || enEdicion) ? '1' : '0', style: { '--tapa': tapa } },
        indice,
        h('div', { className: 'lib-anillos', 'aria-hidden': 'true' }),
        ficha,
        pestanas)
    );
  }

  window.Libreta = Libreta;
})();