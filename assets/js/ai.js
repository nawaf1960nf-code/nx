/* Bloom AI — rule-based coach that:
   - Suggests progressive overload (heavier/more reps)
   - Detects plateaus and recommends deloads
   - Adapts to mood/energy
   - Remembers preferences (likes/dislikes)
   - Speaks warmly and personally */

const BloomAI = (function () {

  /* ── PROGRESSIVE OVERLOAD ───────────────────────────────
     Looks at last 1-3 sessions for a given exercise and
     suggests a target weight & reps for the next session. */
  function suggestForExercise(exerciseId, programDefault) {
    const u = BloomStore.currentUser();
    if (!u) return null;

    const rec = u.records[exerciseId];
    const history = rec && rec.history ? rec.history.slice(-12) : [];
    const todayMood = BloomStore.todayMood();

    // baseline = program default
    let targetWeight = programDefault.weight || 0;
    let targetReps = programDefault.reps || 10;
    let reason = i18n.t('Starting weight from your plan.', 'الوزن المبدئي من برنامجك.');
    let tone = 'neutral';

    if (history.length === 0) {
      return { weight: targetWeight, reps: targetReps, reason, tone };
    }

    // Look at most recent session-grouped data
    const last = history[history.length - 1];
    const prev = history.length > 1 ? history[history.length - 2] : null;
    const lastWeight = last.weight || 0;
    const lastReps = last.reps || 0;
    const lastDiff = last.difficulty || 'normal';

    targetWeight = lastWeight;
    targetReps = lastReps;

    // Mood / energy modifier
    let fatigueFactor = 0;
    if (todayMood) {
      if (todayMood.energy <= 2 || todayMood.mood === 'low' || todayMood.mood === 'tired') {
        fatigueFactor = -1;
      } else if (todayMood.energy >= 4 && (todayMood.mood === 'good' || todayMood.mood === 'amazing')) {
        fatigueFactor = 1;
      }
    }

    // Plateau detection — 3+ sessions same weight, last marked normal/easy
    const recentWeights = history.slice(-4).map(h => h.weight || 0);
    const samePlateau = recentWeights.length >= 3 && recentWeights.every(w => w === recentWeights[0]);

    if (lastDiff === 'easy' && fatigueFactor >= 0) {
      // Easy last time + good energy: jump up confidently
      const step = stepUp(lastWeight);
      targetWeight = lastWeight + step;
      reason = i18n.t(
        `Last session felt easy. Let's add ${step}kg today 💪`,
        `الجلسة الماضية كانت سهلة. نضيف ${step} كجم اليوم 💪`
      );
      tone = 'push';
    } else if (lastDiff === 'normal' && samePlateau && fatigueFactor >= 0) {
      // Plateau — small bump or rep increase
      const step = stepUp(lastWeight) / 2;
      if (step >= 1) {
        targetWeight = lastWeight + step;
        reason = i18n.t(
          `You've been steady at ${lastWeight}kg — time for a small bump.`,
          `ثبتي على ${lastWeight} كجم لفترة — حان وقت زيادة بسيطة.`
        );
        tone = 'push';
      } else {
        targetReps = lastReps + 1;
        reason = i18n.t(
          `Same weight, but let's chase one more rep today 🔥`,
          `نفس الوزن، لكن نطمح لتكرار إضافي اليوم 🔥`
        );
        tone = 'push';
      }
    } else if (lastDiff === 'normal' && fatigueFactor >= 0) {
      // Slight overload
      const step = stepUp(lastWeight);
      if (step <= lastWeight * 0.08) {
        targetWeight = lastWeight + step;
        reason = i18n.t(
          `You handled this well last time. Try ${targetWeight}kg today ✨`,
          `أتقنتي الجلسة الماضية. جرّبي ${targetWeight} كجم اليوم ✨`
        );
        tone = 'push';
      } else {
        reason = i18n.t('Stay sharp on form today — same weight, perfect reps.', 'تركّزي على الفورم اليوم — نفس الوزن، تكرارات نظيفة.');
      }
    } else if (lastDiff === 'hard' || fatigueFactor < 0) {
      // Hard / fatigued — repeat or reduce
      if (fatigueFactor < 0) {
        const step = stepDown(lastWeight);
        targetWeight = Math.max(0, lastWeight - step);
        reason = i18n.t(
          `You said you're tired today. Let's go a little lighter and focus on quality 🌸`,
          `قلتي إنك متعبة اليوم. نخفف شوي ونركّز على الجودة 🌸`
        );
        tone = 'gentle';
      } else {
        reason = i18n.t(
          `Last time was tough. Repeat ${lastWeight}kg and own it today.`,
          `الجلسة الماضية كانت صعبة. كرّري ${lastWeight} كجم وسيطري عليها اليوم.`
        );
        tone = 'gentle';
      }
    }

    return { weight: round05(targetWeight), reps: targetReps, reason, tone };
  }

  function stepUp(w) {
    if (w <= 0) return 2.5;
    if (w < 10) return 1;
    if (w < 25) return 2.5;
    if (w < 60) return 2.5;
    return 5;
  }
  function stepDown(w) {
    if (w < 10) return 1;
    if (w < 25) return 2.5;
    return 5;
  }
  function round05(n) { return Math.round(n / 0.5) * 0.5; }

  /* ── HOME PAGE COACH MESSAGE ────────────────────────────
     Picks a personalized message based on streak, recent
     progress and mood. */
  function homeCoachMessage() {
    const u = BloomStore.currentUser();
    if (!u) return { name: 'Bloom', msg: i18n.t("Welcome, beautiful ✨", "أهلاً بكِ يا جميلة ✨") };

    const stats = BloomStore.stats();
    const todayMood = BloomStore.todayMood();
    const name = u.name || 'Queen';
    let msg = '';

    if (stats.totalWorkouts === 0) {
      msg = i18n.t(
        `Welcome, ${name}. Today is the start of something beautiful 🌸`,
        `أهلاً ${name}. اليوم بداية شي جميل 🌸`
      );
    } else if (u.streak >= 7) {
      msg = i18n.t(
        `${u.streak}-day streak, ${name}. You're unstoppable 🔥`,
        `سلسلة ${u.streak} يوم يا ${name}. ما يوقفك شي 🔥`
      );
    } else if (u.streak >= 3) {
      msg = i18n.t(
        `${u.streak} days strong, ${name}. Keep glowing ✨`,
        `${u.streak} أيام متتالية يا ${name}. استمري بالتوهّج ✨`
      );
    } else if (todayMood && (todayMood.mood === 'low' || todayMood.mood === 'tired')) {
      msg = i18n.t(
        `Soft day, ${name}. Even 10 minutes counts. I've got you 🌷`,
        `يوم لطيف يا ${name}. حتى ١٠ دقائق تكفي. أنا معك 🌷`
      );
    } else {
      const arr = BLOOM_DATA.MOTIVATION.quotes[i18n.get()] || BLOOM_DATA.MOTIVATION.quotes.en;
      msg = arr[Math.floor(Math.random() * arr.length)];
    }

    return { name: i18n.t('Bloom Coach', 'مدرّبتك Bloom'), msg };
  }

  /* ── INSIGHTS ────────────────────────────────────────────
     Generates 2-3 personalized insights for the home/coach view. */
  function insights() {
    const u = BloomStore.currentUser();
    if (!u) return [];
    const out = [];

    // 1) strongest growth (last 30 days)
    const growth = strongestGrowth();
    if (growth) {
      out.push({
        icon: '📈', tone: 'cool',
        title: i18n.t('Your strongest growth', 'أقوى تطوّر عندك'),
        body: i18n.t(
          `${growth.name} improved ${growth.pct}% this month 🔥`,
          `${growth.name} تطوّر ${growth.pct}٪ هذا الشهر 🔥`
        )
      });
    }

    // 2) plateau warning
    const plat = detectPlateau();
    if (plat) {
      out.push({
        icon: '🌿', tone: 'warm',
        title: i18n.t('Time for a change', 'وقت التغيير'),
        body: i18n.t(
          `${plat.name} has stalled for ${plat.weeks} weeks. Try a deload or swap exercise.`,
          `${plat.name} ثابت من ${plat.weeks} أسابيع. جرّبي تخفيف الحمل أو استبدال التمرين.`
        )
      });
    }

    // 3) weekly consistency
    const u2 = u;
    const doneThisWeek = Object.keys(u2.week.completed || {}).length;
    const planned = (u2.program?.days || []).filter(d => !d.rest).length;
    out.push({
      icon: '🌸', tone: 'glow',
      title: i18n.t('This week', 'هذا الأسبوع'),
      body: i18n.t(
        `${doneThisWeek} of ${planned} workouts done — ${planned ? Math.round(doneThisWeek / planned * 100) : 0}% on track.`,
        `${doneThisWeek} من ${planned} تمارين — ${planned ? Math.round(doneThisWeek / planned * 100) : 0}٪ على المسار.`
      )
    });

    // 4) recovery suggestion if mood low
    const m = BloomStore.todayMood();
    if (m && (m.mood === 'low' || m.mood === 'tired' || (m.sleep || 5) <= 3)) {
      out.push({
        icon: '🌙', tone: 'cool',
        title: i18n.t('Recovery first', 'الاستشفاء أولاً'),
        body: i18n.t(
          'Your sleep/energy is low. Today\'s workout will be lighter & shorter.',
          'نومك أو طاقتك منخفض. تمرين اليوم راح يكون أخف وأقصر.'
        )
      });
    }

    return out;
  }

  function strongestGrowth() {
    const u = BloomStore.currentUser();
    if (!u) return null;
    let best = null;
    Object.entries(u.records || {}).forEach(([id, r]) => {
      if (!r.history || r.history.length < 3) return;
      const first = r.history[0];
      const last = r.history[r.history.length - 1];
      if (!first.weight || !last.weight) return;
      const pct = Math.round((last.weight - first.weight) / first.weight * 100);
      if (pct < 5) return;
      if (!best || pct > best.pct) {
        const ex = BLOOM_DATA.findExercise(id);
        best = { id, name: ex ? (i18n.get() === 'ar' ? ex.nameAr : ex.name) : id, pct };
      }
    });
    return best;
  }

  function detectPlateau() {
    const u = BloomStore.currentUser();
    if (!u) return null;
    for (const [id, r] of Object.entries(u.records || {})) {
      if (!r.history || r.history.length < 4) continue;
      const last4 = r.history.slice(-4);
      const w0 = last4[0].weight;
      if (last4.every(h => h.weight === w0) && w0 > 0) {
        const ex = BLOOM_DATA.findExercise(id);
        return { id, name: ex ? (i18n.get() === 'ar' ? ex.nameAr : ex.name) : id, weeks: 3 };
      }
    }
    return null;
  }

  /* ── POST-WORKOUT MESSAGE ──── */
  function postWorkoutMessage(stats) {
    const u = BloomStore.currentUser();
    const arr = BLOOM_DATA.MOTIVATION.workoutDone[i18n.get()] || BLOOM_DATA.MOTIVATION.workoutDone.en;
    const random = arr[Math.floor(Math.random() * arr.length)];
    let title = random;
    if (stats.newPRs > 0) {
      const prArr = BLOOM_DATA.MOTIVATION.prHit[i18n.get()] || BLOOM_DATA.MOTIVATION.prHit.en;
      title = prArr[Math.floor(Math.random() * prArr.length)];
    }
    return { title };
  }

  /* ── DAILY QUOTE ──── */
  function dailyQuote() {
    const arr = BLOOM_DATA.MOTIVATION.quotes[i18n.get()] || BLOOM_DATA.MOTIVATION.quotes.en;
    const idx = new Date().getDate() % arr.length;
    return arr[idx];
  }

  return {
    suggestForExercise, homeCoachMessage, insights,
    postWorkoutMessage, dailyQuote, detectPlateau, strongestGrowth
  };
})();
