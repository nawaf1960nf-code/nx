/* Bloom — onboarding flow.
   Gathers goal, level, focus areas, age/weight/height, days/week. */
const BloomOnboard = (function () {

  const steps = [
    {
      key: 'goal',
      title: () => i18n.t('What\'s your main goal?', 'إيش هدفك الأساسي؟'),
      sub:   () => i18n.t('We\'ll tailor your workouts around it.', 'راح نفصّل تمارينك حوله.'),
      type: 'single',
      options: () => [
        { id: 'tone',          icon: '🌸', label: i18n.t('Tone & sculpt',     'نحت وشد'),       sub: i18n.t('Lean strength & curves',  'قوة ورشاقة وقوام') },
        { id: 'build_muscle',  icon: '🍑', label: i18n.t('Build glutes & curves', 'نحت المؤخرة والمنحنيات'), sub: i18n.t('Hypertrophy focus',        'بناء العضلات') },
        { id: 'lose_fat',      icon: '🔥', label: i18n.t('Lose fat',           'فقدان الدهون'), sub: i18n.t('Burn + cardio mix',         'حرق + كارديو') },
        { id: 'strength',      icon: '💪', label: i18n.t('Get stronger',       'زيادة القوة'), sub: i18n.t('Heavy compound lifts',      'رفعات مركبة ثقيلة') },
      ],
    },
    {
      key: 'level',
      title: () => i18n.t('Your experience level?', 'مستوى خبرتك؟'),
      sub:   () => i18n.t('Be honest — your AI coach adapts.', 'كوني صريحة — مدرّبتك تتكيّف.'),
      type: 'single',
      options: () => [
        { id: 'beginner',     icon: '🌱', label: i18n.t('Just starting',   'مبتدئة'),   sub: i18n.t('Less than 6 months',  'أقل من ٦ شهور') },
        { id: 'intermediate', icon: '🌿', label: i18n.t('Some experience', 'متوسطة'),   sub: i18n.t('6 months – 2 years',  '٦ شهور – سنتين') },
        { id: 'advanced',     icon: '👑', label: i18n.t('Experienced',     'متقدّمة'), sub: i18n.t('2+ years lifting',     'أكثر من سنتين') },
      ],
    },
    {
      key: 'focusAreas',
      title: () => i18n.t('Pick your focus areas', 'اختاري مناطق التركيز'),
      sub:   () => i18n.t('Choose any that matter most.', 'اختاري الأكثر أهمية لك.'),
      type: 'multi',
      options: () => [
        { id: 'glutes',    icon: '🍑', label: i18n.t('Glutes',      'المؤخرة') },
        { id: 'legs',      icon: '🦵', label: i18n.t('Legs',        'الأرجل') },
        { id: 'back',      icon: '🦋', label: i18n.t('Back & posture', 'الظهر والقوام') },
        { id: 'arms',      icon: '💪', label: i18n.t('Arms',        'الأذرع') },
        { id: 'shoulders', icon: '⭐', label: i18n.t('Shoulders',   'الأكتاف') },
        { id: 'core',      icon: '✨', label: i18n.t('Core',        'البطن') },
      ],
    },
    {
      key: 'daysPerWeek',
      title: () => i18n.t('How many days a week?', 'كم يوم بالأسبوع؟'),
      sub:   () => i18n.t('Consistency > intensity.', 'الاستمرارية أهم من الشدة.'),
      type: 'single',
      options: () => [
        { id: 3, icon: '🌱', label: i18n.t('3 days',  '٣ أيام') },
        { id: 4, icon: '🌸', label: i18n.t('4 days',  '٤ أيام') },
        { id: 5, icon: '👑', label: i18n.t('5 days',  '٥ أيام') },
        { id: 6, icon: '🔥', label: i18n.t('6 days',  '٦ أيام') },
      ],
    },
    {
      key: 'equipment',
      title: () => i18n.t('Where do you train?', 'وين تتمرّنين؟'),
      sub:   () => i18n.t('We\'ll match exercises to what you have.', 'نختار التمارين حسب اللي عندك.'),
      type: 'single',
      options: () => [
        { id: 'gym',  icon: '🏋️‍♀️', label: i18n.t('Gym',           'النادي') },
        { id: 'home', icon: '🏠',    label: i18n.t('Home',          'البيت') },
        { id: 'both', icon: '✨',    label: i18n.t('Both, flexible', 'الاثنين، مرن') },
      ],
    },
    {
      key: 'body',
      title: () => i18n.t('A few quick details', 'تفاصيل بسيطة'),
      sub:   () => i18n.t('Optional — helps personalize your plan.', 'اختياري — يساعد في تخصيص خطتك.'),
      type: 'form',
      fields: [
        { name: 'age',    label: i18n.t('Age',    'العمر'),         placeholder: '25', type: 'number' },
        { name: 'weight', label: i18n.t('Weight (kg)', 'الوزن (كجم)'), placeholder: '60', type: 'number', step: '0.1' },
        { name: 'height', label: i18n.t('Height (cm)', 'الطول (سم)'), placeholder: '165', type: 'number' },
      ]
    },
  ];

  let idx = 0;
  let answers = {};

  function start() {
    idx = 0;
    answers = {};
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('onboard-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
    render();
  }

  function render() {
    const step = steps[idx];
    document.getElementById('onboard-progress').style.width = ((idx + 1) / steps.length * 100) + '%';

    const wrap = document.getElementById('onboard-step');
    wrap.innerHTML = '';

    const h = document.createElement('div'); h.className = 'ob-step';
    h.innerHTML = `<h2>${step.title()}</h2><p class="ob-sub">${step.sub()}</p>`;
    wrap.appendChild(h);

    if (step.type === 'single' || step.type === 'multi') {
      const list = document.createElement('div'); list.className = 'ob-choices';
      const opts = step.options();
      const cur = answers[step.key];
      opts.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'ob-choice';
        const isSelected = step.type === 'single' ? (cur === o.id) : Array.isArray(cur) && cur.includes(o.id);
        if (isSelected) btn.classList.add('selected');
        btn.innerHTML = `<span class="ob-choice-icon">${o.icon}</span>
          <div class="ob-choice-body">
            <div>${o.label}</div>
            ${o.sub ? `<div class="ob-choice-sub">${o.sub}</div>` : ''}
          </div>`;
        btn.addEventListener('click', () => {
          if (step.type === 'single') {
            answers[step.key] = o.id;
            list.querySelectorAll('.ob-choice').forEach(x => x.classList.remove('selected'));
            btn.classList.add('selected');
            // auto advance for single
            setTimeout(next, 250);
          } else {
            const arr = Array.isArray(answers[step.key]) ? answers[step.key] : [];
            const i = arr.indexOf(o.id);
            if (i >= 0) arr.splice(i, 1); else arr.push(o.id);
            answers[step.key] = arr;
            btn.classList.toggle('selected');
          }
        });
        list.appendChild(btn);
      });
      wrap.appendChild(list);
    } else if (step.type === 'form') {
      const form = document.createElement('div');
      form.className = 'ob-choices';
      step.fields.forEach(f => {
        const row = document.createElement('div');
        row.className = 'form-row';
        row.innerHTML = `<label>${f.label}</label><input type="${f.type}" name="${f.name}" placeholder="${f.placeholder}" ${f.step ? `step="${f.step}"` : ''} value="${answers[f.name] || ''}" />`;
        form.appendChild(row);
        row.querySelector('input').addEventListener('input', (e) => {
          answers[f.name] = e.target.value;
        });
      });
      wrap.appendChild(form);
    }

    const actions = document.createElement('div'); actions.className = 'ob-actions';
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-ghost';
    backBtn.textContent = i18n.t('Back', 'رجوع');
    backBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
    backBtn.addEventListener('click', prev);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = idx === steps.length - 1
      ? i18n.t('Start my journey ✨', 'ابدئي رحلتي ✨')
      : i18n.t('Continue', 'متابعة');
    nextBtn.addEventListener('click', next);

    actions.appendChild(backBtn);
    actions.appendChild(nextBtn);
    wrap.appendChild(actions);
  }

  function next() {
    if (idx < steps.length - 1) { idx++; render(); }
    else finish();
  }
  function prev() { if (idx > 0) { idx--; render(); } }

  function finish() {
    BloomStore.update(u => {
      u.profile.goal = answers.goal || 'tone';
      u.profile.level = answers.level || 'beginner';
      u.profile.focusAreas = answers.focusAreas || [];
      u.profile.daysPerWeek = answers.daysPerWeek || 5;
      u.profile.equipment = answers.equipment || 'gym';
      u.profile.age    = answers.age    ? Number(answers.age)    : null;
      u.profile.weight = answers.weight ? Number(answers.weight) : null;
      u.profile.height = answers.height ? Number(answers.height) : null;
      u.onboarded = true;
      // remember in AI memory
      u.ai.memory.unshift({ ts: Date.now(), type: 'goal', note: `Goal: ${u.profile.goal}, level: ${u.profile.level}` });
    });

    document.getElementById('onboard-screen').classList.add('hidden');
    BloomApp.enterApp();
    BloomApp.toast(i18n.t('Welcome to Bloom 🌸', 'أهلاً بكِ في Bloom 🌸'), 'success');
  }

  return { start };
})();
