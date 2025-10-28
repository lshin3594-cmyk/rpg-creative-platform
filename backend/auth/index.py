'''
Business: Регистрация, вход и управление аккаунтами игроков
Args: event с httpMethod, body (email, username, password)
Returns: JWT токен или ошибка
'''
import json
import os
import hashlib
import hmac
import base64
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.b64encode(salt + key).decode('utf-8')

def verify_password(stored_hash: str, password: str) -> bool:
    decoded = base64.b64decode(stored_hash.encode('utf-8'))
    salt = decoded[:32]
    stored_key = decoded[32:]
    new_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return hmac.compare_digest(stored_key, new_key)

def create_token(user_id: int, username: str) -> str:
    jwt_secret = os.environ.get('JWT_SECRET')
    if not jwt_secret:
        raise ValueError('JWT_SECRET not configured')
    
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, jwt_secret, algorithm='HS256')

def verify_token(token: str) -> Optional[Dict[str, Any]]:
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

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration error'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn, cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email', '').strip()
                username = body.get('username', '').strip()
                password = body.get('password', '')
                
                if not email or not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Все поля обязательны'}),
                        'isBase64Encoded': False
                    }
                
                if len(password) < 6:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пароль должен быть минимум 6 символов'}),
                        'isBase64Encoded': False
                    }
                
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
                if cursor.fetchone():
                    return {
                        'statusCode': 409,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email или имя пользователя уже заняты'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                cursor.execute(
                    "INSERT INTO users (email, username, password_hash, display_name) VALUES (%s, %s, %s, %s) RETURNING id, username, email, display_name, created_at",
                    (email, username, password_hash, username)
                )
                user = cursor.fetchone()
                conn.commit()
                
                token = create_token(user['id'], user['username'])
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'email': user['email'],
                            'display_name': user['display_name'],
                            'created_at': user['created_at'].isoformat() if user['created_at'] else None
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                login = body.get('login', '').strip()
                password = body.get('password', '')
                
                if not login or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Введите логин и пароль'}),
                        'isBase64Encoded': False
                    }
                
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, username, email, password_hash, display_name, avatar_url FROM users WHERE email = %s OR username = %s",
                    (login, login)
                )
                user = cursor.fetchone()
                
                if not user or not verify_password(user['password_hash'], password):
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный логин или пароль'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s", (user['id'],))
                conn.commit()
                
                token = create_token(user['id'], user['username'])
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'email': user['email'],
                            'display_name': user['display_name'],
                            'avatar_url': user['avatar_url']
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'verify':
                token = body.get('token', '')
                payload = verify_token(token)
                
                if not payload:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Недействительный токен'}),
                        'isBase64Encoded': False
                    }
                
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, username, email, display_name, avatar_url FROM users WHERE id = %s",
                    (payload['user_id'],)
                )
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь не найден'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'email': user['email'],
                            'display_name': user['display_name'],
                            'avatar_url': user['avatar_url']
                        }
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()