"""
Business: Генерация игровых историй через DeepSeek API
Args: event с httpMethod, body (game_data, user_action, history)
Returns: HTTP response с сгенерированной историей
"""

import json
import os
from typing import Dict, Any, List
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
    role = game_settings.get('role', 'hero')
    
    tone_description = 'простые фразы' if tone <= 2 else 'умеренный стиль' if tone <= 4 else 'литературный стиль'
    
    role_instruction = 'Ты ведущий мастер игры (Game Master). Описывай мир, NPC и события.' if role == 'hero' else 'Ты соавтор истории. Развивай сюжет вместе с игроком.'
    
    system_prompt = f"""Ты мастер ролевой игры. Жанр: {genre}. Рейтинг: {rating}.

СЕТТИНГ МИРА:
{world_setting if world_setting else f'Стандартный мир жанра {genre}'}

ПЕРСОНАЖИ:
{chr(10).join([f"- {c.get('name', 'Неизвестный')}: {c.get('role', '')} - {c.get('description', '')}" for c in characters]) if characters else 'Персонажи ещё не созданы'}

РОЛЬ: {role_instruction}

ПРАВИЛА ГЕНЕРАЦИИ:
1. СТРОГО следуй сеттингу мира и жанру {genre}
2. Описывай события ярко и детально (2-4 абзаца)
3. Реагируй на действия игрока логично
4. Вводи NPC с описанием внешности и характера
5. Добавляй конфликты и повороты сюжета
6. Стиль: {tone_description}
7. НЕ повторяй действия игрока дословно
8. Описывай последствия действий игрока

ВАЖНО: Не выходи за рамки сеттинга "{world_setting if world_setting else genre}"! Каждая деталь должна соответствовать миру игры."""

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
            'max_tokens': 1000
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