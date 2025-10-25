'''
Business: Generate fanfiction stories using AI based on character and universe data
Args: event - dict with httpMethod, body (character_ids, universe_id, length, style, rating, custom_prompt)
      context - object with request_id, function_name
Returns: HTTP response with generated story text
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body = event.get('body', '{}')
    if not body or body == 'null':
        body = '{}'
    body_data = json.loads(body)
    character_ids: List[int] = body_data.get('character_ids', [])
    universe_id: int = body_data.get('universe_id')
    length: str = body_data.get('length', 'medium')
    style: str = body_data.get('style', 'narrative')
    rating: str = body_data.get('rating', 'teen')
    custom_prompt: str = body_data.get('custom_prompt', '')
    
    if not universe_id or not character_ids:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'universe_id and character_ids required'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    deepseek_key = os.environ.get('DEEPSEEK_API_KEY')
    
    if not database_url or not deepseek_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Server configuration error'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "SELECT * FROM universes WHERE id = %s",
        (universe_id,)
    )
    universe = cur.fetchone()
    
    if not universe:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Universe not found'}),
            'isBase64Encoded': False
        }
    
    placeholders = ','.join(['%s'] * len(character_ids))
    cur.execute(
        f"SELECT * FROM characters WHERE id IN ({placeholders})",
        character_ids
    )
    characters = cur.fetchall()
    
    cur.close()
    conn.close()
    
    if not characters:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Characters not found'}),
            'isBase64Encoded': False
        }
    
    import requests
    
    length_words = {
        'short': '500-1000',
        'medium': '1500-2500',
        'long': '3000-5000'
    }
    
    style_desc = {
        'narrative': 'художественное повествование от третьего лица',
        'dialogue': 'с акцентом на диалоги и живое общение персонажей',
        'descriptive': 'с детальными описаниями мира и действий',
        'poetic': 'в поэтичном, метафоричном стиле'
    }
    
    rating_desc = {
        'general': 'для всех возрастов, без насилия и романтики',
        'teen': 'для подростков, лёгкая романтика и приключения',
        'mature': 'для взрослых, возможны сложные темы'
    }
    
    chars_desc = []
    for char in characters:
        char_info = f"{char['name']}"
        if char.get('character_role'):
            char_info += f" ({char['character_role']})"
        if char.get('personality'):
            char_info += f" - {char['personality']}"
        if char.get('appearance'):
            char_info += f", внешность: {char['appearance']}"
        if char.get('abilities'):
            char_info += f", способности: {char['abilities']}"
        chars_desc.append(char_info)
    
    system_prompt = f"""Ты — профессиональный писатель фанфикшена. 
Вселенная: {universe['name']} - {universe.get('description', '')}
Жанр: {universe.get('genre', 'фэнтези')}
Источник: {universe.get('canon_source', 'оригинальная вселенная')}

Персонажи:
{chr(10).join(f'- {c}' for c in chars_desc)}

Требования:
- Длина текста: {length_words.get(length, '1500-2500')} слов
- Стиль: {style_desc.get(style, 'художественное повествование')}
- Рейтинг: {rating_desc.get(rating, 'для подростков')}
- Соблюдай характеры и особенности персонажей
- Пиши на русском языке
- Создай увлекательную историю с конфликтом и развитием
"""
    
    user_prompt = custom_prompt if custom_prompt else f"Напиши фанфик по вселенной {universe['name']} с этими персонажами. Создай оригинальную историю, которая раскроет их характеры."
    
    response = requests.post(
        'https://api.deepseek.com/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {deepseek_key}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'deepseek-chat',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            'temperature': 0.8,
            'max_tokens': 4000
        },
        timeout=60
    )
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'AI generation failed', 'details': response.text}),
            'isBase64Encoded': False
        }
    
    result = response.json()
    generated_text = result['choices'][0]['message']['content']
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute(
        """INSERT INTO stories 
           (title, content, universe_id, character_ids, length, style, rating, created_at) 
           VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP) 
           RETURNING id""",
        (
            f"Фанфик: {universe['name']}",
            generated_text,
            universe_id,
            character_ids,
            length,
            style,
            rating
        )
    )
    story_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'story_id': story_id,
            'content': generated_text,
            'universe': universe['name'],
            'characters': [c['name'] for c in characters]
        }),
        'isBase64Encoded': False
    }