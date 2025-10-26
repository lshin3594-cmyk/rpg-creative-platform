'''
Business: Update universe (game) data in database
Args: event - dict with httpMethod, body (id, name, description, canon_source, genre, tags)
      context - object with request_id
Returns: HTTP response with updated universe data
'''

import json
import os
from typing import Dict, Any, List, Optional, Tuple
import psycopg2
from psycopg2.extras import RealDictCursor
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
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration error'}),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        user, error = require_auth(event)
        if error:
            return error
        
        body = event.get('body', '{}')
        if not body or body == 'null':
            body = '{}'
        body_data = json.loads(body)
        
        universe_id: int = body_data.get('id')
        name: str = body_data.get('name')
        description: str = body_data.get('description', '')
        canon_source: str = body_data.get('canon_source', '')
        source_type: str = body_data.get('source_type', 'custom')
        genre: str = body_data.get('genre', '')
        tags: List[str] = body_data.get('tags', [])
        
        if not universe_id or not name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'id and name are required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        tags_str = ','.join([f"'{tag}'" for tag in tags]) if tags else ''
        tags_array = f"ARRAY[{tags_str}]" if tags else "ARRAY[]::text[]"
        
        query = f"""UPDATE universes 
               SET name = '{name.replace("'", "''")}', 
                   description = '{description.replace("'", "''")}', 
                   canon_source = '{canon_source.replace("'", "''")}', 
                   source_type = '{source_type}', 
                   genre = '{genre.replace("'", "''")}', 
                   tags = {tags_array}
               WHERE id = {universe_id}
               RETURNING *"""
        cur.execute(query)
        updated_universe = cur.fetchone()
        
        if not updated_universe:
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
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'universe': dict(updated_universe)}, default=str),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }