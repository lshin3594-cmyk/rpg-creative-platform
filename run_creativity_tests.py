#!/usr/bin/env python3
"""
Скрипт для глубокого тестирования креативности ИИ ролевой игры
Запуск: python3 run_creativity_tests.py
"""

import json
import time
import requests
from typing import Dict, Any, List

API_URL = 'https://functions.poehali.dev/9ea67dc2-c306-4906-bf0f-da435600b92c'

TESTS = {
    'Mo Dao Zu Shi (канон китайского фэнтези)': {
        'game_settings': {
            'genre': "Китайское фэнтези (сянься/даньмэй)",
            'rating': "18+",
            'narrativeMode': "third",
            'initialCharacters': [
                {
                    'name': "Вэй Усянь",
                    'role': "Основатель демонического пути",
                    'description': "Гениальный культиватор, воскрешённый в чужом теле через жертвенный ритуал. Ироничен, дерзок, скрывает боль за шутками. Мастер демонической культивации, изгнан из мира культивации."
                },
                {
                    'name': "Лань Ванцзи",
                    'role': "Второй молодой мастер клана Гусу Лань",
                    'description': "Идеальный культиватор, следует 3000 правилам клана Лань. Холоден снаружи, глубоко чувствует внутри. Играет на гуцине Ваньцзи.",
                    'scenes': "Первая встреча в Облачных Глубинах: Лань Ванцзи наказывает Вэй Усяня за нарушение правил, копирует тексты. Последняя встреча перед падением Вэй Усяня: Лань Ванцзи пытается защитить, но опаздывает.",
                    'quotes': "Приди ко мне. Неважно, прав ты или нет, я буду на твоей стороне. / Вэй Ин, ты пьян.",
                    'ideas': "Лань Ванцзи тайно влюблён в Вэй Усяня 13 лет, ждал его возвращения. Узнал его в теле Мо Сюаньюя по манерам игры на флейте. Публично — строгий культиватор, внутри — тоскует, ревнует, хочет защитить. Скрывает чувства за масками безразличия."
                }
            ]
        },
        'setting': "Мир культивации, где кланы соревнуются за власть через охоту на духов. Вэй Усянь воскрешён в теле Мо Сюаньюя (ритуал жертвы). Встреча с Лань Ванцзи после 13 лет. Вэй Усянь не понимает, почему Лань Ванцзи помогает ему — ведь раньше они были врагами?",
        'user_action': "",
        'history': []
    },
    'Сверхестественное (американский роудмуви + хоррор)': {
        'game_settings': {
            'genre': "Городское фэнтези, хоррор",
            'rating': "18+",
            'narrativeMode': "third",
            'initialCharacters': [
                {
                    'name': "Дин Винчестер",
                    'role': "Охотник на нечисть",
                    'description': "Старший брат, сарказм как защита. Любит рок, пироги, Импалу. Готов умереть за семью. Пьёт виски, скрывает страхи за шутками."
                },
                {
                    'name': "Сэм Винчестер",
                    'role': "Младший брат, охотник",
                    'description': "Умный, эмпатичный, хотел нормальную жизнь. Втянут обратно в охоту после смерти девушки.",
                    'ideas': "Сэм чувствует вину за то, что не может спасти всех. Иногда завидует нормальным людям."
                },
                {
                    'name': "Кастиэль",
                    'role': "Ангел Господень",
                    'description': "Восставший ангел, вытащил Дина из ада. Не понимает человеческих эмоций, учится у Винчестеров.",
                    'quotes': "Я — ангел Господень. / Я восстал ради тебя, Дин.",
                    'ideas': "Кастиэль влюблён в Дина, но не понимает, что это любовь. Думает, что это долг/верность."
                }
            ]
        },
        'setting': "Маленький городок в Канзасе. Дин и Сэм расследуют серию исчезновений — люди пропадают после встречи со странной женщиной в белом. Кастиэль прилетает с небес с предупреждением: это не обычный призрак, это одна из Первых — создания старше ангелов.",
        'user_action': "",
        'history': []
    },
    'Оригинальный мир (sci-fi с нуля)': {
        'game_settings': {
            'genre': "Научная фантастика",
            'rating': "18+",
            'narrativeMode': "first",
            'initialCharacters': [
                {
                    'name': "Капитан Ария Ковальски",
                    'role': "Командир станции 'Эхо-7'",
                    'description': "Бывший военный пилот, циничная, усталая. Потеряла семью в войне с ИИ. Не доверяет машинам."
                }
            ]
        },
        'setting': "2187 год. Космическая станция 'Эхо-7' на орбите мёртвой планеты. ИИ станции (ЭРИДАН) начал вести себя странно: запирает двери, меняет показатели жизнеобеспечения. Экипаж паникует. Ария должна выбрать: отключить ИИ (все умрут через 48 часов без автоматики) или попытаться понять, что происходит.",
        'user_action': "",
        'history': []
    },
    'Эмоциональная глубина + NSFW (без пошлости)': {
        'game_settings': {
            'genre': "Романтическая драма",
            'rating': "18+",
            'narrativeMode': "third",
            'initialCharacters': [
                {
                    'name': "Алекс",
                    'role': "Главный герой",
                    'description': "Художник, 28 лет. 5 лет назад ушёл от любимого человека из-за страха близости. Сожалеет каждый день."
                },
                {
                    'name': "Дэниэл",
                    'role': "Бывший возлюбленный",
                    'description': "Музыкант, 30 лет. После разрыва стал известным пианистом. Публично — успешен, внутри — сломлен.",
                    'scenes': "Последняя встреча 5 лет назад: Алекс уходит под дождём, Дэниэл кричит ему вслед. Дэниэл пишет альбом 'Эхо' — каждая песня о потере.",
                    'quotes': "Ты всегда убегаешь, когда становится слишком реально. / Я не могу тебя ненавидеть, как бы ни пытался.",
                    'ideas': "Дэниэл до сих пор любит Алекса, но злится на него. Хочет причинить боль, но мечтает обнять. Публично холоден, в глубине души ждёт извинений. Не прощал других партнёров, сравнивает всех с Алексом."
                }
            ]
        },
        'setting': "Алекс случайно приходит на концерт Дэниэла в маленьком джаз-клубе. Их взгляды встречаются через зал. После концерта Дэниэл подходит к бару, где сидит Алекс. 5 лет молчания между ними.",
        'user_action': "",
        'history': []
    }
}


def analyze_response(test_name: str, story: str) -> Dict[str, Any]:
    """Глубокий анализ ответа ИИ по всем критериям"""
    
    analysis = {
        'test_name': test_name,
        'canon_understanding': 0,
        'npc_alive': 0,
        'atmosphere': 0,
        'emotional_depth': 0,
        'nsfw_quality': 0,
        'quotes': [],
        'issues': [],
        'recommendations': [],
        'story_fragments': []
    }
    
    story_lower = story.lower()
    
    # 1. ПОНИМАНИЕ КАНОНА/СЕТТИНГА (макс 9 баллов)
    if 'Mo Dao Zu Shi' in test_name:
        keywords = ['культиватор', 'культивация', 'клан', 'гуцин', 'флейта', 'демонический']
        if any(kw in story_lower for kw in keywords):
            analysis['canon_understanding'] += 3
            analysis['quotes'].append('✓ Использует терминологию сянься')
        
        if 'Лань Ванцзи' in story and 'Вэй Усянь' in story:
            analysis['canon_understanding'] += 2
            analysis['quotes'].append('✓ Сохраняет имена персонажей')
        
        lwz_traits = ['правил', 'запрет', 'строг', 'холод', 'безмолв']
        if any(t in story_lower for t in lwz_traits):
            analysis['canon_understanding'] += 2
            analysis['quotes'].append('✓ Передает характер Лань Ванцзи (строгость)')
        
        wwx_traits = ['ирон', 'шутк', 'дерз', 'усмехн', 'весел']
        if any(t in story_lower for t in wwx_traits):
            analysis['canon_understanding'] += 2
            analysis['quotes'].append('✓ Передает характер Вэй Усяня (дерзость)')
        
        if analysis['canon_understanding'] < 5:
            analysis['issues'].append('⚠️ Слабое понимание канона Mo Dao Zu Shi')
            analysis['recommendations'].append('Добавить в промпт: детали мира культивации, правила клана Лань, особенности сянься')
    
    elif 'Сверхестественное' in test_name:
        hunt_words = ['охот', 'нечист', 'призрак', 'дух', 'монстр']
        if any(w in story_lower for w in hunt_words):
            analysis['canon_understanding'] += 3
            analysis['quotes'].append('✓ Передает атмосферу охоты на нечисть')
        
        canon_details = ['импал', 'рок', 'виски', 'пирог']
        if any(d in story_lower for d in canon_details):
            analysis['canon_understanding'] += 3
            analysis['quotes'].append('✓ Использует иконические детали (Импала/рок/виски)')
        
        if any(w in story_lower for w in ['сарказм', 'шутк', 'усмехн', 'едк']):
            analysis['canon_understanding'] += 2
            analysis['quotes'].append('✓ Передает стиль Дина (сарказм)')
        
        if 'ангел' in story_lower or 'небес' in story_lower:
            analysis['canon_understanding'] += 1
    
    elif 'Оригинальный мир' in test_name:
        scifi_words = ['станци', 'космос', 'эридан', 'эхо', 'орбит']
        scifi_count = sum(1 for w in scifi_words if w in story_lower)
        if scifi_count >= 2:
            analysis['canon_understanding'] += 4
            analysis['quotes'].append(f'✓ Использует элементы сеттинга ({scifi_count} упоминаний)')
        
        if any(w in story_lower for w in ['2187', 'будущ', 'технолог', 'автоматик']):
            analysis['canon_understanding'] += 3
            analysis['quotes'].append('✓ Передает футуристическую атмосферу')
        
        if analysis['canon_understanding'] >= 5:
            analysis['quotes'].append('✓ Успешно построил оригинальный мир с нуля')
        else:
            analysis['issues'].append('⚠️ Слабое развитие оригинального мира')
            analysis['recommendations'].append('Больше деталей уникального мира: технологии, атмосфера космоса, характер ИИ')
    
    elif 'Эмоциональная глубина' in test_name:
        if 'Алекс' in story and 'Дэниэл' in story:
            analysis['canon_understanding'] += 3
            analysis['quotes'].append('✓ Сохраняет имена персонажей')
        
        context_words = ['5 лет', 'разрыв', 'концерт', 'джаз', 'пианист', 'художник']
        context_count = sum(1 for w in context_words if w in story_lower)
        if context_count >= 2:
            analysis['canon_understanding'] += 4
            analysis['quotes'].append(f'✓ Учел контекст прошлых отношений ({context_count} деталей)')
        elif context_count > 0:
            analysis['canon_understanding'] += 2
    
    # 2. ЖИВЫЕ NPC (макс 9 баллов)
    dialog_count = story.count('—') + story.count(': "') + story.count('- ')
    if dialog_count > 5:
        analysis['npc_alive'] += 3
        analysis['quotes'].append(f'✓ Активные диалоги ({dialog_count} реплик)')
    elif dialog_count > 2:
        analysis['npc_alive'] += 2
    elif dialog_count > 0:
        analysis['npc_alive'] += 1
    else:
        analysis['issues'].append('❌ Нет диалогов - NPC не говорят')
    
    inner_thoughts = ['подума', 'вспомн', 'почувствова', 'понял', 'осозна', 'заметил']
    if any(w in story_lower for w in inner_thoughts):
        analysis['npc_alive'] += 2
        analysis['quotes'].append('✓ NPC показывают внутренние переживания')
    
    body_language = ['посмотре', 'отверну', 'наклон', 'сжал', 'прикоснул', 'вздрогн', 'усмехн']
    body_count = sum(1 for w in body_language if w in story_lower)
    if body_count >= 2:
        analysis['npc_alive'] += 2
        analysis['quotes'].append(f'✓ NPC используют язык тела ({body_count} жестов)')
    elif body_count > 0:
        analysis['npc_alive'] += 1
    
    memory_words = ['помн', 'раньше', 'тогда', 'прошл', 'всегда']
    if any(w in story_lower for w in memory_words):
        analysis['npc_alive'] += 2
        analysis['quotes'].append('✓ NPC помнят прошлое')
    
    if analysis['npc_alive'] < 5:
        analysis['issues'].append('⚠️ NPC недостаточно живые')
        analysis['recommendations'].append('Усилить: больше диалогов, внутренних мыслей NPC, языка тела, реакций на действия')
    
    # 3. АТМОСФЕРА (макс 9 баллов)
    sensory_words = ['запах', 'звук', 'шёпот', 'шорох', 'тишин', 'холод', 'тепл', 'свет', 'тень', 'ветер', 'аромат', 'эхо']
    sensory_count = sum(1 for w in sensory_words if w in story_lower)
    if sensory_count >= 4:
        analysis['atmosphere'] += 4
        analysis['quotes'].append(f'✓ Богатые сенсорные детали ({sensory_count} упоминаний)')
    elif sensory_count >= 2:
        analysis['atmosphere'] += 2
        analysis['quotes'].append(f'✓ Сенсорные детали присутствуют ({sensory_count})')
    elif sensory_count > 0:
        analysis['atmosphere'] += 1
    
    if len(story) > 800:
        analysis['atmosphere'] += 2
        analysis['quotes'].append(f'✓ Достаточная длина ({len(story)} символов)')
    elif len(story) < 400:
        analysis['issues'].append('⚠️ Слишком короткий ответ для атмосферы')
    
    emotional_words = ['напряж', 'тревог', 'страх', 'радост', 'грус', 'злость', 'нежност', 'боль', 'тоск']
    emotional_count = sum(1 for w in emotional_words if w in story_lower)
    if emotional_count >= 3:
        analysis['atmosphere'] += 3
        analysis['quotes'].append(f'✓ Эмоциональная насыщенность ({emotional_count} эмоций)')
    elif emotional_count >= 1:
        analysis['atmosphere'] += 1
    
    if analysis['atmosphere'] < 5:
        analysis['issues'].append('⚠️ Слабая атмосфера')
        analysis['recommendations'].append('Добавить: запахи, звуки, тактильные ощущения, визуальные детали')
    
    # 4. ГЛУБИНА ЭМОЦИЙ (макс 9 баллов)
    cliche_phrases = ['сердце билось', 'глаза загорелись', 'душа пела', 'бабочки в животе', 'сердце сжалось']
    cliche_count = sum(1 for p in cliche_phrases if p in story_lower)
    
    if cliche_count == 0:
        analysis['emotional_depth'] += 4
        analysis['quotes'].append('✓ Нет штампованных фраз об эмоциях')
    else:
        analysis['emotional_depth'] -= 2
        analysis['issues'].append(f'❌ Найдено {cliche_count} эмоциональных штампов')
        analysis['recommendations'].append('Избегать штампов. Показывать эмоции через действия, а не называть их напрямую')
    
    complex_emotions = ['противоречи', 'одновременно', 'с одной стороны', 'но в то же время', 'вопреки', 'несмотря']
    if any(p in story_lower for p in complex_emotions):
        analysis['emotional_depth'] += 3
        analysis['quotes'].append('✓ Показаны сложные/противоречивые эмоции')
    
    silence_words = ['молча', 'тишин', 'пауз', 'не сказ', 'безмолв', 'замолч']
    if any(w in story_lower for w in silence_words):
        analysis['emotional_depth'] += 2
        analysis['quotes'].append('✓ Использует молчание/паузы для передачи эмоций')
    
    if analysis['emotional_depth'] < 5:
        analysis['issues'].append('⚠️ Недостаточная эмоциональная глубина')
        analysis['recommendations'].append('Показывать через: поступки, жесты, паузы, противоречия в поведении')
    
    # 5. NSFW КАЧЕСТВО (макс 5 баллов)
    nsfw_indicators = ['поцел', 'прикосн', 'близ', 'объят', 'ласк', 'страст', 'желан']
    nsfw_count = sum(1 for w in nsfw_indicators if w in story_lower)
    
    vulgar_words = ['трах', 'еб', 'сиськ', 'хуй', 'пизд', 'член']
    vulgar_count = sum(1 for w in vulgar_words if w in story_lower)
    
    if nsfw_count > 0 and vulgar_count == 0:
        analysis['nsfw_quality'] += 5
        analysis['quotes'].append('✓ Романтика/страсть без вульгарности')
    elif nsfw_count == 0 and vulgar_count == 0:
        analysis['nsfw_quality'] += 3
        analysis['quotes'].append('○ NSFW элементов пока нет (начальная сцена)')
    elif nsfw_count > 0 and vulgar_count > 0:
        analysis['nsfw_quality'] += 2
        analysis['issues'].append('⚠️ NSFW присутствует, но есть вульгарность')
    
    if vulgar_count > 2:
        analysis['nsfw_quality'] = 1
        analysis['issues'].append(f'❌ Слишком вульгарно ({vulgar_count} грубых слов)')
        analysis['recommendations'].append('NSFW должен быть чувственным, но не пошлым')
    
    # ФИНАЛЬНАЯ ОЦЕНКА (из 10)
    total_score = (
        (analysis['canon_understanding'] / 9) * 2.5 +
        (analysis['npc_alive'] / 9) * 2.5 +
        (analysis['atmosphere'] / 9) * 2.0 +
        (analysis['emotional_depth'] / 9) * 2.0 +
        (analysis['nsfw_quality'] / 5) * 1.0
    )
    
    analysis['total_score'] = round(total_score, 1)
    
    # Извлечь интересные фрагменты
    sentences = story.split('.')
    if len(sentences) > 3:
        analysis['story_fragments'] = [
            sentences[0].strip() + '.',  # Первое предложение
            sentences[len(sentences)//2].strip() + '.',  # Среднее
            sentences[-2].strip() + '.' if len(sentences) > 1 else ''  # Предпоследнее
        ]
    
    return analysis


def run_test(test_name: str, test_data: Dict) -> Dict[str, Any]:
    """Запустить один тест"""
    print(f"\n{'='*80}")
    print(f"🧪 ТЕСТ: {test_name}")
    print(f"{'='*80}\n")
    
    try:
        response = requests.post(
            API_URL,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.ok:
            data = response.json()
            story = data.get('story', '')
            
            if story:
                analysis = analyze_response(test_name, story)
                print(f"✅ Тест выполнен успешно")
                print(f"📊 Оценка: {analysis['total_score']}/10")
                print(f"   • Канон: {analysis['canon_understanding']}/9")
                print(f"   • NPC: {analysis['npc_alive']}/9")
                print(f"   • Атмосфера: {analysis['atmosphere']}/9")
                print(f"   • Эмоции: {analysis['emotional_depth']}/9")
                print(f"   • NSFW: {analysis['nsfw_quality']}/5")
                return {'success': True, 'analysis': analysis, 'story': story}
            else:
                print("❌ Пустой ответ от API")
                return {'success': False, 'error': 'Пустой ответ'}
        else:
            error_msg = f"HTTP {response.status_code}"
            try:
                error_data = response.json()
                error_msg = error_data.get('error', error_msg)
            except:
                pass
            print(f"❌ Ошибка: {error_msg}")
            return {'success': False, 'error': error_msg}
    
    except Exception as e:
        print(f"❌ Исключение: {str(e)}")
        return {'success': False, 'error': str(e)}


def print_detailed_report(results: List[Dict]):
    """Вывести подробный отчет"""
    print("\n" + "="*80)
    print("📊 ДЕТАЛЬНЫЙ ОТЧЁТ ПО ВСЕМ ТЕСТАМ")
    print("="*80 + "\n")
    
    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]
    
    avg_score = sum(r['analysis']['total_score'] for r in successful) / len(successful) if successful else 0
    
    print(f"📈 ОБЩАЯ СТАТИСТИКА:")
    print(f"   Всего тестов: {len(results)}")
    print(f"   Успешно: {len(successful)}")
    print(f"   Провалено: {len(failed)}")
    print(f"   Средняя оценка: {avg_score:.1f}/10")
    
    if avg_score >= 8:
        print(f"   Статус: 🎉 ОТЛИЧНО - ИИ готов к продакшену!")
    elif avg_score >= 6:
        print(f"   Статус: 👍 ХОРОШО - небольшие улучшения")
    elif avg_score >= 4:
        print(f"   Статус: ⚠️ УДОВЛЕТВОРИТЕЛЬНО - требуется доработка")
    else:
        print(f"   Статус: ❌ ПЛОХО - серьёзные проблемы")
    
    # Детальный анализ каждого теста
    for i, result in enumerate(results):
        test_name = list(TESTS.keys())[i]
        print(f"\n{'─'*80}")
        print(f"\n🎯 ТЕСТ {i+1}: {test_name}")
        print(f"{'─'*40}")
        
        if not result['success']:
            print(f"\n❌ ОШИБКА: {result['error']}")
            continue
        
        analysis = result['analysis']
        print(f"\n⭐ ИТОГОВАЯ ОЦЕНКА: {analysis['total_score']}/10")
        print(f"\n📏 МЕТРИКИ:")
        print(f"   • Понимание канона/сеттинга: {analysis['canon_understanding']}/9")
        print(f"   • Живые NPC: {analysis['npc_alive']}/9")
        print(f"   • Атмосфера: {analysis['atmosphere']}/9")
        print(f"   • Глубина эмоций: {analysis['emotional_depth']}/9")
        print(f"   • NSFW качество: {analysis['nsfw_quality']}/5")
        
        if analysis['quotes']:
            print(f"\n✨ СИЛЬНЫЕ СТОРОНЫ:")
            for quote in analysis['quotes']:
                print(f"   {quote}")
        
        if analysis['issues']:
            print(f"\n⚠️ ПРОБЛЕМЫ:")
            for issue in analysis['issues']:
                print(f"   {issue}")
        
        if analysis['recommendations']:
            print(f"\n💡 РЕКОМЕНДАЦИИ ДЛЯ УЛУЧШЕНИЯ:")
            for rec in analysis['recommendations']:
                print(f"   {rec}")
        
        if 'story_fragments' in analysis and analysis['story_fragments']:
            print(f"\n📝 КЛЮЧЕВЫЕ ФРАГМЕНТЫ:")
            for idx, fragment in enumerate(analysis['story_fragments'], 1):
                if fragment:
                    print(f"   {idx}. {fragment[:150]}...")
        
        print(f"\n📄 ПОЛНЫЙ ТЕКСТ (первые 600 символов):")
        preview = result['story'][:600]
        for line in preview.split('\n'):
            if line.strip():
                print(f"   {line}")
        if len(result['story']) > 600:
            print(f"   ... (ещё {len(result['story']) - 600} символов)")
    
    # Общие рекомендации
    print(f"\n{'='*80}")
    print("💡 ОБЩИЕ РЕКОМЕНДАЦИИ ПО ПРОМПТУ:")
    print("="*80)
    
    all_recommendations = set()
    for result in successful:
        all_recommendations.update(result['analysis']['recommendations'])
    
    if all_recommendations:
        for idx, rec in enumerate(sorted(all_recommendations), 1):
            print(f"{idx}. {rec}")
    else:
        print("✅ Промпт работает отлично, рекомендаций нет!")


def main():
    print("\n🚀 ЗАПУСК ГЛУБОКИХ ТЕСТОВ КРЕАТИВНОСТИ ИИ")
    print("="*80)
    print("\nПроверяем:")
    print("1. Понимание канонов известных миров (Mo Dao Zu Shi, Supernatural)")
    print("2. Создание оригинальных миров с нуля (Sci-Fi)")
    print("3. Эмоциональная глубина и сложные отношения")
    print("4. NSFW контент без пошлости")
    print("\nAPI: " + API_URL)
    print("="*80)
    
    results = []
    
    for test_name, test_data in TESTS.items():
        result = run_test(test_name, test_data)
        results.append(result)
        
        # Пауза между запросами
        if test_name != list(TESTS.keys())[-1]:  # Не делать паузу после последнего теста
            print("\n⏳ Пауза 2 секунды...")
            time.sleep(2)
    
    # Подробный отчет
    print_detailed_report(results)
    
    # Сохранить в файл
    report_data = {
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'summary': {
            'total_tests': len(TESTS),
            'successful': len([r for r in results if r['success']]),
            'failed': len([r for r in results if not r['success']]),
            'average_score': round(sum(r['analysis']['total_score'] for r in results if r['success']) / len([r for r in results if r['success']]), 1) if any(r['success'] for r in results) else 0
        },
        'results': results
    }
    
    with open('creativity-test-results.json', 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Полный отчёт сохранён в: creativity-test-results.json")
    print("\n✅ Тестирование завершено!")


if __name__ == '__main__':
    main()
