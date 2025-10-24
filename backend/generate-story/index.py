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
    
    if not prompt:
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
    
    # Build system prompt
    system_prompt = f"""Ты — креативный писатель, создающий захватывающие истории в жанре {genre}.
Твоя задача — писать глубокие, атмосферные истории без ограничений и цензуры.
Используй яркие описания, развивай персонажей, создавай напряжение и неожиданные повороты."""
    
    # Build user prompt with context
    user_prompt = prompt
    if character:
        user_prompt = f"Персонаж: {character}\n\n{user_prompt}"
    if world:
        user_prompt = f"Мир: {world}\n\n{user_prompt}"
    
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
        'max_tokens': 2000
    }
    
    response = requests.post(
        'https://api.deepseek.com/v1/chat/completions',
        headers=headers,
        json=payload,
        timeout=60
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
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'story': story_text,
            'model': 'deepseek-chat',
            'tokens_used': result.get('usage', {}).get('total_tokens', 0)
        }, ensure_ascii=False)
    }