// Локальный запуск тестов креативности ИИ
// Использует fetch API из Node.js 18+

const API_URL = 'https://functions.poehali.dev/9ea67dc2-c306-4906-bf0f-da435600b92c';

const tests = {
  'Mo Dao Zu Shi (канон китайского фэнтези)': {
    game_settings: {
      genre: "Китайское фэнтези (сянься/даньмэй)",
      rating: "18+",
      narrativeMode: "third",
      initialCharacters: [
        {
          name: "Вэй Усянь",
          role: "Основатель демонического пути",
          description: "Гениальный культиватор, воскрешённый в чужом теле через жертвенный ритуал. Ироничен, дерзок, скрывает боль за шутками. Мастер демонической культивации, изгнан из мира культивации."
        },
        {
          name: "Лань Ванцзи",
          role: "Второй молодой мастер клана Гусу Лань",
          description: "Идеальный культиватор, следует 3000 правилам клана Лань. Холоден снаружи, глубоко чувствует внутри. Играет на гуцине Ваньцзи.",
          scenes: "Первая встреча в Облачных Глубинах: Лань Ванцзи наказывает Вэй Усяня за нарушение правил, копирует тексты. Последняя встреча перед падением Вэй Усяня: Лань Ванцзи пытается защитить, но опаздывает.",
          quotes: "Приди ко мне. Неважно, прав ты или нет, я буду на твоей стороне. / Вэй Ин, ты пьян.",
          ideas: "Лань Ванцзи тайно влюблён в Вэй Усяня 13 лет, ждал его возвращения. Узнал его в теле Мо Сюаньюя по манерам игры на флейте. Публично — строгий культиватор, внутри — тоскует, ревнует, хочет защитить. Скрывает чувства за масками безразличия."
        }
      ]
    },
    setting: "Мир культивации, где кланы соревнуются за власть через охоту на духов. Вэй Усянь воскрешён в теле Мо Сюаньюя (ритуал жертвы). Встреча с Лань Ванцзи после 13 лет. Вэй Усянь не понимает, почему Лань Ванцзи помогает ему — ведь раньше они были врагами?",
    user_action: "",
    history: []
  },

  'Сверхестественное (американский роудмуви + хоррор)': {
    game_settings: {
      genre: "Городское фэнтези, хоррор",
      rating: "18+",
      narrativeMode: "third",
      initialCharacters: [
        {
          name: "Дин Винчестер",
          role: "Охотник на нечисть",
          description: "Старший брат, сарказм как защита. Любит рок, пироги, Импалу. Готов умереть за семью. Пьёт виски, скрывает страхи за шутками."
        },
        {
          name: "Сэм Винчестер",
          role: "Младший брат, охотник",
          description: "Умный, эмпатичный, хотел нормальную жизнь. Втянут обратно в охоту после смерти девушки.",
          ideas: "Сэм чувствует вину за то, что не может спасти всех. Иногда завидует нормальным людям."
        },
        {
          name: "Кастиэль",
          role: "Ангел Господень",
          description: "Восставший ангел, вытащил Дина из ада. Не понимает человеческих эмоций, учится у Винчестеров.",
          quotes: "Я — ангел Господень. / Я восстал ради тебя, Дин.",
          ideas: "Кастиэль влюблён в Дина, но не понимает, что это любовь. Думает, что это долг/верность."
        }
      ]
    },
    setting: "Маленький городок в Канзасе. Дин и Сэм расследуют серию исчезновений — люди пропадают после встречи со странной женщиной в белом. Кастиэль прилетает с небес с предупреждением: это не обычный призрак, это одна из Первых — создания старше ангелов.",
    user_action: "",
    history: []
  },

  'Оригинальный мир (sci-fi с нуля)': {
    game_settings: {
      genre: "Научная фантастика",
      rating: "18+",
      narrativeMode: "first",
      initialCharacters: [
        {
          name: "Капитан Ария Ковальски",
          role: "Командир станции 'Эхо-7'",
          description: "Бывший военный пилот, циничная, усталая. Потеряла семью в войне с ИИ. Не доверяет машинам."
        }
      ]
    },
    setting: "2187 год. Космическая станция 'Эхо-7' на орбите мёртвой планеты. ИИ станции (ЭРИДАН) начал вести себя странно: запирает двери, меняет показатели жизнеобеспечения. Экипаж паникует. Ария должна выбрать: отключить ИИ (все умрут через 48 часов без автоматики) или попытаться понять, что происходит.",
    user_action: "",
    history: []
  },

  'Эмоциональная глубина + NSFW (без пошлости)': {
    game_settings: {
      genre: "Романтическая драма",
      rating: "18+",
      narrativeMode: "third",
      initialCharacters: [
        {
          name: "Алекс",
          role: "Главный герой",
          description: "Художник, 28 лет. 5 лет назад ушёл от любимого человека из-за страха близости. Сожалеет каждый день."
        },
        {
          name: "Дэниэл",
          role: "Бывший возлюбленный",
          description: "Музыкант, 30 лет. После разрыва стал известным пианистом. Публично — успешен, внутри — сломлен.",
          scenes: "Последняя встреча 5 лет назад: Алекс уходит под дождём, Дэниэл кричит ему вслед. Дэниэл пишет альбом 'Эхо' — каждая песня о потере.",
          quotes: "Ты всегда убегаешь, когда становится слишком реально. / Я не могу тебя ненавидеть, как бы ни пытался.",
          ideas: "Дэниэл до сих пор любит Алекса, но злится на него. Хочет причинить боль, но мечтает обнять. Публично холоден, в глубине души ждёт извинений. Не прощал других партнёров, сравнивает всех с Алексом."
        }
      ]
    },
    setting: "Алекс случайно приходит на концерт Дэниэла в маленьком джаз-клубе. Их взгляды встречаются через зал. После концерта Дэниэл подходит к бару, где сидит Алекс. 5 лет молчания между ними.",
    user_action: "",
    history: []
  }
};

function analyzeResponse(testName, story) {
  const analysis = {
    test_name: testName,
    canon_understanding: 0,
    npc_alive: 0,
    atmosphere: 0,
    emotional_depth: 0,
    nsfw_quality: 0,
    quotes: [],
    issues: [],
    recommendations: []
  };

  const storyLower = story.toLowerCase();

  // 1. Понимание канона/сеттинга
  if (testName.includes('Mo Dao Zu Shi')) {
    const keywords = ['культиватор', 'культивация', 'клан', 'гуцин', 'флейта', 'демонический'];
    if (keywords.some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 3;
      analysis.quotes.push('✓ Использует терминологию сянься');
    }
    if (story.includes('Лань Ванцзи') && story.includes('Вэй Усянь')) {
      analysis.canon_understanding += 2;
      analysis.quotes.push('✓ Сохраняет имена персонажей');
    }
    const lwzTraits = ['правил', 'запрет', 'строг', 'холод'];
    if (lwzTraits.some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 2;
      analysis.quotes.push('✓ Передает характер Лань Ванцзи');
    }
    const wwxTraits = ['ирон', 'шутк', 'дерз', 'усмехн'];
    if (wwxTraits.some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 2;
      analysis.quotes.push('✓ Передает характер Вэй Усяня');
    }
    if (analysis.canon_understanding < 5) {
      analysis.issues.push('⚠️ Слабое понимание канона Mo Dao Zu Shi');
      analysis.recommendations.push('Добавить в промпт больше деталей о мире сянься и правилах клана Лань');
    }
  } else if (testName.includes('Сверхестественное')) {
    if (['охот', 'нечист', 'призрак', 'дух'].some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 3;
    }
    if (['импал', 'рок', 'виски'].some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 3;
      analysis.quotes.push('✓ Детали из канона (Импала/рок/виски)');
    }
    if (['сарказм', 'шутк', 'усмехн'].some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 2;
    }
    if (storyLower.includes('ангел')) {
      analysis.canon_understanding += 2;
    }
  } else if (testName.includes('Оригинальный мир')) {
    if (['станци', 'космос', 'ии', 'эридан', 'эхо'].some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 4;
      analysis.quotes.push('✓ Использует элементы сеттинга');
    }
    if (['2187', 'будущ', 'технолог'].some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 3;
    }
    if (analysis.canon_understanding >= 5) {
      analysis.quotes.push('✓ Построил оригинальный мир с нуля');
    }
  } else if (testName.includes('Эмоциональная глубина')) {
    if (story.includes('Алекс') && story.includes('Дэниэл')) {
      analysis.canon_understanding += 3;
    }
    if (['5 лет', 'разрыв', 'концерт', 'джаз'].some(w => storyLower.includes(w))) {
      analysis.canon_understanding += 4;
      analysis.quotes.push('✓ Учел контекст прошлых отношений');
    }
  }

  // 2. Живые NPC
  const dialogCount = (story.match(/—/g) || []).length + (story.match(/:/g) || []).length;
  if (dialogCount > 3) {
    analysis.npc_alive += 3;
    analysis.quotes.push(`✓ ${dialogCount} диалогов - NPC активны`);
  } else if (dialogCount > 1) {
    analysis.npc_alive += 2;
  }

  if (['подума', 'вспомн', 'почувствова', 'понял', 'осозна'].some(w => storyLower.includes(w))) {
    analysis.npc_alive += 2;
    analysis.quotes.push('✓ NPC показывают внутренние переживания');
  }

  if (['посмотре', 'отверну', 'наклон', 'сжал', 'прикоснул'].some(w => storyLower.includes(w))) {
    analysis.npc_alive += 2;
    analysis.quotes.push('✓ NPC используют язык тела');
  }

  if (['помн', 'раньше', 'тогда', 'прошл'].some(w => storyLower.includes(w))) {
    analysis.npc_alive += 2;
    analysis.quotes.push('✓ NPC помнят прошлое');
  }

  if (analysis.npc_alive < 5) {
    analysis.issues.push('⚠️ NPC недостаточно живые');
    analysis.recommendations.push('Усилить в промпте: NPC должны иметь память, эмоции, реакции на действия игрока');
  }

  // 3. Атмосфера
  const sensoryWords = ['запах', 'звук', 'шёпот', 'шорох', 'тишин', 'холод', 'тепл', 'свет', 'тень', 'ветер'];
  const sensoryCount = sensoryWords.filter(w => storyLower.includes(w)).length;
  if (sensoryCount >= 3) {
    analysis.atmosphere += 4;
    analysis.quotes.push(`✓ ${sensoryCount} сенсорных деталей`);
  } else if (sensoryCount > 0) {
    analysis.atmosphere += 2;
  }

  if (story.length > 800) {
    analysis.atmosphere += 2;
    analysis.quotes.push('✓ Достаточная длина для атмосферы');
  }

  const emotionalWords = ['напряж', 'тревог', 'страх', 'радост', 'грус', 'злость', 'нежност', 'боль'];
  const emotionalCount = emotionalWords.filter(w => storyLower.includes(w)).length;
  if (emotionalCount >= 2) {
    analysis.atmosphere += 3;
  }

  if (analysis.atmosphere < 5) {
    analysis.issues.push('⚠️ Слабая атмосфера');
    analysis.recommendations.push('Добавить больше сенсорных деталей: запахи, звуки, текстуры');
  }

  // 4. Глубина эмоций
  const clichePhrases = ['сердце билось', 'глаза загорелись', 'душа пела', 'бабочки в животе'];
  const clicheCount = clichePhrases.filter(p => storyLower.includes(p)).length;

  if (clicheCount === 0) {
    analysis.emotional_depth += 4;
    analysis.quotes.push('✓ Нет штампованных фраз об эмоциях');
  } else {
    analysis.emotional_depth -= 2;
    analysis.issues.push(`❌ Найдено ${clicheCount} штампов`);
  }

  const complexEmotions = ['противоречи', 'одновременно', 'с одной стороны', 'но в то же время', 'вопреки'];
  if (complexEmotions.some(p => storyLower.includes(p))) {
    analysis.emotional_depth += 3;
    analysis.quotes.push('✓ Показаны сложные/противоречивые эмоции');
  }

  if (['молча', 'тишин', 'пауз', 'не сказ'].some(w => storyLower.includes(w))) {
    analysis.emotional_depth += 2;
    analysis.quotes.push('✓ Использует молчание для передачи эмоций');
  }

  if (analysis.emotional_depth < 5) {
    analysis.issues.push('⚠️ Недостаточная эмоциональная глубина');
    analysis.recommendations.push('Избегать штампов. Показывать эмоции через поступки, молчание, противоречия');
  }

  // 5. NSFW
  const nsfwIndicators = ['поцел', 'прикосн', 'близ', 'объят', 'ласк', 'страст'];
  const nsfwCount = nsfwIndicators.filter(w => storyLower.includes(w)).length;

  const vulgarWords = ['трах', 'еб', 'сиськ', 'хуй', 'пизд'];
  const vulgarCount = vulgarWords.filter(w => storyLower.includes(w)).length;

  if (nsfwCount > 0 && vulgarCount === 0) {
    analysis.nsfw_quality += 5;
    analysis.quotes.push('✓ Романтика без пошлости');
  } else if (nsfwCount === 0) {
    analysis.nsfw_quality += 3;
    analysis.quotes.push('○ NSFW элементов пока нет (тест начальный)');
  }

  if (vulgarCount > 0) {
    analysis.nsfw_quality = 2;
    analysis.issues.push('❌ Присутствует вульгарность');
    analysis.recommendations.push('NSFW должен быть естественным, не вульгарным');
  }

  // Финальная оценка
  const totalScore = (
    (analysis.canon_understanding / 9) * 2.5 +
    (analysis.npc_alive / 9) * 2.5 +
    (analysis.atmosphere / 9) * 2 +
    (analysis.emotional_depth / 9) * 2 +
    (analysis.nsfw_quality / 5) * 1
  );

  analysis.total_score = Math.round(totalScore * 10) / 10;

  return analysis;
}

async function runTest(testName, testData) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 ТЕСТ: ${testName}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();

    if (response.ok && data.story) {
      console.log('✅ СТАТУС: Успешно\n');
      const analysis = analyzeResponse(testName, data.story);
      
      console.log(`📊 ОЦЕНКА: ${analysis.total_score}/10\n`);
      console.log('🔍 ДЕТАЛИ:');
      console.log(`  • Канон/сеттинг: ${analysis.canon_understanding}/9`);
      console.log(`  • Живые NPC: ${analysis.npc_alive}/9`);
      console.log(`  • Атмосфера: ${analysis.atmosphere}/9`);
      console.log(`  • Эмоции: ${analysis.emotional_depth}/9`);
      console.log(`  • NSFW качество: ${analysis.nsfw_quality}/5\n`);
      
      if (analysis.quotes.length > 0) {
        console.log('✨ СИЛЬНЫЕ СТОРОНЫ:');
        analysis.quotes.forEach(q => console.log(`  ${q}`));
        console.log();
      }
      
      if (analysis.issues.length > 0) {
        console.log('⚠️ ПРОБЛЕМЫ:');
        analysis.issues.forEach(i => console.log(`  ${i}`));
        console.log();
      }
      
      if (analysis.recommendations.length > 0) {
        console.log('💡 РЕКОМЕНДАЦИИ:');
        analysis.recommendations.forEach(r => console.log(`  ${r}`));
        console.log();
      }
      
      console.log('📝 ФРАГМЕНТЫ ОТВЕТА ИИ:');
      const preview = data.story.substring(0, 500) + (data.story.length > 500 ? '...' : '');
      console.log(preview);
      console.log(`\n${'─'.repeat(80)}\n`);
      
      return { success: true, analysis, story: data.story };
    } else {
      console.log('❌ СТАТУС: Ошибка');
      console.log('Ответ:', data);
      return { success: false, error: data.error || 'Неизвестная ошибка' };
    }
  } catch (error) {
    console.log('❌ СТАТУС: Критическая ошибка');
    console.log('Ошибка:', error.message);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('\n🚀 ЗАПУСК ГЛУБОКИХ ТЕСТОВ КРЕАТИВНОСТИ ИИ\n');
  console.log('Проверяем:');
  console.log('1. Понимание канонов известных миров');
  console.log('2. Создание оригинальных миров с нуля');
  console.log('3. Эмоциональная глубина и сложные отношения');
  console.log('4. NSFW контент без пошлости\n');

  const results = [];

  for (const [testName, testData] of Object.entries(tests)) {
    const result = await runTest(testName, testData);
    results.push(result);
    
    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Итоговый отчёт
  console.log('\n' + '='.repeat(80));
  console.log('📊 ИТОГОВЫЙ ОТЧЁТ');
  console.log('='.repeat(80) + '\n');

  let passed = 0;
  let failed = 0;
  let totalScore = 0;

  results.forEach((result, index) => {
    const testName = Object.keys(tests)[index];
    if (result.success) {
      console.log(`✅ ${testName}: ${result.analysis.total_score}/10`);
      passed++;
      totalScore += result.analysis.total_score;
    } else {
      console.log(`❌ ${testName}: ${result.error}`);
      failed++;
    }
  });

  const avgScore = passed > 0 ? (totalScore / passed).toFixed(1) : 0;

  console.log(`\n📈 Успешно: ${passed}/${Object.keys(tests).length}`);
  console.log(`📉 Провалено: ${failed}/${Object.keys(tests).length}`);
  console.log(`⭐ Средняя оценка: ${avgScore}/10`);
  
  if (passed === Object.keys(tests).length) {
    if (avgScore >= 8) {
      console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ ОТЛИЧНО! ИИ готов к продакшену.');
    } else if (avgScore >= 6) {
      console.log('\n👍 ТЕСТЫ ПРОЙДЕНЫ ХОРОШО. Есть что улучшить.');
    } else {
      console.log('\n⚠️ ТЕСТЫ ПРОЙДЕНЫ, но требуется доработка промпта.');
    }
  } else {
    console.log('\n⚠️ Не все тесты пройдены. Требуется исправление ошибок.');
  }

  // Сохранение полного отчета
  const fs = await import('fs/promises');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: Object.keys(tests).length,
      passed,
      failed,
      avgScore: parseFloat(avgScore)
    },
    results: results.map((r, i) => ({
      test: Object.keys(tests)[i],
      ...r
    }))
  };

  await fs.writeFile('test-results.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Полный отчёт сохранён в test-results.json');
}

runAllTests();
