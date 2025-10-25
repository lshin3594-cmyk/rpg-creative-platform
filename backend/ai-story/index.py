'''
Business: AI story generation with character extraction
Args: event with httpMethod, body containing user action and game settings
Returns: HTTP response with AI story continuation and extracted NPCs
'''

import json
import os
from typing import Dict, Any, List

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
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    user_action: str = body_data.get('action', '')
    game_settings: Dict = body_data.get('settings', {})
    history: List[Dict] = body_data.get('history', [])
    
    # TODO: Интеграция с OpenAI API
    # Пока возвращаем моковый ответ
    
    ai_response = generate_story_continuation(user_action, game_settings, history)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'text': ai_response['text'],
            'characters': ai_response['characters'],
            'episode': ai_response['episode']
        })
    }

def generate_story_continuation(action: str, settings: Dict, history: List[Dict]) -> Dict[str, Any]:
    """
    Генерирует продолжение истории на основе действия пользователя
    """
    
    # Мок для тестирования (потом заменим на OpenAI)
    role = settings.get('role', 'hero')
    narrative_mode = settings.get('narrativeMode', 'third')
    
    if len(history) == 0:
        # Первое сообщение - начало истории
        text = f"История началась. {action}\n\n"
        
        if role == 'hero':
            text += "Вы стоите на пороге приключения. Мир полон опасностей и возможностей. "
            text += "Впереди виднеется старый трактир 'Золотой дракон', откуда доносятся приглушённые голоса."
        else:
            text += "Ваша история разворачивается. Персонажи ждут ваших указаний."
        
        characters = [
            {
                'name': 'Старый трактирщик Грэг',
                'role': 'NPC',
                'description': 'Пожилой мужчина с седой бородой, хозяин трактира'
            }
        ]
    else:
        # Продолжение истории
        text = f"Вы решаете: {action}\n\n"
        text += "Трактирщик поднимает взгляд от стойки и кивает вам. "
        text += "'Добро пожаловать, путник. Что привело тебя в наши края?'"
        
        characters = []
    
    return {
        'text': text,
        'characters': characters,
        'episode': len(history) + 1
    }
