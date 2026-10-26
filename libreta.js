// Libreta de algoritmos: índice y fichas técnicas.
// index.html la carga como script externo y le pasa lo que necesita.
(function () {
  'use strict';

  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;

  var PALETA = ['#e0951a', '#cf4a1f', '#3a7d65', '#a65d1a', '#0097b2', '#2b8cf0', '#c96ae8'];

  var PREGUNTAS = {
    comprension: '¿Qué tan fácil o difícil fue entender este algoritmo? ¿Se ha comprendido ya por completo?',
    uso: '¿Tienes claridad de cuándo sería conveniente utilizar este algoritmo en la construcción de alguna aplicación de software?',
    reto: '¿Qué es lo más retador para implementar este algoritmo con tus habilidades de programación?'
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
    '.lib-ficha .coments { border-top-color: var(--line); }',
    '.lib-ficha .coment { background: var(--bg); border: 1.5px solid var(--line); }',
    '.lib-ficha .coments textarea { border-color: var(--line); }',
    '.lib-ficha .btn { color: var(--ink); border-color: var(--line); }',
    '.lib-ficha .btn:hover { background: var(--pick); }',
    '.lib-ficha .btn.solid { background: var(--ink); color: var(--bg); }',
    '.lib-ficha .panel-error { background: transparent; border: 1.5px solid var(--today); color: var(--today); }'
  ].join('\n');

  if (!document.querySelector('style[data-libreta]')) {
    var estilo = document.createElement('style');
    estilo.setAttribute('data-libreta', '1');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);
  }

  // ---------- Utilidades ----------
  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function colorDe(escuela) {
    var n = 0, t = norm(escuela);
    for (var i = 0; i < t.length; i++) n = (n * 31 + t.charCodeAt(i)) % 9973;
    return PALETA[n % PALETA.length];
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

  function vacio() { return h('span', { className: 'lib-vacio' }, 'Sin completar'); }

  function parrafo(v) {
    return lleno(v) ? h('p', null, v) : h('p', { className: 'lib-vacio' }, 'Sin completar');
  }

  function seccion(num, titulo, hijos) {
    return h('div', { className: 'lib-sec' }, h('h4', null, num + '. ' + titulo), hijos);
  }

  function mensajeDeCarga(e) {
    var txt = e && (e.message || '');
    if (e && (e.code === 'PGRST205' || e.code === '42P01' || /schema cache|does not exist/i.test(txt))) {
      return 'Falta crear las tablas de la libreta en Supabase. Ejecuta el archivo libreta.sql en el SQL Editor y vuelve a intentar.';
    }
    return 'No se pudo cargar la libreta. Revisa tu internet e inténtalo de nuevo.';
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

    function elegir(id) {
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
    var q = norm(busqueda.trim());
    var visibles = algoritmos.filter(function (a) {
      return !q || norm(a.nombre).indexOf(q) >= 0 || norm(a.escuela).indexOf(q) >= 0;
    });
    var grupos = {};
    visibles.forEach(function (a) {
      var e = a.escuela || 'Sin clasificar';
      if (!grupos[e]) grupos[e] = [];
      grupos[e].push(a);
    });
    var escuelas = Object.keys(grupos).sort(function (a, b) {
      if (a === 'Sin clasificar') return 1;
      if (b === 'Sin clasificar') return -1;
      return norm(a) < norm(b) ? -1 : (norm(a) > norm(b) ? 1 : 0);
    });
    escuelas.forEach(function (e) {
      grupos[e].sort(function (a, b) { return norm(a.nombre) < norm(b.nombre) ? -1 : (norm(a.nombre) > norm(b.nombre) ? 1 : 0); });
    });

    var indice = h('nav', { className: 'lib-indice', 'aria-label': 'Índice de algoritmos' },
      h('h2', { className: 'lib-ind-titulo' }, 'Índice'),
      h('input', {
        className: 'lib-buscar', type: 'search', placeholder: 'Buscar algoritmo...', 'aria-label': 'Buscar algoritmo',
        value: busqueda, onChange: function (e) { setBusqueda(e.target.value); }
      }),
      algoritmos.length === 0
        ? h('p', { className: 'lib-vacio' }, rol === 'camila'
            ? 'Todavía no hay fichas. En la siguiente etapa podrás crearlas desde aquí.'
            : 'Todavía no hay fichas.')
        : (visibles.length === 0
            ? h('p', { className: 'lib-vacio' }, 'No hay resultados para "' + busqueda.trim() + '".')
            : escuelas.map(function (esc) {
                return h('div', { key: esc, className: 'lib-grupo' },
                  h('h3', null,
                    h('span', { className: 'lib-punto', style: { background: colorDe(esc) } }),
                    esc,
                    h('span', { className: 'lib-cuenta' }, ' (' + grupos[esc].length + ')')),
                  grupos[esc].map(function (a) {
                    return h('button', {
                      key: a.id, className: 'lib-item',
                      'aria-current': sel === a.id ? 'true' : 'false',
                      onClick: function () { elegir(a.id); }
                    }, a.nombre);
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

      ficha = h('section', { className: 'lib-ficha', key: alg.id, 'aria-label': 'Ficha técnica de ' + alg.nombre },
        h('button', { className: 'lib-btn lib-volver', onClick: function () { setSel(null); } }, '\u2190 Índice'),
        h('h2', null, alg.nombre),
        h('p', { className: 'lib-escuela' },
          h('span', { className: 'lib-punto', style: { background: colorDe(alg.escuela) } }),
          alg.escuela),
        h('p', { className: 'lib-meta' }, meta),

        seccion(2, 'Creador y fecha de creación', parrafo(alg.creador)),
        seccion(3, 'Utilidad principal o aplicaciones', parrafo(alg.utilidad)),
        seccion(4, 'Restricciones o limitaciones', parrafo(alg.restricciones)),
        seccion(5, 'Escuela de pensamiento', h('p', null, alg.escuela)),
        seccion(6, 'Orden de complejidad',
          h('ul', null,
            h('li', null, h('strong', null, 'Temporal: '), lleno(alg.complejidad_temporal) ? alg.complejidad_temporal : vacio()),
            h('li', null, h('strong', null, 'Espacial: '), lleno(alg.complejidad_espacial) ? alg.complejidad_espacial : vacio()))),
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
        seccion(9, 'Paradigma de programación conveniente', parrafo(alg.paradigma)),
        seccion(10, 'Reflexiones personales',
          h('div', null,
            h('p', { className: 'lib-q' }, PREGUNTAS.comprension), parrafo(alg.reflexion_comprension),
            h('p', { className: 'lib-q' }, PREGUNTAS.uso), parrafo(alg.reflexion_uso),
            h('p', { className: 'lib-q' }, PREGUNTAS.reto), parrafo(alg.reflexion_reto))),

        h(Comentarios, {
          lista: lista,
          esProfesor: rol === 'profesor',
          onCrear: function (texto) { return crearComentario(alg.id, texto); },
          onActualizar: actualizarComentario,
          onBorrar: borrarComentario
        })
      );
    }

    return h('div', null,
      h('div', { className: 'lib-head' },
        h('div', null,
          h('h1', { className: 'lib-title' }, 'Libreta'),
          h('p', { className: 'lib-count' }, algoritmos.length === 1 ? '1 ficha' : algoritmos.length + ' fichas')),
        h('div', null,
          aviso ? h('span', { className: 'warn', role: 'status' }, aviso + ' ') : null,
          h('button', { className: 'lib-btn', disabled: refrescando, onClick: actualizar }, refrescando ? 'Actualizando...' : 'Actualizar'))
      ),
      h('div', { className: 'lib', 'data-ficha': alg ? '1' : '0' }, indice, ficha)
    );
  }

  window.Libreta = Libreta;
})();
