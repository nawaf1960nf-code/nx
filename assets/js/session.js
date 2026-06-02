/* Bloom — workout session view (start, log sets, finish) */

const BloomSession = (function () {

  let current = null;   // active session
  let restInterval = null;
  let restRemain = 0;

  function start(dayId) {
    const u = BloomStore.currentUser();
    const day = u.program.days.find(d => d.id === dayId);
    if (!day || day.rest) return;

    // Pre-fill suggestions from AI for each set
    const exercises = day.exercises.map((planned, i) => {
      const suggestion = BloomAI.suggestForExercise(planned.exerciseId, planned);
      const sets = Array.from({length: planned.sets}, () => ({
        weight: suggestion ? suggestion.weight : (planned.weight || 0),
        reps: suggestion ? suggestion.reps : (planned.reps || 10),
        difficulty: 'normal',
        done: false,
        isPR: false,
      }));
      return {
        exerciseId: planned.exerciseId,
        plannedSets: planned.sets,
        plannedReps: planned.reps,
        plannedWeight: planned.weight,
        suggestion,
        sets,
        notes: '',
      };
    });

    current = {
      id: 'S' + Date.now(),
      dayId,
      dayName: day.name,
      dayNameAr: day.nameAr,
      emoji: day.emoji,
      startTs: Date.now(),
      endTs: null,
      exercises,
    };
    BloomApp.go('session');
    render();
  }

  function render() {
    if (!current) return;
    const el = document.getElementById('view-session');
    const lang = i18n.get();
    const totalSets = current.exercises.reduce((a, ex) => a + ex.sets.length, 0);
    const doneSets = current.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.done).length, 0);
    const progress = Math.round((doneSets / totalSets) * 100);

    el.innerHTML = `
      <div class="session-header">
        <button class="session-close" id="session-close">←</button>
        <div class="session-title">
          <h2>${escape(lang === 'ar' ? current.dayNameAr : current.dayName)} ${current.emoji}</h2>
          <div class="session-sub">${doneSets}/${totalSets} ${i18n.t('sets', 'مجموعة')} · ${elapsedMin()} ${i18n.t('min', 'د')}</div>
        </div>
      </div>
      <div class="session-progress"><div class="session-progress-fill" style="width:${progress}%"></div></div>

      <div id="exercises-list"></div>

      <div class="session-footer">
        <button class="btn btn-primary btn-block btn-lg" id="finish-btn">
          ${doneSets === totalSets
            ? i18n.t('Finish workout 🎉', 'إنهاء التمرين 🎉')
            : `${i18n.t('Finish anyway', 'إنهاء على أي حال')} (${doneSets}/${totalSets})`}
        </button>
      </div>
    `;

    document.getElementById('session-close').addEventListener('click', confirmClose);
    document.getElementById('finish-btn').addEventListener('click', finish);
    renderExercises();
  }

  function renderExercises() {
    const list = document.getElementById('exercises-list');
    if (!list) return;
    const lang = i18n.get();
    list.innerHTML = current.exercises.map((ex, i) => {
      const def = BLOOM_DATA.findExercise(ex.exerciseId);
      const name = def ? (lang === 'ar' ? def.nameAr : def.name) : ex.exerciseId;
      const allDone = ex.sets.every(s => s.done);
      return `
        <div class="exercise-card ${allDone ? 'done' : ''}" data-ex="${i}">
          <div class="ex-head">
            <div class="ex-num">${i + 1}</div>
            <div class="ex-body">
              <div class="ex-name">${escape(name)}</div>
              <div class="ex-target text-sm">${def?.target || ''} ${def?.emoji || ''}</div>
            </div>
            <button class="ex-info-btn" data-info="${ex.exerciseId}">ⓘ</button>
          </div>

          ${ex.suggestion ? `
            <div class="ex-ai-suggest">
              <span>✨</span>
              <div><strong>AI:</strong> ${escape(ex.suggestion.reason)}</div>
            </div>
          ` : ''}

          <div class="set-head">
            <div>${i18n.t('Set', 'م')}</div>
            <div>${i18n.t('Weight (kg)', 'الوزن')}</div>
            <div>${i18n.t('Reps', 'تكرار')}</div>
            <div>${i18n.t('How?', 'الصعوبة؟')}</div>
            <div></div>
          </div>

          ${ex.sets.map((s, si) => `
            <div class="set-row ${s.done ? 'done' : ''}" data-ex="${i}" data-set="${si}">
              <div class="set-n">${si + 1}</div>
              <input type="number" inputmode="decimal" min="0" step="0.5" value="${s.weight}" data-field="weight"/>
              <input type="number" inputmode="numeric" min="0" max="100" value="${s.reps}" data-field="reps"/>
              <div class="set-difficulty">
                <button class="diff-btn easy ${s.difficulty === 'easy' ? 'active' : ''}" data-d="easy">😌</button>
                <button class="diff-btn normal ${s.difficulty === 'normal' ? 'active' : ''}" data-d="normal">🙂</button>
                <button class="diff-btn hard ${s.difficulty === 'hard' ? 'active' : ''}" data-d="hard">😤</button>
              </div>
              <button class="set-check ${s.done ? 'checked' : ''}" data-check>✓</button>
            </div>
          `).join('')}

          <div class="ex-actions">
            <button class="btn btn-ghost btn-sm" data-add-set>+ ${i18n.t('Add set', 'مجموعة')}</button>
            <button class="btn btn-ghost btn-sm" data-skip-ex>↷ ${i18n.t('Skip', 'تخطّي')}</button>
          </div>

          <textarea class="ex-notes" placeholder="${i18n.t('Notes after this exercise…', 'ملاحظات بعد التمرين…')}" data-notes>${escape(ex.notes)}</textarea>
        </div>
      `;
    }).join('');

    // Bind interactions
    list.querySelectorAll('.set-row').forEach(row => {
      const exI = +row.dataset.ex, setI = +row.dataset.set;
      row.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('change', () => {
          const v = +inp.value;
          current.exercises[exI].sets[setI][inp.dataset.field] = isNaN(v) ? 0 : v;
        });
      });
      row.querySelectorAll('.diff-btn').forEach(b => b.addEventListener('click', () => {
        current.exercises[exI].sets[setI].difficulty = b.dataset.d;
        row.querySelectorAll('.diff-btn').forEach(x => x.classList.toggle('active', x === b));
      }));
      row.querySelector('[data-check]').addEventListener('click', () => completeSet(exI, setI));
    });
    list.querySelectorAll('[data-add-set]').forEach(b => b.addEventListener('click', () => {
      const exI = +b.closest('.exercise-card').dataset.ex;
      const last = current.exercises[exI].sets[current.exercises[exI].sets.length - 1];
      current.exercises[exI].sets.push({ weight: last?.weight || 0, reps: last?.reps || 0, difficulty: 'normal', done: false, isPR: false });
      renderExercises();
    }));
    list.querySelectorAll('[data-skip-ex]').forEach(b => b.addEventListener('click', () => {
      const exI = +b.closest('.exercise-card').dataset.ex;
      current.exercises[exI].sets.forEach(s => s.done = true);
      renderExercises();
      updateHeader();
    }));
    list.querySelectorAll('[data-notes]').forEach(t => t.addEventListener('input', e => {
      const exI = +e.target.closest('.exercise-card').dataset.ex;
      current.exercises[exI].notes = e.target.value;
    }));
    list.querySelectorAll('[data-info]').forEach(b => b.addEventListener('click', () => {
      BloomViews.openExerciseDetail(b.dataset.info);
    }));
  }

  function completeSet(exI, setI) {
    const set = current.exercises[exI].sets[setI];
    if (set.done) {
      set.done = false;
      // hide rest timer if it's active
      hideRest();
      renderExercises(); updateHeader(); return;
    }
    set.done = true;

    // Check PR — compare to historical best from records
    const exId = current.exercises[exI].exerciseId;
    const u = BloomStore.currentUser();
    const rec = u.records[exId] || { bestWeight: 0, bestReps: 0 };
    const isPR = set.weight > rec.bestWeight && set.weight > 0;
    set.isPR = isPR;

    renderExercises(); updateHeader();

    // PR celebration
    if (isPR) {
      celebratePR(exId, set);
    }

    // Start rest timer
    startRest(u.prefs.restDefault || 60);

    // haptic vibe (where supported)
    if (navigator.vibrate) navigator.vibrate(20);
  }

  function celebratePR(exId, set) {
    Confetti.celebrate();
    const ex = BLOOM_DATA.findExercise(exId);
    const lang = i18n.get();
    const mc = document.getElementById('modal-card');
    mc.parentElement.classList.add('center');
    mc.innerHTML = `
      <div class="pr-celebrate">
        <div class="crown">👑</div>
        <h2>${i18n.t('NEW PR UNLOCKED', 'رقم قياسي جديد')}</h2>
        <p>${escape(ex ? (lang === 'ar' ? ex.nameAr : ex.name) : '')}</p>
        <div class="pr-shine">
          <div class="vbig">${set.weight}kg × ${set.reps}</div>
          <div>${i18n.t('You broke your record ✨', 'كسرتي رقمك ✨')}</div>
        </div>
        <button class="btn btn-primary btn-block btn-lg" id="pr-close">${i18n.t('Let\'s keep going 🔥', 'نكمّل 🔥')}</button>
      </div>
    `;
    document.getElementById('modal').classList.remove('hidden');
    mc.querySelector('#pr-close').addEventListener('click', () => {
      document.getElementById('modal').classList.add('hidden');
      mc.parentElement.classList.remove('center');
    });
  }

  function updateHeader() {
    const totalSets = current.exercises.reduce((a, ex) => a + ex.sets.length, 0);
    const doneSets = current.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.done).length, 0);
    const progress = Math.round((doneSets / totalSets) * 100);
    const fill = document.querySelector('.session-progress-fill');
    if (fill) fill.style.width = progress + '%';
    const sub = document.querySelector('.session-sub');
    if (sub) sub.textContent = `${doneSets}/${totalSets} ${i18n.t('sets', 'مجموعة')} · ${elapsedMin()} ${i18n.t('min', 'د')}`;
    const finish = document.getElementById('finish-btn');
    if (finish) finish.textContent = doneSets === totalSets
      ? i18n.t('Finish workout 🎉', 'إنهاء التمرين 🎉')
      : `${i18n.t('Finish anyway', 'إنهاء على أي حال')} (${doneSets}/${totalSets})`;
  }

  /* ─── Rest timer ─── */
  function startRest(seconds) {
    restRemain = seconds;
    const el = document.getElementById('rest-timer');
    el.classList.remove('hidden');
    document.getElementById('rest-time').textContent = formatTime(restRemain);
    if (restInterval) clearInterval(restInterval);
    restInterval = setInterval(() => {
      restRemain--;
      document.getElementById('rest-time').textContent = formatTime(restRemain);
      if (restRemain <= 0) {
        clearInterval(restInterval);
        hideRest();
        if (navigator.vibrate) navigator.vibrate([30, 30, 60]);
        BloomApp.toast(i18n.t('Rest done — let\'s go 💪', 'انتهت الراحة — يلا 💪'), 'success');
      }
    }, 1000);

    document.getElementById('rest-plus').onclick = () => { restRemain = Math.min(restRemain + 15, 600); document.getElementById('rest-time').textContent = formatTime(restRemain); };
    document.getElementById('rest-minus').onclick = () => { restRemain = Math.max(restRemain - 15, 5); document.getElementById('rest-time').textContent = formatTime(restRemain); };
    document.getElementById('rest-skip').onclick = () => { clearInterval(restInterval); hideRest(); };
  }
  function hideRest() {
    document.getElementById('rest-timer').classList.add('hidden');
    if (restInterval) { clearInterval(restInterval); restInterval = null; }
  }
  function formatTime(s) {
    s = Math.max(0, s);
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  function elapsedMin() {
    return Math.max(1, Math.round((Date.now() - current.startTs) / 60000));
  }

  /* ─── Finish ─── */
  function confirmClose() {
    const mc = document.getElementById('modal-card');
    mc.innerHTML = `
      <div class="sheet-handle"></div>
      <h2 class="modal-h2">${i18n.t('Leave workout?', 'مغادرة التمرين؟')}</h2>
      <p class="modal-sub">${i18n.t('Your progress this session won\'t be saved.', 'تقدّمك في هذه الجلسة لن يُحفظ.')}</p>
      <div class="row" style="gap:8px;">
        <button class="btn btn-ghost" style="flex:1;" onclick="BloomApp.closeModal()">${i18n.t('Stay', 'البقاء')}</button>
        <button class="btn btn-danger" style="flex:1;" id="confirm-leave">${i18n.t('Leave', 'مغادرة')}</button>
      </div>
    `;
    BloomApp.openModal();
    mc.querySelector('#confirm-leave').addEventListener('click', () => {
      current = null;
      hideRest();
      BloomApp.closeModal();
      BloomApp.go('home');
    });
  }

  function finish() {
    if (!current) return;
    hideRest();
    current.endTs = Date.now();
    const u = BloomStore.currentUser();

    // Persist records for each completed set
    let newPRs = 0, totalVolume = 0, completedSets = 0;
    current.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (!set.done) return;
        completedSets++;
        totalVolume += (set.weight || 0) * (set.reps || 0);
        const wasPR = BloomStore.updateRecord(ex.exerciseId, set);
        if (wasPR) newPRs++;
      });
    });

    // Don't save if nothing was done
    if (completedSets === 0) {
      BloomApp.toast(i18n.t('No sets completed yet 💕', 'ما تم تسجيل مجموعات بعد 💕'), 'warn');
      return;
    }

    // Save session
    BloomStore.addSession({
      id: current.id, dayId: current.dayId, dayName: current.dayName,
      startTs: current.startTs, endTs: current.endTs,
      exercises: current.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        notes: ex.notes,
        sets: ex.sets.filter(s => s.done),
      })),
    });
    BloomStore.markDayDone(current.dayId, current.id);
    BloomStore.bumpStreak();

    // XP: 30 base + bonus for sets and PRs
    const xpGain = 30 + completedSets * 5 + newPRs * 25;
    BloomStore.addXp(xpGain);

    // Check for newly unlocked badges
    const before = new Set(u.unlockedBadges);
    const stats = BloomStore.stats();
    const newlyUnlocked = [];
    BLOOM_DATA.BADGES.forEach(b => {
      if (!before.has(b.id) && b.req(stats)) {
        newlyUnlocked.push(b);
      }
    });
    if (newlyUnlocked.length) {
      BloomStore.update(uu => { newlyUnlocked.forEach(b => uu.unlockedBadges.push(b.id)); });
    }

    // Show completion modal
    showCompletion({ xpGain, newPRs, totalVolume, completedSets, newlyUnlocked });

    current = null;
  }

  function showCompletion({ xpGain, newPRs, totalVolume, completedSets, newlyUnlocked }) {
    const u = BloomStore.currentUser();
    const post = BloomAI.postWorkoutMessage({ newPRs });
    const mc = document.getElementById('modal-card');
    mc.parentElement.classList.add('center');
    const lang = i18n.get();
    mc.innerHTML = `
      <div class="pr-celebrate">
        <div class="crown">${newPRs > 0 ? '👑' : '🌸'}</div>
        <h2>${escape(post.title)}</h2>
        <p>${i18n.t('Workout complete', 'انتهى التمرين')}</p>
        <div class="stats-grid" style="margin-bottom:16px;">
          <div class="stat-mini">
            <div class="stat-mini-lbl">${i18n.t('Sets', 'مجموعات')}</div>
            <div class="stat-mini-val">${completedSets}</div>
          </div>
          <div class="stat-mini">
            <div class="stat-mini-lbl">${i18n.t('Volume', 'الحجم')}</div>
            <div class="stat-mini-val">${formatNum(totalVolume)} kg</div>
          </div>
          <div class="stat-mini">
            <div class="stat-mini-lbl">${i18n.t('XP earned', 'النقاط')}</div>
            <div class="stat-mini-val">+${xpGain}</div>
          </div>
          <div class="stat-mini">
            <div class="stat-mini-lbl">${i18n.t('Streak', 'سلسلة')}</div>
            <div class="stat-mini-val">${u.streak}🔥</div>
          </div>
        </div>
        ${newPRs ? `<div class="pr-shine"><div class="vbig">${newPRs} ${i18n.t('new PRs', 'أرقام قياسية')} 🏆</div></div>` : ''}
        ${newlyUnlocked.length ? `
          <div class="card" style="margin-top:12px;">
            <h3>${i18n.t('Achievement unlocked!', 'إنجاز جديد!')}</h3>
            ${newlyUnlocked.map(b => `
              <div class="row" style="margin-top:8px;">
                <div class="badge-icon c-${b.color}" style="width:48px;height:48px;font-size:24px;">${b.icon}</div>
                <div>
                  <div class="fw-700">${escape(lang === 'ar' ? b.nameAr : b.name)}</div>
                  <div class="text-xs text-soft">${escape(lang === 'ar' ? b.descAr : b.desc)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="spacer-16"></div>
        <button class="btn btn-primary btn-block btn-lg" id="comp-close">${i18n.t('Done 💖', 'تم 💖')}</button>
      </div>
    `;
    document.getElementById('modal').classList.remove('hidden');
    Confetti.celebrate();
    mc.querySelector('#comp-close').addEventListener('click', () => {
      document.getElementById('modal').classList.add('hidden');
      mc.parentElement.classList.remove('center');
      BloomApp.go('home');
    });
  }

  function escape(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
  function formatNum(n) { return Math.round(n).toLocaleString(i18n.get() === 'ar' ? 'ar-EG' : 'en-US'); }

  return { start, render };
})();
