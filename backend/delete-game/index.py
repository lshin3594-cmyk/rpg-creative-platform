import json
import os
import psycopg2
from typing import Dict, Any, Optional, Tuple
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
    Business: Delete saved game from library
    Args: event with httpMethod, queryStringParameters (story_id)
    Returns: HTTP response with deletion status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'DELETE':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    user, error = require_auth(event)
    if error:
        return error
    
    params = event.get('queryStringParameters', {})
    story_id = params.get('story_id')
    
    if not story_id:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'error': 'story_id required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM saved_stories WHERE id = %s', (story_id,))
    conn.commit()
    
    deleted = cursor.rowcount > 0
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({'success': deleted, 'message': 'Game deleted' if deleted else 'Not found'})
    }