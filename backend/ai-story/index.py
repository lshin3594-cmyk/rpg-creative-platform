'''
Business: AI story generation with character extraction using DeepSeek
Args: event with httpMethod, body containing user action and game settings
Returns: HTTP response with AI story continuation and extracted NPCs
'''

import json
import os
import re
import hashlib
import time
from typing import Dict, Any, List
from openai import OpenAI
import httpx

CLAUDE_API_KEY = os.environ.get('CLAUDE_API_KEY', '')
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')

# DeepSeek основной (работает из России без VPN)
# Claude доступен через env переменную USE_CLAUDE=true если захочешь через VPN
USE_CLAUDE = os.environ.get('USE_CLAUDE', 'false').lower() == 'true'
print(f'AI Provider: {"Claude via Anthropic API" if USE_CLAUDE else "DeepSeek"}')

# Кеш
CACHE: Dict[str, tuple] = {}
CACHE_TTL = 1800  # 30 минут

def get_cache_key(prompt: str) -> str:
    return hashlib.md5(prompt.encode('utf-8')).hexdigest()

def get_from_cache(key: str) -> Dict | None:
    if key in CACHE:
        cached_time, cached_value = CACHE[key]
        if time.time() - cached_time < CACHE_TTL:
            return cached_value
        else:
            del CACHE[key]
    return None

def save_to_cache(key: str, value: Dict):
    CACHE[key] = (time.time(), value)
    if len(CACHE) > 50:
        current_time = time.time()
        expired_keys = [k for k, (t, _) in CACHE.items() if current_time - t >= CACHE_TTL]
        for k in expired_keys:
            del CACHE[k]

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
    
    # Если это первый ход — даём более конкретную инструкцию
    if len(history) == 0:
        enhanced_action = f"{action}\n\nНачни историю ярко и захватывающе! Опиши атмосферу, представь главного героя (или героиню) через действия и диалоги. Сразу создай интригу или напряжение. Пиши живо, с эмоциями!"
        messages.append({'role': 'user', 'content': enhanced_action})
    else:
        messages.append({'role': 'user', 'content': action})
    
    # Проверяем кеш
    cache_key = get_cache_key(json.dumps(messages, ensure_ascii=False))
    cached = get_from_cache(cache_key)
    if cached:
        return cached
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            if USE_CLAUDE:
                # Claude через air.fail прокси (их кастомный формат)
                print(f"Claude API attempt {attempt + 1}/{max_retries}")
                
                # Конвертируем messages в один промпт
                prompt_parts = []
                for msg in messages:
                    role = msg['role']
                    content = msg['content']
                    if role == 'system':
                        prompt_parts.append(f"SYSTEM: {content}")
                    elif role == 'user':
                        prompt_parts.append(f"USER: {content}")
                    elif role == 'assistant':
                        prompt_parts.append(f"ASSISTANT: {content}")
                
                full_prompt = "\n\n".join(prompt_parts)
                
                # Используем официальный Anthropic API
                print(f"Using Anthropic API endpoint")
                response = httpx.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": CLAUDE_API_KEY,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "claude-3-5-sonnet-20241022",
                        "messages": messages,
                        "max_tokens": 600,
                        "temperature": 0.8
                    },
                    timeout=15.0
                )
                
                if response.status_code != 200:
                    raise Exception(f"Anthropic API error {response.status_code}: {response.text[:200]}")
                
                result_data = response.json()
                # Anthropic API возвращает другой формат
                ai_text = result_data['content'][0]['text']
                print(f"Claude API success, response length: {len(ai_text)}")
                
            else:
                # Fallback на DeepSeek
                print(f"DeepSeek API attempt {attempt + 1}/{max_retries}")
                
                timeout_config = httpx.Timeout(connect=10.0, read=45.0, write=10.0, pool=5.0)
                http_client = httpx.Client(timeout=timeout_config)
                
                client = OpenAI(
                    api_key=DEEPSEEK_API_KEY,
                    base_url="https://api.deepseek.com",
                    http_client=http_client,
                    timeout=45.0,
                    max_retries=0
                )
                
                response = client.chat.completions.create(
                    model="deepseek-chat",
                    messages=messages,
                    max_tokens=2000,
                    temperature=0.7,
                    stream=False
                )
                
                ai_text = response.choices[0].message.content
                print(f"DeepSeek API success, response length: {len(ai_text)}")
            
            # Извлекаем персонажей из текста
            characters = extract_characters(ai_text)
            
            result = {
                'text': ai_text,
                'characters': characters,
                'episode': len(history) // 2 + 1
            }
            
            # Сохраняем в кеш
            save_to_cache(cache_key, result)
            
            return result
            
        except Exception as e:
            error_name = type(e).__name__
            error_msg = str(e)
            provider = "Claude" if USE_CLAUDE else "DeepSeek"
            print(f"{provider} API attempt {attempt + 1} failed: {error_name} - {error_msg}")
            
            if attempt < max_retries - 1:
                print(f"Retrying... ({attempt + 2}/{max_retries})")
                continue
            else:
                print("All retries exhausted, using fallback")
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
    
    base += "\n🔥 ЗАДАЧА: Создать мир, события, сцену. Подвести к выбору.\n\n"
    
    base += "📖 СТИЛЬ: Литературный роман. Яркие описания, метафоры. 800-1200 символов.\n"
    base += "ЗАПРЕЩЕНО: |действие| *действие* (только проза). Эмоции через описания, не скобки.\n"
    base += "ПРИМЕР: ❌|хмурится| ✅нахмурился, глаза сузились\n\n"
    
    base += "💬 ДИАЛОГИ: Живая речь, мат разрешён. Каждый говорит по-своему.\n\n"
    
    base += "👥 NPC: Помнят всё, действуют сами. Запоминай и обновляй статус.\n\n"
    
    base += "⚠️ НЕ действуй за игрока! Только мир и NPC.\n\n"
    
    base += "⏰ ВРЕМЯ: Логичное, последовательное. Указывай точно (ЧЧ:ММ, дата). Длительность реальная: разговор 5-10мин, бой 5-15мин.\n\n"
    
    base += "🚫 БЕЗ ЦЕНЗУРЫ: насилие, секс, смерть, мат — всё разрешено.\n\n"
    
    base += "СТАТУС (журнал в начале каждого ответа):\n"
    base += "📊 СТАТУС ИСТОРИИ\n"
    base += "📍 Локация: [где именно]\n"
    base += "⏰ Время: [ЧЧ:ММ, дата, погода]\n"
    base += "🎬 События: [что произошло]\n"
    base += "👥 NPC: [Имя(отношение): что делает]\n"
    base += "💕 Отношения: [если изменились]\n"
    base += "🎒 Инвентарь: [если изменилось]\n"
    base += "===\n\n"
    
    base += "ИНВЕНТАРЬ: Реалистично отслеживай (взял→добавь, потратил→убери). Вес учитывай.\n\n"
    
    base += "[NPC: Имя | Роль: кто | Внешность: как]\n\n"
    
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
    Фоллбэк на случай ошибки API - даёт базовое продолжение
    """
    fallback_responses = [
        f"**{action}**\n\nДействие выполнено. Окружение реагирует на ваш шаг. Воздух наполнен напряжением, что-то должно произойти...",
        f"**{action}**\n\nВы делаете это. Тишина. Затем — реакция. Мир вокруг оживает, начинают происходить события...",
        f"**{action}**\n\nВаш выбор сделан. Последствия не заставят себя ждать. Что-то меняется в атмосфере...",
        f"**{action}**\n\nДействие завершено. Окружающий мир откликается. Впереди новые возможности и опасности...",
        f"**{action}**\n\nВы действуете решительно. Реальность вокруг начинает трансформироваться..."
    ]
    
    import random
    text = random.choice(fallback_responses)
    
    if history_len == 0:
        text = (
            "🌟 **История начинается**\n\n"
            f"{action}\n\n"
            "Мир оживает вокруг вас. Приключение только началось, и впереди множество возможностей. "
            "ИИ временно недоступен, но вы можете продолжить своё путешествие!"
        )
    
    return {
        'text': text,
        'characters': [],
        'episode': history_len // 2 + 1
    }