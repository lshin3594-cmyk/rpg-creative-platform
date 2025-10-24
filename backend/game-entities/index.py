'''
Business: Manage RPG game entities (characters and worlds) - CRUD operations
Args: event with httpMethod, path (/characters or /worlds), body, queryStringParameters
Returns: HTTP response with entities data or operation status
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

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
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if entity_type not in ['characters', 'worlds']:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid entity type. Use characters or worlds'})
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            if entity_type == 'characters':
                cur.execute('''
                    SELECT id, name, role, avatar, stats, personality, backstory, created_at 
                    FROM t_p56538376_rpg_creative_platfor.characters 
                    ORDER BY created_at DESC
                ''')
            else:
                cur.execute('''
                    SELECT id, name, description, image, genre, created_at 
                    FROM t_p56538376_rpg_creative_platfor.worlds 
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
            body = json.loads(event.get('body', '{}'))
            
            if entity_type == 'characters':
                name = body.get('name', '')
                role = body.get('role', '')
                avatar = body.get('avatar', '')
                stats = body.get('stats', '')
                personality = body.get('personality', '')
                backstory = body.get('backstory', '')
                
                cur.execute('''
                    INSERT INTO t_p56538376_rpg_creative_platfor.characters 
                    (name, role, avatar, stats, personality, backstory)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, name, role, avatar, stats, personality, backstory, created_at
                ''', (name, role, avatar, stats, personality, backstory))
            else:
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
        
        elif method == 'DELETE':
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
