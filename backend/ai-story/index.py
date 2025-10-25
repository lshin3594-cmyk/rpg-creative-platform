'''
Business: AI story generation with character extraction using DeepSeek
Args: event with httpMethod, body containing user action and game settings
Returns: HTTP response with AI story continuation and extracted NPCs
'''

import json
import os
import re
from typing import Dict, Any, List
from openai import OpenAI
import httpx

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    user_action: str = body_data.get('action', '')
    game_settings: Dict = body_data.get('settings', {})
    history: List[Dict] = body_data.get('history', [])
    
    ai_response = generate_story_continuation(user_action, game_settings, history)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'text': ai_response['text'],
            'characters': ai_response['characters'],
            'episode': ai_response['episode']
        }, ensure_ascii=False)
    }

def generate_story_continuation(action: str, settings: Dict, history: List[Dict]) -> Dict[str, Any]:
    """
    Генерирует продолжение истории используя DeepSeek API
    """
    
    role = settings.get('role', 'hero')
    narrative_mode = settings.get('narrativeMode', 'third')
    setting_description = settings.get('setting', '')
    game_name = settings.get('name', 'Приключение')
    
    # Формируем системный промт
    system_prompt = build_system_prompt(role, narrative_mode, setting_description, game_name)
    
    # Формируем историю диалога
    messages = [{'role': 'system', 'content': system_prompt}]
    
    # Добавляем историю предыдущих сообщений
    for msg in history[-10:]:  # Берём последние 10 для контекста
        if msg['type'] == 'user':
            messages.append({'role': 'user', 'content': msg['content']})
        else:
            messages.append({'role': 'assistant', 'content': msg['content']})
    
    # Добавляем текущее действие
    messages.append({'role': 'user', 'content': action})
    
    try:
        # Вызываем DeepSeek API с увеличенным таймаутом
        http_client = httpx.Client(timeout=httpx.Timeout(60.0, connect=10.0))
        client = OpenAI(
            api_key=DEEPSEEK_API_KEY,
            base_url="https://api.deepseek.com",
            http_client=http_client,
            timeout=60.0
        )
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            max_tokens=600,
            temperature=0.7,
            stream=False
        )
        
        ai_text = response.choices[0].message.content
        
        # Извлекаем персонажей из текста
        characters = extract_characters(ai_text)
        
        return {
            'text': ai_text,
            'characters': characters,
            'episode': len(history) // 2 + 1
        }
        
    except Exception as e:
        error_name = type(e).__name__
        if 'Timeout' in error_name or 'timeout' in str(e).lower():
            print(f"DeepSeek timeout - using fallback: {e}")
        else:
            print(f"DeepSeek API error: {e}")
        return fallback_response(action, role, len(history))

def build_system_prompt(role: str, narrative_mode: str, setting: str, game_name: str) -> str:
    """
    Строит системный промт для DeepSeek в зависимости от настроек
    """
    
    base = f"Ты - ИИ-рассказчик, создающий захватывающую интерактивную историю '{game_name}'.\n\n"
    
    if setting:
        base += f"СЕТТИНГ ИГРЫ:\n{setting}\n\n"
    
    if role == 'author':
        base += "РОЛЬ ИГРОКА: Автор - игрок управляет сюжетом и всеми персонажами.\n"
        base += "Твоя задача: помогать развивать историю, предлагать повороты сюжета, описывать последствия.\n\n"
    else:
        base += "РОЛЬ ИГРОКА: Герой - игрок управляет главным персонажем.\n"
        base += "Твоя задача: описывать мир, управлять НПС, реагировать на действия героя.\n\n"
    
    if narrative_mode == 'first':
        base += "ПОВЕСТВОВАНИЕ: От первого лица (я вижу, я делаю).\n"
    elif narrative_mode == 'third':
        base += "ПОВЕСТВОВАНИЕ: От третьего лица (он/она видит, делает).\n"
    else:
        base += "ПОВЕСТВОВАНИЕ: От третьего лица, в важные моменты - от лица любовного интереса.\n"
    
    base += "\nПРАВИЛА:\n"
    base += "- Живой язык, эмоции, детали (запахи, звуки, мысли)\n"
    base += "- Персонажи ГОВОРЯТ, показывай диалоги и действия\n"
    base += "- Показывай, не рассказывай: 'сжал кулаки' вместо 'был зол'\n"
    base += "- Без цензуры, любые темы разрешены\n"
    base += "- Ответы 200-300 слов, атмосфера + диалог + интрига\n\n"
    
    base += "Формат нового персонажа:\n"
    base += "[NPC: Имя | Роль: кто он | Внешность: как выглядит]\n\n"
    
    return base

def extract_characters(text: str) -> List[Dict[str, str]]:
    """
    Извлекает персонажей из текста ИИ
    """
    characters = []
    
    # Ищем NPC в формате [NPC: ...]
    npc_pattern = r'\[NPC:\s*([^\|]+)\s*\|\s*Роль:\s*([^\|]+)\s*\|\s*Внешность:\s*([^\]]+)\]'
    matches = re.findall(npc_pattern, text)
    
    for match in matches:
        characters.append({
            'name': match[0].strip(),
            'role': match[1].strip(),
            'description': match[2].strip()
        })
    
    # Дополнительно ищем упоминания имён собственных
    name_pattern = r'([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?)\s+(?:сказал|произнёс|спросил|ответил|кивнул|улыбнулся)'
    name_matches = re.findall(name_pattern, text)
    
    existing_names = {c['name'] for c in characters}
    for name in name_matches:
        if name not in existing_names and len(name) > 2:
            characters.append({
                'name': name,
                'role': 'NPC',
                'description': 'Персонаж истории'
            })
            existing_names.add(name)
    
    return characters

def fallback_response(action: str, role: str, history_len: int) -> Dict[str, Any]:
    """
    Фоллбэк на случай ошибки API - простой, но атмосферный
    """
    if history_len == 0:
        text = (
            "Мир замер в ожидании. Где-то вдали слышится шум - голоса, шаги, эхо жизни. "
            "Воздух наполнен предчувствием перемен. Что-то важное вот-вот произойдёт.\n\n"
            f"*{action}*\n\n"
            "История началась. Что дальше?"
        )
        characters = []
    else:
        text = (
            f"*{action}*\n\n"
            "Мир отреагировал на ваши действия. Что-то изменилось, но полная картина пока не ясна. "
            "Возможно, стоит попробовать ещё раз или сделать что-то другое?"
        )
        characters = []
    
    return {
        'text': text,
        'characters': characters,
        'episode': history_len // 2 + 1
    }