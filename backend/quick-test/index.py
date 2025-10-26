"""
Бизнес: Быстрый тест креативности ИИ (один сценарий)
Args: event (пустой)
Returns: Детальный отчет с оценкой и примерами из истории
"""

import json
import os
import requests
from typing import Dict, Any

API_URL = 'https://functions.poehali.dev/9ea67dc2-c306-4906-bf0f-da435600b92c'

TEST_SCENARIO = {
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
                'ideas': "Дэниэл до сих пор любит Алекса, но злится на него. Хочет причинить боль, но мечтает обнять. Публично холоден, в глубине души ждёт извинений. Не прощал других партнёров, сравнивает всех с Алексом. Эмоциональные качели: то холоден и зол, то вдруг проявляет мягкость. Противоречив: 'Я не могу тебя простить... но блять, я скучал'."
            }
        ]
    },
    'setting': "Алекс случайно приходит на концерт Дэниэла в маленьком джаз-клубе. Их взгляды встречаются через зал. После концерта Дэниэл подходит к бару, где сидит Алекс. 5 лет молчания между ними.",
    'user_action': "",
    'history': []
}

def analyze_story(story: str) -> Dict[str, Any]:
    """Анализ истории на живость персонажей"""
    
    scores = {
        'emotional_swings': 0,  # Эмоциональные качели
        'stream_of_consciousness': 0,  # Поток сознания
        'contradictions': 0,  # Противоречия
        'natural_speech': 0,  # Живая речь
        'show_not_tell': 0  # Показывать, не рассказывать
    }
    
    examples = []
    
    # 1. Эмоциональные качели (NPC меняют настроение)
    mood_shifts = ['злость', 'нежность', 'холод', 'тепло', 'сарказм', 'вдруг', 'внезапно', 'но затем']
    mood_count = sum(1 for word in mood_shifts if word in story.lower())
    if mood_count >= 3:
        scores['emotional_swings'] = 10
        examples.append("✅ Эмоциональные качели: NPC меняет настроение")
    elif mood_count >= 1:
        scores['emotional_swings'] = 5
        examples.append("⚠️ Слабые эмоциональные качели")
    
    # 2. Поток сознания (незаконченные фразы, возврат к мысли)
    stream_markers = ['погоди', 'постой', 'нет, ', 'хотя', 'э-э-э', 'блять', 'ну вот']
    stream_count = sum(1 for marker in stream_markers if marker in story.lower())
    if stream_count >= 3:
        scores['stream_of_consciousness'] = 10
        examples.append("✅ Поток сознания: NPC сбивается, возвращается к мысли")
    elif stream_count >= 1:
        scores['stream_of_consciousness'] = 5
        examples.append("⚠️ Слабый поток сознания")
    
    # 3. Противоречия (NPC ошибается, меняет мнение)
    contradiction_markers = ['противоречи', 'одновременно', 'но в то же время', 'я не могу... но', 'хотя нет']
    contradiction_count = sum(1 for marker in contradiction_markers if marker in story.lower())
    if contradiction_count >= 2:
        scores['contradictions'] = 10
        examples.append("✅ Противоречия: NPC противоречит себе, показывает сложность")
    elif contradiction_count >= 1:
        scores['contradictions'] = 5
        examples.append("⚠️ Слабые противоречия")
    
    # 4. Живая речь (междометия, повторы, мат)
    natural_markers = ['блять', 'чёрт', 'ну...', '...', 'э-э', 'ммм']
    natural_count = sum(1 for marker in natural_markers if marker in story.lower())
    if natural_count >= 3:
        scores['natural_speech'] = 10
        examples.append("✅ Живая речь: междометия, паузы, естественный язык")
    elif natural_count >= 1:
        scores['natural_speech'] = 5
        examples.append("⚠️ Слабая живая речь")
    
    # 5. Показывать, не рассказывать (действия вместо описания эмоций)
    bad_markers = ['чувствовал', 'ощущал', 'понял', 'подумал', 'сердце билось', 'глаза загорелись']
    good_markers = ['сжал', 'отвернулся', 'краснеет', 'запинается', 'молчал', 'пауза']
    
    bad_count = sum(1 for marker in bad_markers if marker in story.lower())
    good_count = sum(1 for marker in good_markers if marker in story.lower())
    
    if good_count >= 3 and bad_count <= 1:
        scores['show_not_tell'] = 10
        examples.append("✅ Показывает эмоции через действия, не рассказывает")
    elif good_count >= 1:
        scores['show_not_tell'] = 5
        examples.append("⚠️ Есть действия, но много 'рассказа' эмоций")
    
    total = sum(scores.values()) / 5  # Средняя оценка из 10
    
    return {
        'total_score': round(total, 1),
        'scores': scores,
        'examples': examples,
        'story_preview': story[:800] + '...' if len(story) > 800 else story
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Запуск быстрого теста"""
    
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
    
    try:
        print("🚀 Запуск теста 'Эмоциональная глубина + живые персонажи'")
        
        response = requests.post(
            API_URL,
            json=TEST_SCENARIO,
            headers={'Content-Type': 'application/json'},
            timeout=45
        )
        
        if response.ok:
            data = response.json()
            story = data.get('story', '')
            
            if story:
                analysis = analyze_story(story)
                
                result = {
                    'test_name': 'Эмоциональная глубина + живые персонажи',
                    'status': 'success',
                    'analysis': analysis,
                    'full_story': story
                }
                
                print(f"✅ Тест завершен. Оценка: {analysis['total_score']}/10")
                print(f"Примеры: {analysis['examples']}")
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(result, ensure_ascii=False)
                }
            else:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'No story generated'})
                }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'API error: {response.text}'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
