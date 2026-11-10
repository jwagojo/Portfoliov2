// Fills the Resume, Projects, About and Contact panels (and the title-screen name lines) from content.json.
// If content.json can't be loaded, the text already written into the page stays as it is.
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function setBody(id, html) {
    const inner = document.querySelector('#panel-' + id + ' .panel-in'); if (!inner) return;
    const head = inner.querySelector('.panel-head'), foot = inner.querySelector('.panel-foot');
    [...inner.children].forEach((el) => { if (el !== head && el !== foot) el.remove(); });
    const tpl = document.createElement('template'); tpl.innerHTML = html;
    inner.insertBefore(tpl.content, foot || null);
  }
  function render(C) {
    const t = (sel, v) => { const el = document.querySelector(sel); if (el && v) el.textContent = v; };
    t('.nameplate', C.name); t('.tagline', C.tagline); t('.subline', C.subline);
    if (C.education || C.experience || C.skills) {
      const E = C.education || {};
      let h = E.school ? `<div class="card"><h3>${esc(E.school)}</h3><div class="meta"><em>${esc(E.degree)}</em><span class="when">${esc(E.when)}</span></div>${E.extra ? `<div class="meta"><span>${esc(E.extra)}</span></div>` : ''}</div>` : '';
      if (C.experience && C.experience.length) {
        h += '<div><h2>EXPERIENCE</h2>' + C.experience.map((x) => `<div class="entry"><div class="meta"><h3>${esc(x.title)}</h3><span class="when">${esc(x.when)}</span></div><div class="meta"><em>${esc(x.org)}</em><span>${esc(x.where)}</span></div>${(x.bullets || []).length ? '<ul>' + x.bullets.map((b) => `<li>${esc(b)}</li>`).join('') + '</ul>' : ''}</div>`).join('') + '</div>';
      }
      if (C.skills && C.skills.length) h += '<div><h2>SKILLS</h2><dl class="skills">' + C.skills.map((s) => `<div><dt>${esc(s.group)}</dt><dd>${esc(s.items)}</dd></div>`).join('') + '</dl></div>';
      setBody('resume', h);
    }
    if (C.projects) setBody('projects', C.projects.map((p) => `<div class="card"><h3>${esc(p.title)}</h3>${(p.tags || []).length ? '<div class="chips">' + p.tags.map((g) => `<span class="chip">${esc(g)}</span>`).join('') + '</div>' : ''}<p>${esc(p.text)}</p>${p.link ? `<p><a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">See it ➜</a></p>` : ''}</div>`).join(''));
    if (C.about) { const A = C.about; setBody('about', `<p class="lede">${esc(A.lede)}</p>${(A.hats || []).length ? '<div class="chips">' + A.hats.map((g) => `<span class="chip">${esc(g)}</span>`).join('') + '</div>' : ''}${(A.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('')}`); }
    if (C.contact) {
      // edit in place so the Copy button keeps working
      const K = C.contact, panel = document.getElementById('panel-contact'); if (!panel) return;
      const lede = panel.querySelector('.lede'); if (lede && K.lede) lede.textContent = K.lede;
      const em = panel.querySelector('#email'); if (em && K.email) em.textContent = K.email;
      const li = panel.querySelector('a[href*="linkedin"]'); if (li && K.linkedin) { li.href = K.linkedin; li.textContent = K.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); }
      const loc = [...panel.querySelectorAll('.panel-in > p')].find((p) => !p.classList.contains('lede')); if (loc && K.location) loc.textContent = K.location;
    }
  }
  fetch('content.json', { cache: 'no-cache' }).then((r) => r.ok ? r.json() : null).then((C) => { if (C) render(C); }).catch(() => {});
})();
