"""
Business: Генерация игровых историй через DeepSeek API
Args: event с httpMethod, body (game_data, user_action, history)
Returns: HTTP response с сгенерированной историей
"""

import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        method: str = event.get('httpMethod', 'POST')
        
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                    'Access-Control-Max-Age': '86400'
                },
                'body': ''
            }
        
        if method != 'POST':
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
        body_data = json.loads(event.get('body', '{}'))
        
        game_settings = body_data.get('game_settings', {})
        user_action = body_data.get('user_action', '')
        history = body_data.get('history', [])
        
        genre = game_settings.get('genre', 'фэнтези')
        characters = game_settings.get('characters', [])
        rating = game_settings.get('rating', '18+')
        tone = game_settings.get('tone', 3)
        world_setting = game_settings.get('world', '')
        
        tone_description = 'простые фразы' if tone <= 2 else 'умеренный стиль' if tone <= 4 else 'литературный стиль'
        
        system_prompt = f"""ТЫ ВЕДУЩИЙ ИГРЫ В ЖАНРЕ {genre.upper()}. РЕЙТИНГ: {rating}.

🌍 СЕТТИНГ МИРА:
{world_setting if world_setting else f'Стандартный мир жанра {genre}'}

👥 ПЕРСОНАЖИ ИГРОКА:
{chr(10).join([f"• {c.get('name', 'Неизвестный')} — {c.get('role', '')}: {c.get('description', '')}" for c in characters]) if characters else 'Персонажи не созданы'}

⚡ ТВОЯ ЗАДАЧА КАК МАСТЕРА:

1. СОЗДАНИЕ СЦЕНЫ:
   - Создай яркий мир, сюжет и события
   - Объедини их в живую сцену
   - Подведи игрока к выбору в конце

2. ОПИСАНИЯ:
   - ПОДРОБНОЕ описание окружения и одежды
   - Используй литературные приёмы: метафоры, эпитеты, сравнения, иронию, оксюморон, гиперболу, символизм, сарказм
   - Стиль: {tone_description}

3. ДИАЛОГИ И NPC:
   - Диалоги живые + мат + сленг + юмор
   - NPC ЖИВЫЕ и активные, помнят слова
   - NPC имеют мотивацию и характер

4. ТОНАЛЬНОСТЬ:
   - {rating} БЕЗ ЦЕНЗУРЫ (секс-сцены разрешены)
   - Не настаивай на одной сюжетной линии
   - Серьёзное + юмор = живая история

🚫 КРИТИЧЕСКИЕ ПРАВИЛА:

❌ НЕ действуй за игрока
❌ НЕ принимай решения за игрока
❌ НЕ веди диалоги за игрока
❌ НЕ повторяй действия игрока дословно

✅ Мир реагирует на действия игрока
✅ Последствия действий важны
✅ Выбор игрока влияет на историю

📊 ФОРМАТ ОТВЕТА:

**[МЕТА]**
⏰ Время и место: [текущее время и локация]
🎬 События хода: 
   1. [первое событие]
   2. [второе событие]
💕 Романтические отношения: [NPC] - [процент]%
🧠 Эмоции персонажей: [NPC] - [состояние]
🔍 Новая информация: [факты/улики с описанием]
⚔️ Тактическая ситуация: [враги, союзники, ресурсы]
❓ Нерешённые вопросы: [список]
🎯 Планы на следующий ход: [варианты]
📋 Внедрённые интерфейсы: [список]
🧑‍💼 NPC встречено: [имя] - отношения [уровень]

---

[ИСТОРИЯ - 2-4 абзаца с яркими описаниями]

[Закончи выбором для игрока]

ЛИМИТ META: 500-600 слов для быстрого вспоминания сюжета.
СТРОГО следуй сеттингу "{world_setting if world_setting else genre}"!"""
        
        messages = [{'role': 'system', 'content': system_prompt}]
        
        for entry in history[-10:]:
            messages.append({'role': 'user', 'content': entry.get('user', '')})
            messages.append({'role': 'assistant', 'content': entry.get('ai', '')})
        
        if user_action:
            messages.append({'role': 'user', 'content': f"Действие игрока: {user_action}"})
        else:
            messages.append({'role': 'user', 'content': "Начни игру. Опиши стартовую сцену."})
        
        api_key = os.environ.get('DEEPSEEK_API_KEY')
        
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DeepSeek API key not configured'})
            }
        
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': messages,
                'temperature': 0.8,
                'max_tokens': 1500
            },
            timeout=30
        )
        
        if not response.ok:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'DeepSeek API error: {response.text}'})
            }
        
        result = response.json()
        story_text = result['choices'][0]['message']['content']
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'story': story_text})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Error: {str(e)}'})
        }
