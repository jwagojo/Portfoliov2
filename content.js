// Fills the Resume, Projects, Leadership, About and Contact panels (and the title-screen name lines) from content.json.
// If content.json can't be loaded, the text already written into the page stays as it is.
// (The site build runs these same functions to write that built-in text, so the two always match.)
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ul = (b) => (b || []).length ? '<ul>' + b.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>' : '';
  const entry = (x) => `<div class="entry"><div class="meta"><h3>${esc(x.title)}</h3><span class="when">${esc(x.when)}</span></div><div class="meta"><em>${esc(x.org)}</em>${x.where ? `<span>${esc(x.where)}</span>` : ''}</div>${ul(x.bullets)}</div>`;
  const chips = (a) => (a || []).length ? '<div class="chips">' + a.map((g) => `<span class="chip">${esc(g)}</span>`).join('') + '</div>' : '';

  const R = {
    resume(C) {
      if (!(C.education || C.experience || C.skills)) return null;
      const E = C.education || {};
      let h = C.resumePdf ? `<div class="dl-row"><a class="btn dl" href="${esc(C.resumePdf)}" download="${esc(String(C.resumePdf).split('/').pop())}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Download my resume (PDF)</a></div>` : '';
      if (E.school) h += `<div class="card"><h3>${esc(E.school)}</h3><div class="meta"><em>${esc(E.degree)}</em><span class="when">${esc(E.when)}</span></div>${E.extra ? `<div class="meta"><span>${esc(E.extra)}</span></div>` : ''}${E.honors ? `<p class="small"><b>Honors &amp; programs:</b> ${esc(E.honors)}</p>` : ''}${E.coursework ? `<p class="small"><b>Coursework:</b> ${esc(E.coursework)}</p>` : ''}</div>`;
      if ((C.experience || []).length) h += '<div><h2>INDUSTRY &amp; RESEARCH</h2>' + C.experience.map(entry).join('') + '</div>';
      if ((C.work || []).length) h += '<div><h2>PROFESSIONAL EXPERIENCE</h2>' + C.work.map(entry).join('') + '</div>';
      if ((C.skills || []).length) h += '<div><h2>SKILLS</h2><dl class="skills">' + C.skills.map((s) => `<div><dt>${esc(s.group)}</dt><dd>${esc(s.items)}</dd></div>`).join('') + '</dl></div>';
      if ((C.certifications || []).length) h += '<div><h2>CERTIFICATIONS</h2><dl class="skills">' + C.certifications.map((s) => `<div><dt>${esc(s.name)}</dt><dd>${esc(s.issuer)} · ${esc(s.valid)}</dd></div>`).join('') + '</dl></div>';
      if (C.awards) h += `<div><h2>HONORS &amp; AWARDS</h2><dl class="skills">${C.awards.distinctions ? `<div><dt>Distinctions</dt><dd>${esc(C.awards.distinctions)}</dd></div>` : ''}${C.awards.scholarships ? `<div><dt>Scholarships &amp; grants</dt><dd>${esc(C.awards.scholarships)}</dd></div>` : ''}</dl></div>`;
      return h;
    },
    projects(C) {
      if (!C.projects) return null;
      return C.projects.map((p) => `<div class="card"><h3>${esc(p.title)}</h3>${chips(p.tags)}<p>${esc(p.text)}</p>${p.link ? `<p><a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">See it ➜</a></p>` : ''}</div>`).join('');
    },
    leadership(C) {
      if (!C.leadership) return null;
      return '<p class="lede">The SK Youth Center: where the organizing, mentoring and showing-up happens.</p>' + C.leadership.map((x) => `<div class="card">${entry(x).replace(/^<div class="entry">|<\/div>$/g, '')}</div>`).join('') +
        ((C.leadershipOther || []).length ? '<div><h2>ALSO</h2>' + ul(C.leadershipOther) + '</div>' : '');
    },
    about(C) {
      if (!C.about) return null; const A = C.about;
      return `<p class="lede">${esc(A.lede)}</p>${chips(A.hats)}${(A.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join('')}`;
    },
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = R; return; }

  function setBody(id, html) {
    if (html == null) return;
    const inner = document.querySelector('#panel-' + id + ' .panel-in'); if (!inner) return;
    const head = inner.querySelector('.panel-head'), foot = inner.querySelector('.panel-foot');
    [...inner.children].forEach((el) => { if (el !== head && el !== foot) el.remove(); });
    const tpl = document.createElement('template'); tpl.innerHTML = html;
    inner.insertBefore(tpl.content, foot || null);
  }
  function render(C) {
    const t = (sel, v) => { const el = document.querySelector(sel); if (el && v) el.textContent = v; };
    t('.nameplate', C.name); t('.tagline', C.tagline); t('.subline', C.subline);
    for (const k of Object.keys(R)) setBody(k, R[k](C));
    if (C.contact) {
      // edit in place so the Copy button keeps working
      const K = C.contact, panel = document.getElementById('panel-contact'); if (!panel) return;
      const lede = panel.querySelector('.lede'); if (lede && K.lede) lede.textContent = K.lede;
      const em = panel.querySelector('#email'); if (em && K.email) em.textContent = K.email;
      const li = panel.querySelector('a[href*="linkedin"]'); if (li && K.linkedin) { li.href = K.linkedin; li.textContent = K.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); }
      const gh = panel.querySelector('a[href*="github"]'); if (gh && K.github) { gh.href = K.github; gh.textContent = K.github.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); }
      const loc = [...panel.querySelectorAll('.panel-in > p')].find((p) => !p.classList.contains('lede')); if (loc && K.location) loc.textContent = K.location;
    }
  }
  fetch('content.json', { cache: 'no-cache' }).then((r) => r.ok ? r.json() : null).then((C) => { if (C) render(C); }).catch(() => {});
})();
