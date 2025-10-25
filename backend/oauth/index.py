'''
Business: OAuth авторизация через VK и Telegram
Args: event с httpMethod, body (provider, code/auth_data)
Returns: JWT токен или redirect URL
'''
import json
import os
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlencode
import urllib.request

def create_token(user_id: int, username: str) -> str:
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': (datetime.utcnow() + timedelta(days=30)).isoformat()
    }
    token_str = json.dumps(payload)
    return base64.b64encode(token_str.encode()).decode()

def verify_telegram_auth(auth_data: Dict[str, Any], bot_token: str) -> bool:
    check_hash = auth_data.pop('hash', None)
    if not check_hash:
        return False
    
    data_check_arr = [f'{k}={v}' for k, v in sorted(auth_data.items())]
    data_check_string = '\n'.join(data_check_arr)
    
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    return calculated_hash == check_hash

def get_vk_user_info(access_token: str) -> Optional[Dict[str, Any]]:
    try:
        url = f'https://api.vk.com/method/users.get?access_token={access_token}&v=5.131&fields=photo_200'
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())
            if 'response' in data and len(data['response']) > 0:
                return data['response'][0]
    except:
        pass
    return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    vk_app_id = os.environ.get('VK_APP_ID')
    vk_app_secret = os.environ.get('VK_APP_SECRET')
    telegram_bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    
    conn = psycopg2.connect(dsn, cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            provider = body.get('provider')
            
            if provider == 'vk':
                code = body.get('code')
                redirect_uri = body.get('redirect_uri')
                
                if not code or not vk_app_id or not vk_app_secret:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing VK credentials'})
                    }
                
                token_url = f'https://id.vk.com/oauth2/auth'
                token_params = {
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': redirect_uri,
                    'client_id': vk_app_id,
                    'client_secret': vk_app_secret
                }
                token_request = urllib.request.Request(
                    token_url,
                    data=urlencode(token_params).encode(),
                    headers={'Content-Type': 'application/x-www-form-urlencoded'}
                )
                
                try:
                    with urllib.request.urlopen(token_request) as response:
                        token_data = json.loads(response.read())
                except Exception as e:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'VK request failed: {str(e)}'})
                    }
                
                if 'access_token' not in token_data:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'VK auth failed', 'details': token_data})
                    }
                
                vk_user_id = str(token_data.get('user_id', token_data.get('user', {}).get('user_id', '')))
                user_info_data = token_data.get('user', {})
                user_info = {
                    'first_name': user_info_data.get('first_name', ''),
                    'last_name': user_info_data.get('last_name', ''),
                    'photo_200': user_info_data.get('avatar', '')
                } if user_info_data else None
                
                cursor = conn.cursor()
                cursor.execute("SELECT id, username, email FROM users WHERE vk_id = %s", (vk_user_id,))
                user = cursor.fetchone()
                
                if user:
                    token = create_token(user['id'], user['username'])
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': token,
                            'user': {
                                'id': user['id'],
                                'username': user['username'],
                                'email': user['email']
                            }
                        })
                    }
                else:
                    username = f'vk_{vk_user_id}'
                    email = f'vk_{vk_user_id}@vk.com'
                    display_name = user_info.get('first_name', '') + ' ' + user_info.get('last_name', '') if user_info else username
                    avatar_url = user_info.get('photo_200') if user_info else None
                    
                    cursor.execute(
                        """INSERT INTO users (email, username, password_hash, display_name, avatar_url, vk_id, auth_provider) 
                           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, username, email""",
                        (email, username, '', display_name, avatar_url, vk_user_id, 'vk')
                    )
                    new_user = cursor.fetchone()
                    conn.commit()
                    
                    token = create_token(new_user['id'], new_user['username'])
                    return {
                        'statusCode': 201,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': token,
                            'user': {
                                'id': new_user['id'],
                                'username': new_user['username'],
                                'email': new_user['email']
                            }
                        })
                    }
            
            elif provider == 'telegram':
                auth_data = body.get('auth_data', {})
                
                if not telegram_bot_token or not verify_telegram_auth(auth_data.copy(), telegram_bot_token):
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Telegram auth verification failed'})
                    }
                
                telegram_id = str(auth_data.get('id'))
                username = auth_data.get('username', f'tg_{telegram_id}')
                first_name = auth_data.get('first_name', '')
                last_name = auth_data.get('last_name', '')
                photo_url = auth_data.get('photo_url')
                
                cursor = conn.cursor()
                cursor.execute("SELECT id, username, email FROM users WHERE telegram_id = %s", (telegram_id,))
                user = cursor.fetchone()
                
                if user:
                    token = create_token(user['id'], user['username'])
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': token,
                            'user': {
                                'id': user['id'],
                                'username': user['username'],
                                'email': user['email']
                            }
                        })
                    }
                else:
                    email = f'tg_{telegram_id}@telegram.org'
                    display_name = f'{first_name} {last_name}'.strip() or username
                    
                    cursor.execute(
                        """INSERT INTO users (email, username, password_hash, display_name, avatar_url, telegram_id, auth_provider) 
                           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, username, email""",
                        (email, username, '', display_name, photo_url, telegram_id, 'telegram')
                    )
                    new_user = cursor.fetchone()
                    conn.commit()
                    
                    token = create_token(new_user['id'], new_user['username'])
                    return {
                        'statusCode': 201,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({
                            'token': token,
                            'user': {
                                'id': new_user['id'],
                                'username': new_user['username'],
                                'email': new_user['email']
                            }
                        })
                    }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            provider = params.get('provider')
            redirect_uri = params.get('redirect_uri', 'https://your-domain.com/auth/callback')
            
            if provider == 'vk' and vk_app_id:
                auth_url = f'https://oauth.vk.com/authorize?client_id={vk_app_id}&display=page&redirect_uri={redirect_uri}&response_type=code&v=5.131'
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'url': auth_url})
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid request'})
        }
    
    finally:
        conn.close()