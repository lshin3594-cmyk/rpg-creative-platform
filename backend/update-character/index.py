'''
Business: Update character data in database
Args: event - dict with httpMethod, body (id, name, age, gender, appearance, personality, etc.)
      context - object with request_id
Returns: HTTP response with updated character data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

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
        body_data = json.loads(event.get('body', '{}'))
        headers = event.get('headers', {})
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
        character_id: int = body_data.get('id')
        name: str = body_data.get('name')
        universe_id: int = body_data.get('universe_id')
        age: str = body_data.get('age', '')
        gender: str = body_data.get('gender', '')
        appearance: str = body_data.get('appearance', '')
        personality: str = body_data.get('personality', '')
        backstory: str = body_data.get('background', '')
        abilities: str = body_data.get('abilities', '')
        strengths: str = body_data.get('strengths', '')
        weaknesses: str = body_data.get('weaknesses', '')
        goals: str = body_data.get('goals', '')
        character_role: str = body_data.get('role', 'main')
        
        if not character_id or not name:
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
        
        def escape(s: str) -> str:
            return s.replace("'", "''") if s else ''
        
        universe_part = f"universe_id = {universe_id}" if universe_id else "universe_id = NULL"
        
        query = f"""UPDATE characters 
               SET name = '{escape(name)}', 
                   {universe_part}, 
                   age = '{escape(age)}', 
                   gender = '{escape(gender)}', 
                   appearance = '{escape(appearance)}', 
                   personality = '{escape(personality)}', 
                   backstory = '{escape(backstory)}',
                   abilities = '{escape(abilities)}', 
                   strengths = '{escape(strengths)}', 
                   weaknesses = '{escape(weaknesses)}', 
                   goals = '{escape(goals)}', 
                   character_role = '{escape(character_role)}', 
                   role = '{escape(character_role)}'
               WHERE id = {character_id}
               RETURNING *"""
        cur.execute(query)
        updated_character = cur.fetchone()
        
        if not updated_character:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Character not found'}),
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
            'body': json.dumps({'character': dict(updated_character)}, default=str),
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