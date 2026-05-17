/* Bloom — view renderers for all pages. */

const BloomViews = (function () {

  /* ─── HOME / DASHBOARD ──────────────────────────────── */
  function renderHome() {
    const u = BloomStore.currentUser(); if (!u) return;
    const el = document.getElementById('view-home');
    const stats = BloomStore.stats();
    const todayDay = todaysWorkout(u);
    const lang = i18n.get();

    // Rings: workouts this week / streak / xp
    const planned = (u.program?.days || []).filter(d => !d.rest).length || 5;
    const doneThisWeek = Object.keys(u.week.completed || {}).length;
    const weekPct = Math.min(100, Math.round((doneThisWeek / planned) * 100));
    const streakPct = Math.min(100, Math.round((u.streak / 7) * 100));
    const levelInfo = BLOOM_DATA.levelForXp(u.xp);
    const xpPct = levelInfo.pct;

    const coach = BloomAI.homeCoachMessage();
    const quote = BloomAI.dailyQuote();

    // recent PRs
    const recentPRs = collectRecentPRs(u).slice(0, 2);

    el.innerHTML = `
      <div class="greeting-row">
        <div>
          <h1>${greet()}, ${escape(u.name)} <span class="greet-emoji">${greetEmoji()}</span></h1>
        </div>
      </div>
      <div class="daily-quote">"${escape(quote)}"</div>

      ${gradientDefs()}

      <div class="rings-row">
        ${ringTile(i18n.t('Week', 'الأسبوع'), `${doneThisWeek}/${planned}`, weekPct, 'r-pink')}
        ${ringTile(i18n.t('Streak', 'سلسلة'), `${u.streak}🔥`, streakPct, 'r-purple')}
        ${ringTile(i18n.t('Level', 'المستوى'), `LV.${levelInfo.current.lvl}`, xpPct, 'r-blue')}
      </div>

      ${u.streak > 0 ? `
        <div class="streak-row">
          <div class="streak-flame">🔥</div>
          <div>
            <div class="streak-n">${u.streak} ${i18n.t('day streak', 'يوم متتالي')}</div>
            <div class="streak-l">${u.streak >= 3 ? i18n.t('Don\'t break the chain ✨', 'لا تكسري السلسلة ✨') : i18n.t('Keep showing up', 'استمري في الحضور')}</div>
          </div>
        </div>
      ` : ''}

      ${todayDay ? renderHeroWorkout(todayDay) : `
        <div class="card card-glass">
          <div class="row" style="gap:14px;">
            <div style="font-size:36px;">🌙</div>
            <div>
              <div class="fw-700">${i18n.t('Rest day', 'يوم راحة')}</div>
              <div class="text-sm text-soft">${i18n.t('Recovery makes you stronger.', 'الراحة تخليكِ أقوى.')}</div>
            </div>
          </div>
        </div>
      `}

      <div class="ai-tip">
        <div class="ai-tip-icon">✨</div>
        <div class="ai-tip-body">
          <div class="text-xs fw-700" style="opacity:.7;">${escape(coach.name)}</div>
          <div>${escape(coach.msg)}</div>
        </div>
      </div>

      <div class="stats-grid">
        ${statTile(i18n.t('Workouts', 'تمارين'), stats.totalWorkouts, '', 'up')}
        ${statTile(i18n.t('Total volume', 'الحجم الكلّي'), `${formatNum(stats.totalVolume)} kg`, '', 'up')}
        ${statTile(i18n.t('Personal records', 'أرقام قياسية'), stats.totalPRs, '', 'up')}
        ${statTile(i18n.t('XP', 'النقاط'), u.xp, levelInfo.current.name, 'up')}
      </div>

      ${recentPRs.length ? `
        <div class="section-title"><h2>${i18n.t('Recent PRs', 'أرقام قياسية حديثة')}</h2></div>
        ${recentPRs.map(pr => `
          <div class="recent-pr">
            <div class="pr-medal">🏆</div>
            <div class="pr-body">
              <div class="pr-name">${escape(pr.name)}</div>
              <div class="pr-detail">${pr.weight}kg × ${pr.reps} • ${formatDate(pr.ts)}</div>
            </div>
          </div>
        `).join('')}
      ` : ''}

      <div class="section-title">
        <h2>${i18n.t('Quick actions', 'إجراءات سريعة')}</h2>
      </div>
      <div class="stats-grid">
        <button class="card" onclick="BloomApp.go('library')" style="text-align:start;cursor:pointer;">
          <div style="font-size:28px;">📚</div>
          <div class="fw-700">${i18n.t('Exercise library', 'مكتبة التمارين')}</div>
          <div class="text-xs text-soft">${i18n.t('Browse & learn', 'تعلّمي وتصفّحي')}</div>
        </button>
        <button class="card" onclick="BloomApp.go('nutrition')" style="text-align:start;cursor:pointer;">
          <div style="font-size:28px;">💧</div>
          <div class="fw-700">${i18n.t('Nutrition', 'التغذية')}</div>
          <div class="text-xs text-soft">${i18n.t('Water & protein', 'ماء وبروتين')}</div>
        </button>
        <button class="card" onclick="BloomViews.openMoodCheck()" style="text-align:start;cursor:pointer;">
          <div style="font-size:28px;">🌷</div>
          <div class="fw-700">${i18n.t('How are you?', 'كيف حالك؟')}</div>
          <div class="text-xs text-soft">${i18n.t('Mood & energy', 'المزاج والطاقة')}</div>
        </button>
        <button class="card" onclick="BloomApp.go('achievements')" style="text-align:start;cursor:pointer;">
          <div style="font-size:28px;">🏆</div>
          <div class="fw-700">${i18n.t('Achievements', 'إنجازاتك')}</div>
          <div class="text-xs text-soft">${u.unlockedBadges.length}/${BLOOM_DATA.BADGES.length}</div>
        </button>
      </div>
    `;
  }

  function renderHeroWorkout(day) {
    const exCount = day.exercises.length;
    const est = Math.round(exCount * 8); // ~8 min per exercise
    const lang = i18n.get();
    return `
      <div class="hero-workout">
        <div class="hero-tag">${i18n.t('Today\'s session', 'تمرين اليوم')}</div>
        <div class="hero-title">${escape(lang === 'ar' ? day.nameAr : day.name)} ${day.emoji}</div>
        <div class="hero-meta">
          <span>💪 ${exCount} ${i18n.t('exercises', 'تمارين')}</span>
          <span>⏱️ ~${est} ${i18n.t('min', 'د')}</span>
        </div>
        <button class="hero-cta" onclick="BloomSession.start('${day.id}')">
          ${i18n.t('Start workout', 'ابدئي التمرين')} →
        </button>
      </div>
    `;
  }

  function ringTile(label, value, pct, cls) {
    const r = 32, c = 2 * Math.PI * r;
    const off = c - (c * (pct / 100));
    return `
      <div class="ring-tile">
        <svg class="ring-svg" viewBox="0 0 80 80">
          <circle class="ring-track" cx="40" cy="40" r="${r}"></circle>
          <circle class="ring-fill ${cls}" cx="40" cy="40" r="${r}"
            stroke-dasharray="${c}" stroke-dashoffset="${off}"></circle>
          <text class="ring-pct" x="50%" y="54%" text-anchor="middle">${pct}%</text>
        </svg>
        <div class="ring-val">${value}</div>
        <div class="ring-lbl">${label}</div>
      </div>
    `;
  }
  function statTile(label, value, delta, dir) {
    return `
      <div class="stat-mini">
        <div class="stat-mini-lbl">${label}</div>
        <div class="stat-mini-val">${value}</div>
        ${delta ? `<div class="stat-mini-delta ${dir}">${delta}</div>` : ''}
      </div>
    `;
  }
  function gradientDefs() {
    return `
      <svg width="0" height="0" style="position:absolute;">
        <defs>
          <linearGradient id="g-pink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f78cb1"/><stop offset="100%" stop-color="#c4a3f0"/>
          </linearGradient>
          <linearGradient id="g-purple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#c4a3f0"/><stop offset="100%" stop-color="#b8d8ff"/>
          </linearGradient>
          <linearGradient id="g-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffd28c"/><stop offset="100%" stop-color="#f78cb1"/>
          </linearGradient>
          <linearGradient id="g-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f78cb1"/><stop offset="100%" stop-color="#c4a3f0"/>
          </linearGradient>
          <linearGradient id="g-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f78cb1" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#f78cb1" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  /* ─── WORKOUTS / WEEKLY SCHEDULE ────────────── */
  function renderWorkouts() {
    const u = BloomStore.currentUser(); if (!u) return;
    const el = document.getElementById('view-workouts');
    const lang = i18n.get();
    const days = u.program?.days || [];
    const todayIdx = todayIndex();

    el.innerHTML = `
      <h1>${i18n.t('Your week', 'أسبوعك')}</h1>
      <p class="text-soft text-sm">${escape(lang === 'ar' ? u.program?.nameAr : u.program?.name) || ''}</p>

      ${weekStrip(days, todayIdx, u)}

      <div class="section-title"><h2>${i18n.t('Workouts', 'التمارين')}</h2>
        <button class="btn btn-ghost btn-sm" onclick="BloomViews.openCustomizeProgram()">${i18n.t('Customize', 'تخصيص')}</button>
      </div>

      ${days.map((d, i) => {
        const done = !!u.week.completed[d.id];
        const isToday = i === todayIdx;
        const exNames = (d.exercises || []).map(e => {
          const ex = BLOOM_DATA.findExercise(e.exerciseId);
          return ex ? (lang === 'ar' ? ex.nameAr : ex.name) : '';
        }).filter(Boolean);
        return `
          <button class="workout-card ${isToday ? 'today' : ''} ${done ? 'done' : ''}" onclick="${d.rest ? '' : `BloomSession.start('${d.id}')`}">
            <div class="wc-icon">${d.emoji || '💪'}</div>
            <div class="wc-body">
              <div class="row-spread">
                <div class="workout-name">${escape(lang === 'ar' ? d.nameAr : d.name)}</div>
                ${isToday ? `<div class="workout-tag">${i18n.t('Today', 'اليوم')}</div>` : ''}
              </div>
              <div class="workout-meta">
                ${d.rest
                  ? i18n.t('Rest & recover 🌙', 'راحة واستشفاء 🌙')
                  : `${exNames.slice(0,3).join(' · ')}${exNames.length > 3 ? ' · ...' : ''}`}
              </div>
            </div>
          </button>
        `;
      }).join('')}

      <div class="spacer-16"></div>
      <button class="btn btn-secondary btn-block" onclick="BloomViews.openResetWeek()">
        🔄 ${i18n.t('Reset week manually', 'إعادة ضبط الأسبوع')}
      </button>
    `;
  }

  function weekStrip(days, todayIdx, u) {
    const labels = i18n.get() === 'ar' ? ['الإث','الثل','الأر','الخم','الجم','السب','الأح'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const nums = weekDatesArray();
    return `<div class="week-strip">
      ${days.map((d, i) => `
        <div class="day-chip ${i === todayIdx ? 'today' : ''} ${u.week.completed[d.id] ? 'done' : ''} ${d.rest ? 'rest' : ''}">
          <div class="day-chip-l">${labels[i] || ''}</div>
          <div class="day-chip-n">${nums[i] || ''}</div>
        </div>
      `).join('')}
    </div>`;
  }

  /* ─── PROGRESS / CHARTS / PRs ─── */
  let progressTab = 'overview';
  function renderProgress() {
    const u = BloomStore.currentUser(); if (!u) return;
    const el = document.getElementById('view-progress');

    el.innerHTML = `
      <h1>${i18n.t('Progress', 'تقدّمك')}</h1>
      <p class="text-soft text-sm">${i18n.t('Your strength story — every rep matters.', 'قصة قوّتك — كل تكرار يهم.')}</p>

      <div class="tab-pills">
        ${tabPill('overview', i18n.t('Overview', 'نظرة عامة'))}
        ${tabPill('strength', i18n.t('Strength', 'القوّة'))}
        ${tabPill('prs',      i18n.t('PRs', 'أرقام قياسية'))}
        ${tabPill('body',     i18n.t('Body', 'الجسم'))}
      </div>

      ${gradientDefs()}

      <div id="progress-content"></div>
    `;
    el.querySelectorAll('.tab-pill').forEach(t => t.addEventListener('click', () => {
      progressTab = t.dataset.tab;
      renderProgress();
    }));
    renderProgressTab();
  }
  function tabPill(id, label) {
    return `<button class="tab-pill ${progressTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`;
  }

  function renderProgressTab() {
    const u = BloomStore.currentUser(); if (!u) return;
    const c = document.getElementById('progress-content');
    if (!c) return;

    if (progressTab === 'overview') {
      const stats = BloomStore.stats();
      const last30 = u.sessions.filter(s => s.endTs > Date.now() - 30 * 86400000);
      const muscleVol = computeMuscleVolume(last30);
      const max = Math.max(...Object.values(muscleVol), 1);
      c.innerHTML = `
        <div class="chart-card">
          <h3>${i18n.t('Last 30 days', 'آخر ٣٠ يوم')}</h3>
          <div class="chart-meta">${last30.length} ${i18n.t('workouts', 'تمارين')} • ${formatNum(stats.totalVolume)} kg ${i18n.t('total', 'إجمالي')}</div>
          ${weeklyVolumeChart(u)}
        </div>

        <div class="chart-card">
          <h3>${i18n.t('Muscle balance', 'توازن العضلات')}</h3>
          <div class="chart-meta">${i18n.t('Volume per muscle group', 'الحجم لكل مجموعة عضلية')}</div>
          ${Object.entries(muscleVol).map(([k, v]) => `
            <div class="bar-row">
              <div class="bar-lbl">${muscleLabel(k)}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${Math.round(v/max*100)}%"></div></div>
              <div class="bar-val">${formatNum(v)}kg</div>
            </div>
          `).join('') || `<div class="text-soft text-sm">${i18n.t('Train a few sessions to see your balance.', 'دربي عدة جلسات لتظهر بياناتك.')}</div>`}
        </div>
      `;
    }
    else if (progressTab === 'strength') {
      const exs = Object.entries(u.records || {})
        .filter(([id, r]) => r.history && r.history.length >= 2)
        .sort((a, b) => b[1].history.length - a[1].history.length);
      if (exs.length === 0) {
        c.innerHTML = `<div class="card text-soft t-c">${i18n.t('Complete more workouts to see your strength charts ✨', 'أكملي تمارين أكثر لرؤية مخططات قوّتك ✨')}</div>`;
        return;
      }
      c.innerHTML = exs.slice(0, 8).map(([id, r]) => {
        const ex = BLOOM_DATA.findExercise(id); if (!ex) return '';
        const series = r.history.slice(-12).map(h => h.weight || 0);
        const start = series[0], end = series[series.length - 1];
        const pct = start ? Math.round((end - start) / start * 100) : 0;
        return `
          <div class="chart-card">
            <h3>${escape(i18n.get()==='ar' ? ex.nameAr : ex.name)}</h3>
            <div class="chart-meta">${pct >= 0 ? '+' : ''}${pct}% • ${i18n.t('best', 'أفضل')} ${r.bestWeight}kg × ${r.bestReps}</div>
            ${sparkline(series)}
          </div>
        `;
      }).join('');
    }
    else if (progressTab === 'prs') {
      const prs = collectRecentPRs(u);
      if (prs.length === 0) {
        c.innerHTML = `
          <div class="card t-c">
            <div style="font-size:60px;">🏆</div>
            <h3>${i18n.t('No PRs yet', 'لا توجد أرقام قياسية بعد')}</h3>
            <p class="text-soft text-sm">${i18n.t('Push hard — your first PR is coming ✨', 'تحدّي نفسك — أول رقم قياسي قادم ✨')}</p>
          </div>
        `;
        return;
      }
      c.innerHTML = `<div class="pr-grid">${prs.slice(0, 12).map((pr, i) => `
        <div class="pr-card ${i % 3 === 0 ? 'glow' : i % 3 === 1 ? '' : 'cool'}">
          <div class="pr-medal-big">${i === 0 ? '👑' : '🏆'}</div>
          <div class="pr-info">
            <h4>${escape(pr.name)}</h4>
            <p>${pr.weight}kg × ${pr.reps}</p>
          </div>
          <div class="pr-date">${formatDate(pr.ts)}</div>
        </div>
      `).join('')}</div>`;
    }
    else if (progressTab === 'body') {
      const last = u.bodyLogs[0];
      c.innerHTML = `
        <div class="body-track">
          <h3>${i18n.t('Log measurements', 'سجّلي قياساتك')}</h3>
          <div class="chart-meta">${i18n.t('Weekly is plenty — focus on trends.', 'مرة بالأسبوع كافي — ركّزي على الاتجاه.')}</div>
          <div class="body-grid">
            <div class="body-input"><label>${i18n.t('Weight (kg)', 'الوزن')}</label><input id="bd-weight" type="number" step="0.1" value="${last?.weight || ''}"/></div>
            <div class="body-input"><label>${i18n.t('Waist (cm)', 'الخصر')}</label><input id="bd-waist" type="number" value="${last?.waist || ''}"/></div>
            <div class="body-input"><label>${i18n.t('Hips (cm)', 'الورك')}</label><input id="bd-hips" type="number" value="${last?.hips || ''}"/></div>
            <div class="body-input"><label>${i18n.t('Bust (cm)', 'الصدر')}</label><input id="bd-bust" type="number" value="${last?.bust || ''}"/></div>
          </div>
          <div class="spacer-8"></div>
          <button class="btn btn-primary btn-block" id="save-body">${i18n.t('Save measurements', 'حفظ القياسات')}</button>
        </div>

        ${u.bodyLogs.length >= 2 ? `
          <div class="chart-card">
            <h3>${i18n.t('Weight trend', 'مخطط الوزن')}</h3>
            ${sparkline(u.bodyLogs.slice(0, 12).map(b => b.weight || 0).reverse())}
          </div>
        ` : ''}
      `;
      document.getElementById('save-body').addEventListener('click', () => {
        BloomStore.logBody({
          weight: numOr(document.getElementById('bd-weight').value),
          waist:  numOr(document.getElementById('bd-waist').value),
          hips:   numOr(document.getElementById('bd-hips').value),
          bust:   numOr(document.getElementById('bd-bust').value),
        });
        BloomApp.toast(i18n.t('Saved ✨', 'تم الحفظ ✨'), 'success');
        renderProgressTab();
      });
    }
  }

  function weeklyVolumeChart(u) {
    const buckets = new Array(8).fill(0);
    const now = startOfWeek(new Date()).getTime();
    u.sessions.forEach(s => {
      const wDiff = Math.floor((now - startOfWeek(new Date(s.endTs)).getTime()) / (7 * 86400000));
      if (wDiff >= 0 && wDiff < 8) {
        s.exercises.forEach(e => e.sets.forEach(set => {
          buckets[7 - wDiff] += (set.weight || 0) * (set.reps || 0);
        }));
      }
    });
    return sparkline(buckets, { height: 140 });
  }

  function sparkline(values, opts = {}) {
    const w = 320, h = opts.height || 120;
    const pad = 20;
    if (!values.length) return '';
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const step = (w - pad * 2) / Math.max(values.length - 1, 1);
    const points = values.map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return [x, y];
    });
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const areaD = pathD + ` L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;
    return `
      <svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <line class="chart-axis" x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}"></line>
        <path class="chart-area" d="${areaD}"></path>
        <path class="chart-line" d="${pathD}"></path>
        ${points.map(p => `<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="4"></circle>`).join('')}
      </svg>
    `;
  }

  function computeMuscleVolume(sessions) {
    const map = { glutes: 0, hamstrings: 0, quads: 0, back: 0, shoulders: 0, chest: 0, arms: 0, core: 0 };
    sessions.forEach(s => s.exercises.forEach(ex => {
      const def = BLOOM_DATA.findExercise(ex.exerciseId);
      const m = def?.muscle || 'core';
      const vol = ex.sets.reduce((a, set) => a + (set.weight || 0) * (set.reps || 0), 0);
      map[m] = (map[m] || 0) + vol;
    }));
    // filter zero
    Object.keys(map).forEach(k => { if (map[k] === 0) delete map[k]; });
    return map;
  }
  function muscleLabel(k) {
    const map = { glutes: '🍑 Glutes', hamstrings: '🌹 Hams', quads: '👑 Quads',
                  back: '🦋 Back', shoulders: '⭐ Shoulders', chest: '💖 Chest',
                  arms: '💪 Arms', core: '✨ Core' };
    const ar = { glutes: '🍑 المؤخرة', hamstrings: '🌹 خلف الفخذ', quads: '👑 أمام الفخذ',
                 back: '🦋 الظهر', shoulders: '⭐ الأكتاف', chest: '💖 الصدر',
                 arms: '💪 الأذرع', core: '✨ البطن' };
    return i18n.get() === 'ar' ? (ar[k] || k) : (map[k] || k);
  }

  /* ─── COACH (AI page) ─── */
  function renderCoach() {
    const u = BloomStore.currentUser(); if (!u) return;
    const el = document.getElementById('view-coach');
    const coach = BloomAI.homeCoachMessage();
    const ins = BloomAI.insights();
    const todayMood = BloomStore.todayMood();

    el.innerHTML = `
      <div class="coach-hero">
        <div class="coach-avatar">✨</div>
        <div>
          <div class="coach-name">${i18n.t('Your AI coach', 'مدرّبتك الذكية')}</div>
          <div class="coach-msg">${escape(coach.msg)}</div>
        </div>
      </div>

      <div class="section-title"><h2>${i18n.t('Today\'s check-in', 'تسجيل اليوم')}</h2></div>
      ${todayMood ? `
        <div class="card">
          <div class="row" style="gap:14px;">
            <div style="font-size:36px;">${BLOOM_DATA.MOODS.find(m => m.id === todayMood.mood)?.emoji || '🙂'}</div>
            <div style="flex:1;">
              <div class="fw-700">${i18n.t('Logged today', 'سجّلتي اليوم')}</div>
              <div class="text-sm text-soft">
                ${i18n.t('Energy', 'طاقة')}: ${todayMood.energy}/5 ·
                ${i18n.t('Sleep', 'نوم')}: ${todayMood.sleep}/5
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="BloomViews.openMoodCheck()">${i18n.t('Update', 'تحديث')}</button>
          </div>
        </div>
      ` : `
        <button class="card" style="width:100%;text-align:start;cursor:pointer;" onclick="BloomViews.openMoodCheck()">
          <div class="row" style="gap:14px;">
            <div style="font-size:36px;">🌷</div>
            <div>
              <div class="fw-700">${i18n.t('How are you feeling?', 'كيف تشعرين اليوم؟')}</div>
              <div class="text-sm text-soft">${i18n.t('Tap to log mood + energy', 'سجّلي مزاجك وطاقتك')}</div>
            </div>
          </div>
        </button>
      `}

      <div class="section-title"><h2>${i18n.t('Insights for you', 'ملاحظات لك')}</h2></div>
      ${ins.map(i => `
        <div class="insight-card">
          <div class="insight-icon ${i.tone || ''}">${i.icon}</div>
          <div>
            <div class="insight-title">${escape(i.title)}</div>
            <div class="insight-body">${escape(i.body)}</div>
          </div>
        </div>
      `).join('')}

      <div class="section-title"><h2>${i18n.t('What I remember about you', 'ما أتذكره عنك')}</h2></div>
      <div class="card">
        ${memorySummary(u)}
      </div>
    `;
  }

  function memorySummary(u) {
    const goals = {
      tone:         { en: '🌸 Tone & sculpt',          ar: '🌸 شد ونحت' },
      build_muscle: { en: '🍑 Build glutes & curves',  ar: '🍑 بناء المؤخرة والمنحنيات' },
      lose_fat:     { en: '🔥 Lose fat',               ar: '🔥 فقدان الدهون' },
      strength:     { en: '💪 Get stronger',           ar: '💪 زيادة القوة' },
    };
    const levels = {
      beginner: { en: 'Beginner', ar: 'مبتدئة' },
      intermediate: { en: 'Intermediate', ar: 'متوسطة' },
      advanced: { en: 'Advanced', ar: 'متقدّمة' },
    };
    const lang = i18n.get();
    const goal = u.profile.goal && goals[u.profile.goal] ? goals[u.profile.goal][lang] : '—';
    const lvl = u.profile.level && levels[u.profile.level] ? levels[u.profile.level][lang] : '—';
    const focus = (u.profile.focusAreas || []).join(', ') || '—';
    const totals = BloomStore.stats();
    return `
      <div class="list-row" style="margin:0 0 8px;">
        <div class="li-ico">🎯</div>
        <div class="li-body"><div class="li-name">${i18n.t('Goal', 'الهدف')}</div><div class="li-sub">${goal}</div></div>
      </div>
      <div class="list-row" style="margin:0 0 8px;">
        <div class="li-ico">📊</div>
        <div class="li-body"><div class="li-name">${i18n.t('Level', 'المستوى')}</div><div class="li-sub">${lvl}</div></div>
      </div>
      <div class="list-row" style="margin:0 0 8px;">
        <div class="li-ico">🌟</div>
        <div class="li-body"><div class="li-name">${i18n.t('Focus areas', 'مناطق التركيز')}</div><div class="li-sub">${focus}</div></div>
      </div>
      <div class="list-row" style="margin:0 0 8px;">
        <div class="li-ico">📚</div>
        <div class="li-body"><div class="li-name">${i18n.t('Sessions remembered', 'جلسات محفوظة')}</div><div class="li-sub">${totals.totalWorkouts} • ${totals.totalPRs} PRs</div></div>
      </div>
      <div class="list-row" style="margin:0;">
        <div class="li-ico">💝</div>
        <div class="li-body"><div class="li-name">${i18n.t('Favorite muscle', 'العضلة المفضلة')}</div><div class="li-sub">${favoriteMuscle(u) || '—'}</div></div>
      </div>
    `;
  }
  function favoriteMuscle(u) {
    if (!u.sessions.length) return null;
    const map = {};
    u.sessions.forEach(s => s.exercises.forEach(e => {
      const def = BLOOM_DATA.findExercise(e.exerciseId);
      if (!def) return;
      map[def.muscle] = (map[def.muscle] || 0) + 1;
    }));
    const top = Object.entries(map).sort((a,b) => b[1] - a[1])[0];
    return top ? muscleLabel(top[0]) : null;
  }

  /* ─── MOOD CHECK MODAL ─── */
  function openMoodCheck() {
    const u = BloomStore.currentUser(); if (!u) return;
    const cur = BloomStore.todayMood() || {};
    const mc = document.getElementById('modal-card');
    mc.innerHTML = `
      <div class="sheet-handle"></div>
      <h2 class="modal-h2">${i18n.t('How are you today?', 'كيف حالك اليوم؟')}</h2>
      <p class="modal-sub">${i18n.t('Your coach adapts based on how you feel.', 'مدرّبتك تتكيّف حسب حالتك.')}</p>

      <div class="form-row">
        <label>${i18n.t('Mood', 'المزاج')}</label>
        <div class="mood-grid" id="mood-grid">
          ${BLOOM_DATA.MOODS.map(m => `
            <button class="mood-btn ${cur.mood === m.id ? 'selected' : ''}" data-id="${m.id}">
              <span class="e">${m.emoji}</span>
              <span class="l">${i18n.get() === 'ar' ? m.ar : m.en}</span>
            </button>
          `).join('')}
        </div>
      </div>

      ${rangeRow('energy', i18n.t('Energy', 'الطاقة'), cur.energy || 3, '🔋')}
      ${rangeRow('sleep', i18n.t('Sleep quality', 'جودة النوم'), cur.sleep || 3, '🌙')}
      ${rangeRow('motivation', i18n.t('Motivation', 'الحماس'), cur.motivation || 3, '🔥')}

      <button class="btn btn-primary btn-block btn-lg" id="save-mood">${i18n.t('Save', 'حفظ')}</button>
    `;
    BloomApp.openModal();

    let selectedMood = cur.mood || 'okay';
    mc.querySelectorAll('.mood-btn').forEach(b => b.addEventListener('click', () => {
      selectedMood = b.dataset.id;
      mc.querySelectorAll('.mood-btn').forEach(x => x.classList.toggle('selected', x.dataset.id === selectedMood));
    }));

    mc.querySelectorAll('input[type=range]').forEach(r => {
      const lbl = mc.querySelector(`[data-range-out="${r.name}"]`);
      const upd = () => { if (lbl) lbl.textContent = r.value; };
      r.addEventListener('input', upd); upd();
    });

    mc.querySelector('#save-mood').addEventListener('click', () => {
      const energy = +mc.querySelector('input[name=energy]').value;
      const sleep = +mc.querySelector('input[name=sleep]').value;
      const motivation = +mc.querySelector('input[name=motivation]').value;
      BloomStore.logMood({ mood: selectedMood, energy, sleep, motivation });
      BloomApp.closeModal();
      BloomApp.toast(i18n.t('Got it ✨ I\'ll adjust today.', 'تمام ✨ راح أعدّل تمرين اليوم.'), 'success');
      // refresh views
      if (document.getElementById('view-home').classList.contains('active')) renderHome();
      if (document.getElementById('view-coach').classList.contains('active')) renderCoach();
    });
  }

  function rangeRow(name, label, value, emoji) {
    return `
      <div class="form-row">
        <label>${label} ${emoji} <span data-range-out="${name}">${value}</span>/5</label>
        <input type="range" name="${name}" min="1" max="5" step="1" value="${value}" style="width:100%; accent-color: #f78cb1;" />
      </div>
    `;
  }

  /* ─── PROFILE ─── */
  function renderProfile() {
    const u = BloomStore.currentUser(); if (!u) return;
    const el = document.getElementById('view-profile');
    const lvl = BLOOM_DATA.levelForXp(u.xp);
    const lang = i18n.get();

    el.innerHTML = `
      <div class="profile-header">
        <div class="avatar avatar-lg">${escape((u.name || 'B').slice(0,1).toUpperCase())}</div>
        <div class="profile-name">${escape(u.name)}</div>
        <div class="profile-tag">${escape(u.email)}</div>
      </div>

      <div class="level-card">
        <div class="level-tag">${i18n.t('Level', 'المستوى')} ${lvl.current.lvl}</div>
        <div class="level-name">${lang === 'ar' ? lvl.current.nameAr : lvl.current.name}</div>
        <div class="xp-track"><div class="xp-fill" style="width:${lvl.pct}%"></div></div>
        <div class="xp-meta">
          <span>${u.xp} XP</span>
          <span>${lvl.next ? `${lvl.next.xp - u.xp} ${i18n.t('XP to', 'نقطة إلى')} ${lang === 'ar' ? lvl.next.nameAr : lvl.next.name}` : i18n.t('Max level', 'أقصى مستوى')}</span>
        </div>
      </div>

      <div class="section-title"><h2>${i18n.t('Account', 'الحساب')}</h2></div>
      <button class="list-row" style="width:100%;" onclick="BloomViews.openEditProfile()">
        <div class="li-ico">👤</div>
        <div class="li-body"><div class="li-name">${i18n.t('Edit profile', 'تعديل الملف')}</div>
        <div class="li-sub">${u.profile.weight ? `${u.profile.weight}kg · ${u.profile.height || '—'}cm` : i18n.t('Add your details', 'أضيفي تفاصيلك')}</div></div>
        <div class="li-arrow">›</div>
      </button>
      <button class="list-row" style="width:100%;" onclick="BloomApp.go('achievements')">
        <div class="li-ico">🏆</div>
        <div class="li-body"><div class="li-name">${i18n.t('Achievements', 'الإنجازات')}</div>
        <div class="li-sub">${u.unlockedBadges.length}/${BLOOM_DATA.BADGES.length} ${i18n.t('unlocked', 'مفتوحة')}</div></div>
        <div class="li-arrow">›</div>
      </button>
      <button class="list-row" style="width:100%;" onclick="BloomApp.go('library')">
        <div class="li-ico">📚</div>
        <div class="li-body"><div class="li-name">${i18n.t('Exercise library', 'مكتبة التمارين')}</div>
        <div class="li-sub">${BLOOM_DATA.EXERCISES.length} ${i18n.t('exercises', 'تمرين')}</div></div>
        <div class="li-arrow">›</div>
      </button>
      <button class="list-row" style="width:100%;" onclick="BloomApp.go('nutrition')">
        <div class="li-ico">💧</div>
        <div class="li-body"><div class="li-name">${i18n.t('Nutrition', 'التغذية')}</div>
        <div class="li-sub">${i18n.t('Water, protein & calories', 'ماء، بروتين، سعرات')}</div></div>
        <div class="li-arrow">›</div>
      </button>

      <div class="section-title"><h2>${i18n.t('Preferences', 'التفضيلات')}</h2></div>
      <button class="list-row" style="width:100%;" onclick="BloomApp.toggleTheme()">
        <div class="li-ico">${BloomStore.getTheme() === 'dark' ? '🌙' : '☀️'}</div>
        <div class="li-body"><div class="li-name">${i18n.t('Theme', 'المظهر')}</div>
        <div class="li-sub">${BloomStore.getTheme() === 'dark' ? i18n.t('Dark mode', 'الوضع الليلي') : i18n.t('Light mode', 'الوضع الفاتح')}</div></div>
        <div class="li-arrow">›</div>
      </button>
      <button class="list-row" style="width:100%;" onclick="BloomApp.toggleLang()">
        <div class="li-ico">🌐</div>
        <div class="li-body"><div class="li-name">${i18n.t('Language', 'اللغة')}</div>
        <div class="li-sub">${lang === 'ar' ? 'العربية' : 'English'}</div></div>
        <div class="li-arrow">›</div>
      </button>
      <button class="list-row" style="width:100%;" onclick="BloomViews.openPrefs()">
        <div class="li-ico">⚙️</div>
        <div class="li-body"><div class="li-name">${i18n.t('Workout preferences', 'تفضيلات التمرين')}</div>
        <div class="li-sub">${i18n.t('Rest time, auto progression…', 'وقت الراحة، التقدم التلقائي…')}</div></div>
        <div class="li-arrow">›</div>
      </button>

      <div class="spacer-16"></div>
      <button class="btn btn-danger btn-block" onclick="BloomApp.logout()">${i18n.t('Sign out', 'تسجيل الخروج')}</button>
      <div class="spacer-24"></div>
      <div class="t-c text-faint text-xs">Bloom v1.0 · ${i18n.t('Made with', 'صُنع بـ')} 💖</div>
    `;
  }

  function openEditProfile() {
    const u = BloomStore.currentUser();
    const mc = document.getElementById('modal-card');
    mc.innerHTML = `
      <div class="sheet-handle"></div>
      <h2 class="modal-h2">${i18n.t('Edit profile', 'تعديل الملف')}</h2>
      <div class="form-row">
        <label>${i18n.t('Name', 'الاسم')}</label>
        <input id="ep-name" value="${escape(u.name)}" />
      </div>
      <div class="form-row">
        <label>${i18n.t('Age', 'العمر')}</label>
        <input id="ep-age" type="number" value="${u.profile.age || ''}" />
      </div>
      <div class="form-row">
        <label>${i18n.t('Weight (kg)', 'الوزن (كجم)')}</label>
        <input id="ep-weight" type="number" step="0.1" value="${u.profile.weight || ''}" />
      </div>
      <div class="form-row">
        <label>${i18n.t('Height (cm)', 'الطول (سم)')}</label>
        <input id="ep-height" type="number" value="${u.profile.height || ''}" />
      </div>
      <button class="btn btn-primary btn-block btn-lg" id="ep-save">${i18n.t('Save', 'حفظ')}</button>
    `;
    BloomApp.openModal();
    mc.querySelector('#ep-save').addEventListener('click', () => {
      BloomStore.update(u => {
        u.name = mc.querySelector('#ep-name').value || u.name;
        u.profile.age = numOr(mc.querySelector('#ep-age').value);
        u.profile.weight = numOr(mc.querySelector('#ep-weight').value);
        u.profile.height = numOr(mc.querySelector('#ep-height').value);
      });
      BloomApp.closeModal();
      BloomApp.toast(i18n.t('Saved ✨', 'تم الحفظ ✨'), 'success');
      renderProfile();
      BloomApp.refreshTopbar();
    });
  }

  function openPrefs() {
    const u = BloomStore.currentUser();
    const mc = document.getElementById('modal-card');
    mc.innerHTML = `
      <div class="sheet-handle"></div>
      <h2 class="modal-h2">${i18n.t('Workout preferences', 'تفضيلات التمرين')}</h2>
      <div class="form-row">
        <label>${i18n.t('Default rest time (seconds)', 'وقت الراحة (ثواني)')}</label>
        <input id="pf-rest" type="number" min="15" max="300" value="${u.prefs.restDefault}" />
      </div>
      <div class="form-row">
        <label class="row" style="cursor:pointer;">
          <input id="pf-auto" type="checkbox" ${u.prefs.autoProgression ? 'checked' : ''} style="width:auto;"/>
          <span>${i18n.t('Auto-suggest progressive overload', 'اقتراحات تقدم تلقائي')}</span>
        </label>
      </div>
      <div class="form-row">
        <label class="row" style="cursor:pointer;">
          <input id="pf-sound" type="checkbox" ${u.prefs.soundOn ? 'checked' : ''} style="width:auto;"/>
          <span>${i18n.t('Sounds & haptics', 'الأصوات والاهتزاز')}</span>
        </label>
      </div>
      <button class="btn btn-primary btn-block btn-lg" id="pf-save">${i18n.t('Save', 'حفظ')}</button>
    `;
    BloomApp.openModal();
    mc.querySelector('#pf-save').addEventListener('click', () => {
      BloomStore.update(u => {
        u.prefs.restDefault = +mc.querySelector('#pf-rest').value || 60;
        u.prefs.autoProgression = mc.querySelector('#pf-auto').checked;
        u.prefs.soundOn = mc.querySelector('#pf-sound').checked;
      });
      BloomApp.closeModal();
      BloomApp.toast(i18n.t('Saved ✨', 'تم الحفظ ✨'), 'success');
    });
  }

  function openResetWeek() {
    const mc = document.getElementById('modal-card');
    mc.innerHTML = `
      <div class="sheet-handle"></div>
      <h2 class="modal-h2">${i18n.t('Reset this week?', 'إعادة ضبط الأسبوع؟')}</h2>
      <p class="modal-sub">${i18n.t('Clears your completed days for this week. Your history stays.', 'يمسح الأيام المكتملة فقط لهذا الأسبوع. سجلّك يبقى محفوظ.')}</p>
      <div class="row" style="gap:8px;">
        <button class="btn btn-ghost" style="flex:1;" onclick="BloomApp.closeModal()">${i18n.t('Cancel', 'إلغاء')}</button>
        <button class="btn btn-primary" style="flex:1;" id="confirm-reset">${i18n.t('Reset', 'إعادة ضبط')}</button>
      </div>
    `;
    BloomApp.openModal();
    mc.querySelector('#confirm-reset').addEventListener('click', () => {
      BloomStore.update(u => { u.week.completed = {}; u.week.startTs = startOfWeek(new Date()).getTime(); });
      BloomApp.closeModal();
      renderWorkouts();
      BloomApp.toast(i18n.t('Week reset ✨', 'تمت إعادة الضبط ✨'), 'success');
    });
  }

  function openCustomizeProgram() {
    const u = BloomStore.currentUser();
    const mc = document.getElementById('modal-card');
    const lang = i18n.get();
    mc.innerHTML = `
      <div class="sheet-handle"></div>
      <h2 class="modal-h2">${i18n.t('Customize program', 'تخصيص البرنامج')}</h2>
      <p class="modal-sub">${i18n.t('Edit exercises, sets and reps for each day.', 'عدّلي التمارين والمجموعات والتكرارات لكل يوم.')}</p>
      <div id="customize-list"></div>
    `;
    BloomApp.openModal();
    const list = mc.querySelector('#customize-list');
    u.program.days.forEach((d, di) => {
      if (d.rest) return;
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom = '10px';
      card.innerHTML = `<h3>${escape(lang === 'ar' ? d.nameAr : d.name)} ${d.emoji}</h3>`;
      d.exercises.forEach((ex, ei) => {
        const def = BLOOM_DATA.findExercise(ex.exerciseId);
        const row = document.createElement('div');
        row.style.cssText = 'display:grid;grid-template-columns:1fr 60px 60px 60px;gap:6px;align-items:center;margin-top:8px;';
        row.innerHTML = `
          <div class="text-sm fw-700">${def ? escape(lang === 'ar' ? def.nameAr : def.name) : ex.exerciseId}</div>
          <input type="number" min="1" max="10" value="${ex.sets}" data-field="sets" style="padding:8px;text-align:center;border:1px solid var(--line);border-radius:8px;background:var(--surface);"/>
          <input type="number" min="1" max="50" value="${ex.reps}" data-field="reps" style="padding:8px;text-align:center;border:1px solid var(--line);border-radius:8px;background:var(--surface);"/>
          <input type="number" min="0" step="0.5" value="${ex.weight}" data-field="weight" style="padding:8px;text-align:center;border:1px solid var(--line);border-radius:8px;background:var(--surface);"/>
        `;
        row.querySelectorAll('input').forEach(inp => {
          inp.addEventListener('change', () => {
            BloomStore.update(uu => {
              const v = +inp.value;
              uu.program.days[di].exercises[ei][inp.dataset.field] = isNaN(v) ? 0 : v;
            });
          });
        });
        card.appendChild(row);
      });
      list.appendChild(card);
    });
    const close = document.createElement('button');
    close.className = 'btn btn-primary btn-block btn-lg';
    close.textContent = i18n.t('Done', 'تم');
    close.style.marginTop = '12px';
    close.onclick = () => { BloomApp.closeModal(); renderWorkouts(); };
    list.appendChild(close);
  }

  /* ─── LIBRARY ─── */
  let libFilter = 'all';
  let libQuery = '';
  function renderLibrary() {
    const el = document.getElementById('view-library');
    const lang = i18n.get();
    el.innerHTML = `
      <div class="session-header">
        <button class="session-close" onclick="BloomApp.go('home')">←</button>
        <div class="session-title"><h2>${i18n.t('Exercise library', 'مكتبة التمارين')}</h2></div>
      </div>
      <div class="search-row">
        <span class="s-ico">🔍</span>
        <input id="lib-search" placeholder="${i18n.t('Search…', 'ابحثي…')}" value="${libQuery}"/>
      </div>
      <div class="chip-row" id="lib-chips">
        ${['all','glutes','hamstrings','quads','back','shoulders','chest','arms','core'].map(c => `
          <button class="chip ${libFilter === c ? 'active' : ''}" data-filter="${c}">${muscleLabel(c) === c ? (c === 'all' ? (i18n.t('All','الكل')) : c) : muscleLabel(c)}</button>
        `).join('')}
      </div>
      <div class="library-grid" id="lib-grid"></div>
    `;
    el.querySelector('#lib-search').addEventListener('input', (e) => { libQuery = e.target.value; renderLibGrid(); });
    el.querySelectorAll('#lib-chips .chip').forEach(c => c.addEventListener('click', () => {
      libFilter = c.dataset.filter; renderLibrary();
    }));
    renderLibGrid();
  }
  function renderLibGrid() {
    const grid = document.getElementById('lib-grid');
    if (!grid) return;
    const lang = i18n.get();
    const list = BLOOM_DATA.EXERCISES.filter(e => {
      const ok = libFilter === 'all' || e.muscle === libFilter;
      const q = libQuery.toLowerCase();
      const okQ = !q || e.name.toLowerCase().includes(q) || e.nameAr.toLowerCase().includes(q) || e.target.toLowerCase().includes(q);
      return ok && okQ;
    });
    grid.innerHTML = list.map((e, i) => `
      <button class="lib-card" onclick="BloomViews.openExerciseDetail('${e.id}')">
        <div class="lib-thumb c-${(i % 4) + 1}">${e.emoji}</div>
        <div class="lib-name">${escape(lang === 'ar' ? e.nameAr : e.name)}</div>
        <div class="lib-target">${e.target}</div>
      </button>
    `).join('') || `<div class="text-soft" style="grid-column:span 2;text-align:center;padding:24px;">${i18n.t('No exercises found', 'لا توجد تمارين')}</div>`;
  }
  function openExerciseDetail(id) {
    const ex = BLOOM_DATA.findExercise(id); if (!ex) return;
    const u = BloomStore.currentUser();
    const lang = i18n.get();
    const mc = document.getElementById('modal-card');
    const rec = u?.records?.[id];
    mc.innerHTML = `
      <div class="sheet-handle"></div>
      <div class="ex-detail-head">
        <div class="ex-detail-emoji">${ex.emoji}</div>
        <h2>${escape(lang === 'ar' ? ex.nameAr : ex.name)}</h2>
        <p class="text-soft" style="margin-top:4px;">${ex.target}</p>
      </div>

      ${rec && rec.bestWeight > 0 ? `
        <div class="recent-pr" style="margin-bottom:16px;">
          <div class="pr-medal">🏆</div>
          <div class="pr-body">
            <div class="pr-name">${i18n.t('Your best', 'أفضل أداء')}</div>
            <div class="pr-detail">${rec.bestWeight}kg × ${rec.bestReps}</div>
          </div>
        </div>
      ` : ''}

      <div class="ex-detail-section">
        <h3>💡 ${i18n.t('Tips', 'نصائح')}</h3>
        <ul>${ex.tips.map(t => `<li>${escape(t)}</li>`).join('')}</ul>
      </div>
      <div class="ex-detail-section">
        <h3>⚠️ ${i18n.t('Common mistakes', 'أخطاء شائعة')}</h3>
        <ul>${ex.mistakes.map(t => `<li>${escape(t)}</li>`).join('')}</ul>
      </div>
      <div class="ex-detail-section">
        <h3>👑 ${i18n.t('For women', 'للنساء')}</h3>
        <ul>${ex.women.map(t => `<li>${escape(t)}</li>`).join('')}</ul>
      </div>
      <div class="ex-detail-section">
        <h3>🔁 ${i18n.t('Alternatives', 'بدائل')}</h3>
        <ul>${ex.alts.map(t => `<li>${escape(t)}</li>`).join('')}</ul>
      </div>
    `;
    BloomApp.openModal();
  }

  /* ─── NUTRITION ─── */
  function renderNutrition() {
    const u = BloomStore.currentUser();
    const el = document.getElementById('view-nutrition');
    const water = BloomStore.todayWater();
    const nutri = BloomStore.todayNutri();
    const goalProtein = Math.round((u.profile.weight || 60) * 1.6);
    const goalCalories = Math.round((u.profile.weight || 60) * 30);

    el.innerHTML = `
      <div class="session-header">
        <button class="session-close" onclick="BloomApp.go('home')">←</button>
        <div class="session-title"><h2>${i18n.t('Nutrition', 'التغذية')}</h2></div>
      </div>

      <div class="nutri-row">
        <div class="nutri-tile">
          <div class="nutri-emoji">💧</div>
          <div class="nutri-val">${water}/8</div>
          <div class="nutri-lbl">${i18n.t('Water', 'ماء')}</div>
        </div>
        <div class="nutri-tile">
          <div class="nutri-emoji">🥚</div>
          <div class="nutri-val">${nutri.protein || 0}g</div>
          <div class="nutri-lbl">${i18n.t('Protein', 'بروتين')} / ${goalProtein}g</div>
        </div>
        <div class="nutri-tile">
          <div class="nutri-emoji">🍓</div>
          <div class="nutri-val">${nutri.calories || 0}</div>
          <div class="nutri-lbl">${i18n.t('Cal', 'سعرات')} / ${goalCalories}</div>
        </div>
      </div>

      <div class="card-glass" style="margin-top:14px;">
        <h3>💧 ${i18n.t('Water tracker', 'متابعة الماء')}</h3>
        <p class="text-sm text-soft">${i18n.t('Tap a drop to log a glass.', 'اضغطي على القطرة لتسجيل كوب.')}</p>
        <div class="water-tracker" id="water-row">
          ${Array.from({length: 8}).map((_, i) => `<span class="water-drop ${i < water ? 'filled' : ''}" data-i="${i}">💧</span>`).join('')}
        </div>
      </div>

      <div class="card" style="margin-top:14px;">
        <h3>🥚 ${i18n.t('Protein & calories', 'بروتين وسعرات')}</h3>
        <div class="form-row">
          <label>${i18n.t('Protein today (g)', 'البروتين اليوم (جم)')}</label>
          <input id="nutri-p" type="number" min="0" value="${nutri.protein || 0}"/>
        </div>
        <div class="form-row">
          <label>${i18n.t('Calories today (kcal)', 'السعرات اليوم')}</label>
          <input id="nutri-c" type="number" min="0" value="${nutri.calories || 0}"/>
        </div>
        <button class="btn btn-primary btn-block" id="nutri-save">${i18n.t('Save', 'حفظ')}</button>
      </div>

      <div class="card" style="margin-top:14px;background:var(--grad-cool);color:var(--ink);">
        <h3>✨ ${i18n.t('Smart suggestions', 'اقتراحات ذكية')}</h3>
        ${nutriSuggestions(u, water, nutri, goalProtein).map(s => `<div class="row" style="gap:8px;margin-top:6px;"><span>${s.icon}</span><span class="text-sm">${escape(s.text)}</span></div>`).join('')}
      </div>
    `;

    el.querySelectorAll('.water-drop').forEach(d => d.addEventListener('click', () => {
      const i = +d.dataset.i;
      const newCount = i + 1 === BloomStore.todayWater() ? i : i + 1;
      BloomStore.setWater(newCount);
      renderNutrition();
      if (newCount === 8) {
        BloomApp.toast(i18n.t('8 glasses ✨ hydration queen!', '٨ كؤوس ✨ ملكة الترطيب!'), 'success');
      }
    }));
    el.querySelector('#nutri-save').addEventListener('click', () => {
      BloomStore.setNutri({
        protein: numOr(el.querySelector('#nutri-p').value) || 0,
        calories: numOr(el.querySelector('#nutri-c').value) || 0,
      });
      BloomApp.toast(i18n.t('Saved ✨', 'تم الحفظ ✨'), 'success');
      renderNutrition();
    });
  }

  function nutriSuggestions(u, water, nutri, goalP) {
    const out = [];
    if (water < 4) out.push({ icon: '💧', text: i18n.t('You\'re behind on water. Drink a glass now 💕', 'متأخّرة بالماء. اشربي كوب الحين 💕') });
    if ((nutri.protein || 0) < goalP * 0.6) out.push({ icon: '🍳', text: i18n.t(`Aim for ${goalP}g protein today — eggs, yogurt, chicken.`, `استهدفي ${goalP} جم بروتين — بيض، زبادي، دجاج.`) });
    if (out.length === 0) out.push({ icon: '🌸', text: i18n.t('You\'re on track today, beautiful ✨', 'ماشية على المسار اليوم يا جميلة ✨') });
    return out;
  }

  /* ─── ACHIEVEMENTS ─── */
  function renderAchievements() {
    const u = BloomStore.currentUser();
    const el = document.getElementById('view-achievements');
    const stats = BloomStore.stats();
    const lang = i18n.get();
    el.innerHTML = `
      <div class="session-header">
        <button class="session-close" onclick="BloomApp.go('home')">←</button>
        <div class="session-title"><h2>${i18n.t('Achievements', 'إنجازات')}</h2></div>
      </div>
      <p class="text-soft text-sm">${u.unlockedBadges.length}/${BLOOM_DATA.BADGES.length} ${i18n.t('unlocked', 'مفتوحة')}</p>
      <div class="badge-grid">
        ${BLOOM_DATA.BADGES.map((b, i) => {
          const unlocked = u.unlockedBadges.includes(b.id);
          return `
            <div class="badge-card ${unlocked ? '' : 'locked'}">
              <div class="badge-icon c-${b.color}">${b.icon}</div>
              <div class="badge-name">${escape(lang === 'ar' ? b.nameAr : b.name)}</div>
              <div class="badge-desc">${escape(lang === 'ar' ? b.descAr : b.desc)}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* ─── HELPERS ─── */
  function escape(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
  function numOr(v) { const n = +v; return isNaN(n) ? null : n; }
  function formatNum(n) { return Math.round(n).toLocaleString(i18n.get() === 'ar' ? 'ar-EG' : 'en-US'); }
  function formatDate(ts) {
    const d = new Date(ts);
    const today = new Date();
    const diff = Math.floor((today - d) / 86400000);
    if (diff === 0) return i18n.t('Today', 'اليوم');
    if (diff === 1) return i18n.t('Yesterday', 'أمس');
    if (diff < 7) return `${diff}${i18n.t('d ago', ' يوم')}`;
    return d.toLocaleDateString(i18n.get() === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' });
  }
  function todayIndex() {
    const day = new Date().getDay(); // 0=Sun..6=Sat
    return (day === 0 ? 6 : day - 1); // Mon-based
  }
  function todaysWorkout(u) {
    const days = u.program?.days || [];
    const idx = todayIndex();
    const d = days[idx];
    if (!d || d.rest || u.week.completed[d.id]) return null;
    return d;
  }
  function weekDatesArray() {
    const monday = startOfWeek(new Date());
    return Array.from({length: 7}, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.getDate();
    });
  }
  function greet() {
    const h = new Date().getHours();
    if (h < 12) return i18n.t('Good morning', 'صباح الخير');
    if (h < 18) return i18n.t('Good afternoon', 'مساء النور');
    return i18n.t('Good evening', 'مساء الخير');
  }
  function greetEmoji() {
    const h = new Date().getHours();
    if (h < 12) return '🌸';
    if (h < 18) return '☀️';
    return '🌙';
  }
  function collectRecentPRs(u) {
    const prs = [];
    Object.entries(u.records || {}).forEach(([id, r]) => {
      if (!r.history) return;
      let prev = 0;
      r.history.forEach(h => {
        if ((h.weight || 0) > prev && h.weight > 0) {
          const ex = BLOOM_DATA.findExercise(id);
          prs.push({ id, name: ex ? (i18n.get() === 'ar' ? ex.nameAr : ex.name) : id, weight: h.weight, reps: h.reps, ts: h.ts });
          prev = h.weight;
        }
      });
    });
    prs.sort((a, b) => b.ts - a.ts);
    return prs;
  }

  return {
    renderHome, renderWorkouts, renderProgress, renderCoach, renderProfile,
    renderLibrary, renderNutrition, renderAchievements,
    openMoodCheck, openEditProfile, openPrefs, openResetWeek, openCustomizeProgram, openExerciseDetail,
    gradientDefs
  };
})();
