import json
import os
from typing import Dict, Any, Optional, Tuple
import psycopg2
import jwt

def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    jwt_secret = os.environ.get('JWT_SECRET')
    if not jwt_secret:
        return None
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return payload
    except:
        return None

def require_auth(event: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
    headers = event.get('headers', {})
    auth_header = headers.get('X-Auth-Token', headers.get('x-auth-token', ''))
    if not auth_header:
        return None, {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    user = verify_jwt(auth_header)
    if not user:
        return None, {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Недействительный токен'})
        }
    return user, None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Saves generated story to database
    Args: event with httpMethod, body (title, content, prompt, character_name, world_name, genre)
    Returns: Saved story with ID
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
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
    
    user, error = require_auth(event)
    if error:
        return error
    
    body_str = event.get('body') or '{}'
    try:
        body_data = json.loads(body_str) if body_str.strip() else {}
    except (json.JSONDecodeError, AttributeError):
        body_data = {}
    
    title: str = body_data.get('title', 'Без названия')
    content: str = body_data.get('content', '')
    prompt: str = body_data.get('prompt', '')
    character_name: str = body_data.get('character_name', '')
    world_name: str = body_data.get('world_name', '')
    genre: str = body_data.get('genre', 'фэнтези')
    story_context: str = body_data.get('story_context', content)
    actions_log: str = json.dumps(body_data.get('actions_log', []))
    
    if not content:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Content is required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO stories (title, content, prompt, character_name, world_name, genre, story_context, actions_log) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id, created_at",
        (title, content, prompt, character_name, world_name, genre, story_context, actions_log)
    )
    
    story_id, created_at = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'id': story_id,
            'title': title,
            'content': content,
            'prompt': prompt,
            'character_name': character_name,
            'world_name': world_name,
            'genre': genre,
            'created_at': created_at.isoformat()
        }, ensure_ascii=False)
    }