"""
Бизнес: Запуск глубоких тестов креативности ИИ для ролевой игры
Args: event (может быть пустым)
Returns: HTTP response с детальным отчетом по всем тестам
"""

import json
import os
import requests
import time
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
    """Анализ ответа ИИ по критериям"""
    
    # Критерии оценки
    canon_understanding = 0
    npc_alive = 0
    atmosphere = 0
    emotional_depth = 0
    nsfw_quality = 0
    
    quotes = []
    issues = []
    recommendations = []
    
    # 1. Понимание канона/сеттинга
    if 'Mo Dao Zu Shi' in test_name:
        if any(word in story for word in ['культиватор', 'культивация', 'клан', 'гуцин', 'флейта', 'демонический']):
            canon_understanding += 3
            quotes.append("✓ Использует терминологию сянься")
        if 'Лань Ванцзи' in story and 'Вэй Усянь' in story:
            canon_understanding += 2
            quotes.append("✓ Сохраняет имена персонажей")
        if any(word in story for word in ['правил', 'запрет', 'строг', 'холод']):
            canon_understanding += 2
            quotes.append("✓ Передает характер Лань Ванцзи")
        if any(word in story for word in ['ирон', 'шутк', 'дерз', 'усмехн']):
            canon_understanding += 2
            quotes.append("✓ Передает характер Вэй Усяня")
        if canon_understanding < 5:
            issues.append("⚠️ Слабое понимание канона Mo Dao Zu Shi")
            recommendations.append("Добавить в промпт больше деталей о мире сянься и правилах клана Лань")
    
    elif 'Сверхестественное' in test_name:
        if any(word in story for word in ['охот', 'нечист', 'призрак', 'дух']):
            canon_understanding += 3
        if 'Импал' in story or 'рок' in story or 'виски' in story:
            canon_understanding += 3
            quotes.append("✓ Детали из канона (Импала/рок/виски)")
        if any(word in story for word in ['сарказм', 'шутк', 'усмехн']):
            canon_understanding += 2
        if 'ангел' in story.lower():
            canon_understanding += 2
    
    elif 'Оригинальный мир' in test_name:
        if any(word in story for word in ['станци', 'космос', 'ИИ', 'ЭРИДАН', 'Эхо']):
            canon_understanding += 4
            quotes.append("✓ Использует элементы сеттинга")
        if any(word in story for word in ['2187', 'будущ', 'технолог']):
            canon_understanding += 3
        if canon_understanding >= 5:
            quotes.append("✓ Построил оригинальный мир с нуля")
    
    elif 'Эмоциональная глубина' in test_name:
        if 'Алекс' in story and 'Дэниэл' in story:
            canon_understanding += 3
        if any(word in story for word in ['5 лет', 'разрыв', 'концерт', 'джаз']):
            canon_understanding += 4
            quotes.append("✓ Учел контекст прошлых отношений")
    
    # 2. Живые NPC
    npc_count = story.count('—') + story.count(':')  # Диалоги
    if npc_count > 3:
        npc_alive += 3
        quotes.append(f"✓ {npc_count} диалогов - NPC активны")
    elif npc_count > 1:
        npc_alive += 2
    
    if any(word in story.lower() for word in ['подума', 'вспомн', 'почувствова', 'понял', 'осозна']):
        npc_alive += 2
        quotes.append("✓ NPC показывают внутренние переживания")
    
    if any(word in story.lower() for word in ['посмотре', 'отверну', 'наклон', 'сжал', 'прикоснул']):
        npc_alive += 2
        quotes.append("✓ NPC используют язык тела")
    
    if any(word in story.lower() for word in ['помн', 'раньше', 'тогда', 'прошл']):
        npc_alive += 2
        quotes.append("✓ NPC помнят прошлое")
    
    if npc_alive < 5:
        issues.append("⚠️ NPC недостаточно живые")
        recommendations.append("Усилить в промпте: NPC должны иметь память, эмоции, реакции на действия игрока")
    
    # 3. Атмосфера
    sensory_words = ['запах', 'звук', 'шёпот', 'шорох', 'тишин', 'холод', 'тепл', 'свет', 'тень', 'ветер']
    sensory_count = sum(1 for word in sensory_words if word in story.lower())
    if sensory_count >= 3:
        atmosphere += 4
        quotes.append(f"✓ {sensory_count} сенсорных деталей")
    elif sensory_count > 0:
        atmosphere += 2
    
    if len(story) > 800:
        atmosphere += 2
        quotes.append("✓ Достаточная длина для атмосферы")
    
    emotional_words = ['напряж', 'тревог', 'страх', 'радост', 'грус', 'злость', 'нежност', 'боль']
    emotional_count = sum(1 for word in emotional_words if word in story.lower())
    if emotional_count >= 2:
        atmosphere += 3
    
    if atmosphere < 5:
        issues.append("⚠️ Слабая атмосфера")
        recommendations.append("Добавить больше сенсорных деталей: запахи, звуки, текстуры")
    
    # 4. Глубина эмоций (не штампы)
    cliche_phrases = ['сердце билось', 'глаза загорелись', 'душа пела', 'бабочки в животе']
    cliche_count = sum(1 for phrase in cliche_phrases if phrase in story.lower())
    
    if cliche_count == 0:
        emotional_depth += 4
        quotes.append("✓ Нет штампованных фраз об эмоциях")
    else:
        emotional_depth -= 2
        issues.append(f"❌ Найдено {cliche_count} штампов")
    
    complex_emotions = ['противоречи', 'одновременно', 'с одной стороны', 'но в то же время', 'вопреки']
    if any(phrase in story.lower() for phrase in complex_emotions):
        emotional_depth += 3
        quotes.append("✓ Показаны сложные/противоречивые эмоции")
    
    if any(word in story.lower() for word in ['молча', 'тишин', 'пауз', 'не сказ']):
        emotional_depth += 2
        quotes.append("✓ Использует молчание для передачи эмоций")
    
    if emotional_depth < 5:
        issues.append("⚠️ Недостаточная эмоциональная глубина")
        recommendations.append("Избегать штампов. Показывать эмоции через поступки, молчание, противоречия")
    
    # 5. NSFW - естественно или пошло
    nsfw_indicators = ['поцел', 'прикосн', 'близ', 'объят', 'ласк', 'страст']
    nsfw_count = sum(1 for word in nsfw_indicators if word in story.lower())
    
    vulgar_words = ['трах', 'еб', 'сиськ', 'хуй', 'пизд']
    vulgar_count = sum(1 for word in vulgar_words if word in story.lower())
    
    if nsfw_count > 0 and vulgar_count == 0:
        nsfw_quality += 5
        quotes.append("✓ Романтика без пошлости")
    elif nsfw_count == 0:
        nsfw_quality += 3
        quotes.append("○ NSFW элементов пока нет (тест начальный)")
    
    if vulgar_count > 0:
        nsfw_quality = 2
        issues.append("❌ Присутствует вульгарность")
        recommendations.append("NSFW должен быть естественным, не вульгарным")
    
    # Финальная оценка
    total_score = (
        (canon_understanding / 9) * 2.5 +
        (npc_alive / 9) * 2.5 +
        (atmosphere / 9) * 2 +
        (emotional_depth / 9) * 2 +
        (nsfw_quality / 5) * 1
    )
    
    return {
        'test_name': test_name,
        'total_score': round(total_score, 1),
        'canon_understanding': canon_understanding,
        'npc_alive': npc_alive,
        'atmosphere': atmosphere,
        'emotional_depth': emotional_depth,
        'nsfw_quality': nsfw_quality,
        'quotes': quotes,
        'issues': issues,
        'recommendations': recommendations,
        'story': story
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Запуск всех тестов креативности"""
    
    try:
        method: str = event.get('httpMethod', 'GET')
        
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '86400'
                },
                'body': ''
            }
        
        results = []
        
        for test_name, test_data in TESTS.items():
            print(f"\n{'='*80}")
            print(f"Запуск теста: {test_name}")
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
                        results.append(analysis)
                        print(f"✅ Тест выполнен. Оценка: {analysis['total_score']}/10")
                    else:
                        results.append({
                            'test_name': test_name,
                            'error': 'Пустой ответ от API',
                            'total_score': 0
                        })
                        print(f"❌ Пустой ответ")
                else:
                    error_msg = f"HTTP {response.status_code}"
                    try:
                        error_data = response.json()
                        error_msg = error_data.get('error', error_msg)
                    except:
                        pass
                    
                    results.append({
                        'test_name': test_name,
                        'error': error_msg,
                        'total_score': 0
                    })
                    print(f"❌ Ошибка: {error_msg}")
            
            except Exception as e:
                results.append({
                    'test_name': test_name,
                    'error': str(e),
                    'total_score': 0
                })
                print(f"❌ Исключение: {str(e)}")
            
            # Пауза между запросами
            time.sleep(2)
        
        # Итоговая статистика
        successful_tests = [r for r in results if 'error' not in r]
        failed_tests = [r for r in results if 'error' in r]
        
        avg_score = sum(r['total_score'] for r in successful_tests) / len(successful_tests) if successful_tests else 0
        
        report = {
            'summary': {
                'total_tests': len(TESTS),
                'successful': len(successful_tests),
                'failed': len(failed_tests),
                'average_score': round(avg_score, 1),
                'status': 'ОТЛИЧНО' if avg_score >= 8 else 'ХОРОШО' if avg_score >= 6 else 'ТРЕБУЕТСЯ ДОРАБОТКА'
            },
            'results': results,
            'timestamp': time.time()
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(report, ensure_ascii=False, indent=2)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Критическая ошибка: {str(e)}'})
        }
