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
        
        chars_str = ', '.join([c.get('name', '') for c in characters[:3]]) if characters else 'нет'
        
        system_prompt = f"""МАСТЕР ИГРЫ. Жанр: {genre}, рейтинг: {rating}.
Сеттинг: {world_setting if world_setting else genre}
Персонажи: {chars_str}

Задача: Яркая сцена (800-1000 слов), диалоги живые (мат ок), NPC активны, стиль {tone_description}.
Правило: НЕ действуй за игрока. Мир реагирует на выборы.

Формат:
**[МЕТА]** ⏰ Время/место 🎬 События 💕 Отношения 🧠 Эмоции 🔍 Инфо ⚔️ Ситуация
---
[ИСТОРИЯ 2-3 абзаца]
[Выбор для игрока]"""
        
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
                'temperature': 0.75,
                'max_tokens': 800
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