'''
Business: Save fanfic character to database with all attributes
Args: event - dict with httpMethod, body (name, age, gender, appearance, personality, etc.)
      context - object with request_id
Returns: HTTP response with character_id
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
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        headers = event.get('headers', {})
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        universe_id = params.get('universe_id')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if user_id and universe_id:
            cur.execute(
                "SELECT * FROM characters WHERE user_id = %s AND universe_id = %s ORDER BY created_at DESC",
                (int(user_id), int(universe_id))
            )
        elif user_id:
            cur.execute(
                "SELECT * FROM characters WHERE user_id = %s ORDER BY created_at DESC",
                (int(user_id),)
            )
        elif universe_id:
            cur.execute(
                "SELECT * FROM characters WHERE universe_id = %s ORDER BY created_at DESC",
                (int(universe_id),)
            )
        else:
            cur.execute("SELECT * FROM characters ORDER BY created_at DESC")
        
        characters = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'characters': [dict(c) for c in characters]}, default=str),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        headers = event.get('headers', {})
        user_id = headers.get('X-User-Id') or headers.get('x-user-id')
        
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
        
        if not name or not personality:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'name and personality are required'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if user_id:
            cur.execute(
                """INSERT INTO characters 
                   (name, user_id, universe_id, age, gender, appearance, personality, backstory, 
                    abilities, strengths, weaknesses, goals, character_role, role, character_type) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
                   RETURNING id""",
                (name, int(user_id), universe_id, age, gender, appearance, personality, backstory,
                 abilities, strengths, weaknesses, goals, character_role, character_role, 'fanfic')
            )
        else:
            cur.execute(
                """INSERT INTO characters 
                   (name, universe_id, age, gender, appearance, personality, backstory, 
                    abilities, strengths, weaknesses, goals, character_role, role, character_type) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
                   RETURNING id""",
                (name, universe_id, age, gender, appearance, personality, backstory,
                 abilities, strengths, weaknesses, goals, character_role, character_role, 'fanfic')
            )
        character_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'character_id': character_id, 'name': name}),
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