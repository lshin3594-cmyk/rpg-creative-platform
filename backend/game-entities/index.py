'''
Business: Manage RPG game entities (characters and worlds) - full CRUD operations with JWT auth
Args: event with httpMethod (GET/POST/PUT/DELETE), entity type, body, queryStringParameters
Returns: HTTP response with entities data or operation status
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
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(event: Dict[str, Any]) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]]]:
    headers = event.get('headers', {})
    auth_header = headers.get('X-Auth-Token', headers.get('x-auth-token', ''))
    
    if not auth_header:
        error_response = {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
        return None, error_response
    
    user = verify_jwt(auth_header)
    if not user:
        error_response = {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Недействительный токен'})
        }
        return None, error_response
    
    return user, None

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    entity_type = params.get('type', 'characters')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if entity_type not in ['characters', 'worlds', 'plots']:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid entity type. Use characters, worlds, or plots'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            if entity_type == 'characters':
                cur.execute('''
                    SELECT id, name, role, avatar, stats, personality, backstory, character_type, created_at 
                    FROM t_p56538376_rpg_creative_platfor.characters 
                    ORDER BY created_at DESC
                ''')
            elif entity_type == 'worlds':
                cur.execute('''
                    SELECT id, name, description, image, genre, created_at 
                    FROM t_p56538376_rpg_creative_platfor.worlds 
                    ORDER BY created_at DESC
                ''')
            else:
                cur.execute('''
                    SELECT id, name, description, genre, hooks, conflict, resolution, created_at 
                    FROM t_p56538376_rpg_creative_platfor.plots 
                    ORDER BY created_at DESC
                ''')
            
            entities = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps([dict(row) for row in entities], default=str)
            }
        
        elif method == 'POST':
            user, error = require_auth(event)
            if error:
                return error
            
            body = json.loads(event.get('body', '{}'))
            
            if entity_type == 'characters':
                name = body.get('name', '')
                role = body.get('role', '')
                avatar = body.get('avatar', '')
                stats = body.get('stats', '')
                personality = body.get('personality', '')
                backstory = body.get('backstory', '')
                
                character_type = body.get('character_type', 'player')
                
                cur.execute('''
                    INSERT INTO t_p56538376_rpg_creative_platfor.characters 
                    (name, role, avatar, stats, personality, backstory, character_type)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, name, role, avatar, stats, personality, backstory, character_type, created_at
                ''', (name, role, avatar, stats, personality, backstory, character_type))
            elif entity_type == 'worlds':
                name = body.get('name', '')
                description = body.get('description', '')
                image = body.get('image', '')
                genre = body.get('genre', '')
                
                cur.execute('''
                    INSERT INTO t_p56538376_rpg_creative_platfor.worlds 
                    (name, description, image, genre)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, name, description, image, genre, created_at
                ''', (name, description, image, genre))
            else:
                name = body.get('name', '')
                description = body.get('description', '')
                genre = body.get('genre', '')
                hooks = body.get('hooks', '')
                conflict = body.get('conflict', '')
                resolution = body.get('resolution', '')
                
                cur.execute('''
                    INSERT INTO t_p56538376_rpg_creative_platfor.plots 
                    (name, description, genre, hooks, conflict, resolution)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, name, description, genre, hooks, conflict, resolution, created_at
                ''', (name, description, genre, hooks, conflict, resolution))
            
            entity = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(entity), default=str)
            }
        
        elif method == 'PUT':
            user, error = require_auth(event)
            if error:
                return error
            
            entity_id = params.get('id')
            body = json.loads(event.get('body', '{}'))
            
            if not entity_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id parameter'})
                }
            
            if entity_type == 'characters':
                update_fields = []
                update_values = []
                
                for field in ['name', 'role', 'avatar', 'stats', 'personality', 'backstory', 'character_type']:
                    if field in body:
                        update_fields.append(f'{field} = %s')
                        update_values.append(body[field])
                
                if not update_fields:
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No fields to update'})
                    }
                
                update_values.append(entity_id)
                query = f'''
                    UPDATE t_p56538376_rpg_creative_platfor.characters 
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                    RETURNING id, name, role, avatar, stats, personality, backstory, character_type, created_at
                '''
                cur.execute(query, update_values)
            elif entity_type == 'worlds':
                update_fields = []
                update_values = []
                
                for field in ['name', 'description', 'image', 'genre']:
                    if field in body:
                        update_fields.append(f'{field} = %s')
                        update_values.append(body[field])
                
                if not update_fields:
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No fields to update'})
                    }
                
                update_values.append(entity_id)
                query = f'''
                    UPDATE t_p56538376_rpg_creative_platfor.worlds 
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                    RETURNING id, name, description, image, genre, created_at
                '''
                cur.execute(query, update_values)
            else:
                update_fields = []
                update_values = []
                
                for field in ['name', 'description', 'genre', 'hooks', 'conflict', 'resolution']:
                    if field in body:
                        update_fields.append(f'{field} = %s')
                        update_values.append(body[field])
                
                if not update_fields:
                    return {
                        'statusCode': 400,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No fields to update'})
                    }
                
                update_values.append(entity_id)
                query = f'''
                    UPDATE t_p56538376_rpg_creative_platfor.plots 
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                    RETURNING id, name, description, genre, hooks, conflict, resolution, created_at
                '''
                cur.execute(query, update_values)
            
            entity = cur.fetchone()
            conn.commit()
            
            if not entity:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Entity not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(dict(entity), default=str)
            }
        
        elif method == 'DELETE':
            user, error = require_auth(event)
            if error:
                return error
            
            entity_id = params.get('id')
            
            if not entity_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id parameter'})
                }
            
            table = f't_p56538376_rpg_creative_platfor.{entity_type}'
            cur.execute(f'DELETE FROM {table} WHERE id = %s', (entity_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()