'''
Business: Manage RPG games - create, read, update, delete with inventory, stats, combat log
Args: event with httpMethod (GET/POST/PUT/DELETE), body, queryStringParameters
Returns: HTTP response with game data or operation status
'''

import json
import os
from typing import Dict, Any, Optional, Tuple
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration error'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            user, error = require_auth(event)
            if error:
                return error
            
            params = event.get('queryStringParameters') or {}
            game_id = params.get('id')
            
            if game_id:
                cur.execute('SELECT * FROM rpg_games WHERE id = %s AND user_id = %s', (int(game_id), user['user_id']))
                game = cur.fetchone()
                if not game:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Game not found'}),
                        'isBase64Encoded': False
                    }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(game), default=str),
                    'isBase64Encoded': False
                }
            else:
                cur.execute('SELECT * FROM rpg_games WHERE user_id = %s ORDER BY last_played DESC NULLS LAST, created_at DESC', (user['user_id'],))
                games = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(g) for g in games], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            user, error = require_auth(event)
            if error:
                return error
            
            body = json.loads(event.get('body', '{}'))
            
            title = body.get('title', '')
            genre = body.get('genre', '')
            setting = body.get('setting', '')
            difficulty = body.get('difficulty', 'normal')
            current_chapter = body.get('current_chapter', '')
            story_context = body.get('story_context', '')
            player_character_id = body.get('player_character_id')
            
            if not title:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'title is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO rpg_games 
                (user_id, title, genre, setting, difficulty, current_chapter, story_context, player_character_id, last_played)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                RETURNING *
            ''', (user['user_id'], title, genre, setting, difficulty, current_chapter, story_context, player_character_id))
            
            game = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(game), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            user, error = require_auth(event)
            if error:
                return error
            
            params = event.get('queryStringParameters') or {}
            game_id = params.get('id')
            
            if not game_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id is required'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            
            update_fields = []
            update_values = []
            
            for field in ['title', 'genre', 'setting', 'difficulty', 'current_chapter', 'story_context', 
                          'actions_log', 'inventory', 'stats', 'combat_log', 'player_character_id', 'is_favorite']:
                if field in body:
                    if field in ['actions_log', 'inventory', 'stats', 'combat_log']:
                        update_fields.append(f'{field} = %s')
                        update_values.append(json.dumps(body[field]))
                    else:
                        update_fields.append(f'{field} = %s')
                        update_values.append(body[field])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_fields.append('last_played = CURRENT_TIMESTAMP')
            update_values.extend([int(game_id), user['user_id']])
            
            query = f'''
                UPDATE rpg_games 
                SET {', '.join(update_fields)}
                WHERE id = %s AND user_id = %s
                RETURNING *
            '''
            
            cur.execute(query, update_values)
            game = cur.fetchone()
            
            if not game:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Game not found'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(game), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            user, error = require_auth(event)
            if error:
                return error
            
            params = event.get('queryStringParameters') or {}
            game_id = params.get('id')
            
            if not game_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('DELETE FROM rpg_games WHERE id = %s AND user_id = %s', (int(game_id), user['user_id']))
            deleted = cur.rowcount > 0
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': deleted, 'message': 'Game deleted' if deleted else 'Not found'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
