import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generates creative stories using DeepSeek AI without censorship
    Args: event with httpMethod, body (prompt, character, world, genre)
    Returns: Generated story text
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Parse request body
    body_str = event.get('body') or '{}'
    try:
        body_data = json.loads(body_str) if body_str.strip() else {}
    except (json.JSONDecodeError, AttributeError):
        body_data = {}
    prompt: str = body_data.get('prompt', '')
    character: str = body_data.get('character', '')
    world: str = body_data.get('world', '')
    genre: str = body_data.get('genre', 'фэнтези')
    narrative_mode: str = body_data.get('narrative_mode', 'mixed')
    npc_characters: str = body_data.get('npc_characters', '')
    story_context: str = body_data.get('story_context', '')
    player_action: str = body_data.get('player_action', '')
    
    is_continuation = bool(story_context and player_action)
    
    if not prompt and not is_continuation:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt is required'})
        }
    
    # Get DeepSeek API key from environment
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    # Build system prompt based on narrative mode
    narrative_instructions = {
        'mixed': 'СМЕШАННОЕ: Пиши от 2-го лица для игрока ("Ты..."), показывай мысли NPC в *курсиве*. Раскрывай внутренний мир всех персонажей.',
        'first_person': 'От 1-го лица ("Я..."). Только мысли и чувства главного героя.',
        'third_person': 'От 3-го лица ("Он/она..."). Нейтральное повествование.'
    }
    
    if is_continuation:
        system_prompt = f"""Мастер интерактивных историй {genre}. Продолжи сюжет: опиши последствия действия, реакции NPC, новую ситуацию.
{narrative_instructions.get(narrative_mode, narrative_instructions['mixed'])}
Формат: 3-4 абзаца, живые диалоги, напряжение."""
        
        user_prompt = f"""Персонаж: {character}
NPC: {npc_characters}
Мир: {world}

События: {story_context[-800:]}

Действие: {player_action}

Продолжи:"""
    else:
        system_prompt = f"""Писатель {genre}. Создавай атмосферные истории без цензуры.
{narrative_instructions.get(narrative_mode, narrative_instructions['mixed'])}"""
        
        user_prompt = f"{character}\nNPC: {npc_characters}\n{world}\n\n{prompt}" if character else prompt
    
    # Call DeepSeek API
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ],
        'temperature': 0.9,
        'max_tokens': 1500,
        'stream': False
    }
    
    response = requests.post(
        'https://api.deepseek.com/v1/chat/completions',
        headers=headers,
        json=payload,
        timeout=25
    )
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'DeepSeek API error',
                'details': response.text
            })
        }
    
    result = response.json()
    story_text = result['choices'][0]['message']['content']
    
    response_key = 'continuation' if is_continuation else 'story'
    response_data = {
        response_key: story_text,
        'model': 'deepseek-chat',
        'tokens_used': result.get('usage', {}).get('total_tokens', 0)
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(response_data, ensure_ascii=False)
    }