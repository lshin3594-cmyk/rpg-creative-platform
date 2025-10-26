import json
import os
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получить список доступных моделей из air.fail
    Args: event с httpMethod
    Returns: HTTP response со списком моделей
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    api_key = os.environ.get('CLAUDE_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'CLAUDE_API_KEY not configured'})
        }
    
    api_url = "https://api.air.fail/public/text"
    
    headers = {
        'Authorization': api_key
    }
    
    req = urllib.request.Request(
        api_url,
        headers=headers,
        method='GET'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            models = json.loads(response.read().decode('utf-8'))
            
            # Ищем DeepSeek
            deepseek_models = [m for m in models if 'deepseek' in m.get('slug', '').lower() or 'deepseek' in m.get('title', '').lower()]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(deepseek_models, ensure_ascii=False)
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }