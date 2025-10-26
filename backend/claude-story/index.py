import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация интерактивных историй через Claude API от Anthropic
    Args: event с httpMethod, body (genre, setting, difficulty, userAction, history, gameId)
    Returns: HTTP response с новым сюжетом
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    api_key = os.environ.get('CLAUDE_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'CLAUDE_API_KEY not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    genre = body_data.get('genre', 'фэнтези')
    setting = body_data.get('setting', 'средневековье')
    difficulty = body_data.get('difficulty', 'medium')
    user_action = body_data.get('userAction', '')
    history = body_data.get('history', [])
    
    # Формируем промпт для Claude
    if not history:
        system_prompt = f"""Ты мастер интерактивных историй в жанре {genre}, действие происходит в {setting}.
Сложность: {difficulty}.

Правила:
- Создавай яркие, атмосферные описания
- Давай игроку выбор и свободу действий
- Используй неожиданные повороты сюжета
- Описывай окружение, персонажей, эмоции
- Отвечай на русском языке
- Твой ответ — это продолжение истории (200-300 слов)
- В конце предложи 2-3 варианта действий игрока"""
        
        user_prompt = "Начни новую захватывающую историю. Опиши начальную сцену и ситуацию."
    else:
        context_history = "\n".join([f"Игрок: {h['user']}\nИстория: {h['ai']}" for h in history[-3:]])
        
        system_prompt = f"""Ты мастер интерактивных историй в жанре {genre}, действие происходит в {setting}.
Сложность: {difficulty}.

Предыдущие события:
{context_history}

Правила:
- Учитывай предыдущие события
- Реагируй на действия игрока логично
- Создавай последствия для выборов игрока
- Описывай реакции персонажей и мира
- Отвечай на русском языке
- Твой ответ — это продолжение истории (200-300 слов)"""
        
        user_prompt = f"Действие игрока: {user_action}\n\nОпиши что происходит дальше."
    
    # Запрос к Claude API через air.fail
    import urllib.request
    import urllib.error
    
    api_url = "https://api.air.fail/public/openai/v1/chat/completions"
    
    payload = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 1024,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': api_key
    }
    
    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            story_text = result['choices'][0]['message']['content']
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'story': story_text})
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Claude API error: {error_body}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'})
        }