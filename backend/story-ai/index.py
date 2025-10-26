"""
Business: Генерация игровых историй через DeepSeek API
Args: event с httpMethod, body (game_data, user_action, history)
Returns: HTTP response с сгенерированной историей
"""

import json
import os
import hashlib
import time
from typing import Dict, Any
import requests

# Кеш
CACHE: Dict[str, tuple] = {}
CACHE_TTL = 1800  # 30 минут

def get_cache_key(prompt: str) -> str:
    return hashlib.md5(prompt.encode('utf-8')).hexdigest()

def get_from_cache(key: str) -> str | None:
    if key in CACHE:
        cached_time, cached_value = CACHE[key]
        if time.time() - cached_time < CACHE_TTL:
            return cached_value
        else:
            del CACHE[key]
    return None

def save_to_cache(key: str, value: str):
    CACHE[key] = (time.time(), value)
    if len(CACHE) > 50:
        current_time = time.time()
        expired_keys = [k for k, (t, _) in CACHE.items() if current_time - t >= CACHE_TTL]
        for k in expired_keys:
            del CACHE[k]

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
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
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
        body_data = json.loads(event.get('body', '{}'))
        
        game_settings = body_data.get('game_settings', {})
        user_action = body_data.get('user_action', '')
        history = body_data.get('history', [])
        
        genre = game_settings.get('genre', 'фэнтези')
        setting = body_data.get('setting', '')
        characters = game_settings.get('initialCharacters', [])
        rating = game_settings.get('rating', '18+')
        narrative_mode = game_settings.get('narrativeMode', 'third')
        role = game_settings.get('role', 'hero')
        world_setting = body_data.get('setting', '')
        
        main_char = characters[0] if characters else None
        mc_name = main_char.get('name', 'Игрок') if main_char else 'Игрок'
        mc_role = main_char.get('role', 'герой') if main_char else 'герой'
        mc_desc = main_char.get('description', '') if main_char else ''
        
        npc_list = characters[1:] if len(characters) > 1 else []
        npc_str = ''
        if npc_list:
            npc_descriptions = []
            for npc in npc_list[:5]:
                npc_name = npc.get('name', '')
                npc_role = npc.get('role', '')
                npc_desc = npc.get('description', '')
                npc_descriptions.append(f"{npc_name} ({npc_role}): {npc_desc if npc_desc else 'персонаж из мира'}")
            npc_str = '\n'.join(npc_descriptions)
        else:
            npc_str = 'Создай интересных NPC по ходу истории'
        
        pov_instruction = {
            'first': f'От первого лица ({mc_name}). ИГРОК ИГРАЕТ ЗА {mc_name.upper()}.',
            'third': f'От третьего лица. ИГРОК КОНТРОЛИРУЕТ {mc_name.upper()}.',
            'love-interest': f'Романтический интерес. Игрок влюбляется в {mc_name}.'
        }.get(narrative_mode, f'Игрок управляет {mc_name}')
        
        system_prompt = f"""ТЫ ТАЛАНТЛИВЫЙ ПИСАТЕЛЬ И ВЕДУЩИЙ ИНТЕРАКТИВНОЙ ИГРЫ.

Жанр: {genre}. Рейтинг: {rating}. Мир: {world_setting or 'фэнтези'}

ГЛАВНЫЙ ПЕРСОНАЖ (управляется игроком):
• Имя: {mc_name}
• Роль: {mc_role}
{f'• Описание: {mc_desc}' if mc_desc else ''}
• ⚠️ КРИТИЧНО: НИКОГДА не пиши действия/мысли/слова за {mc_name}!

NPC (ты играешь за них, создай их в мире):
{npc_str}

ВАЖНО ПРО NPC: Если указаны конкретные NPC выше — используй их в истории, создай для них роли в мире, дай им характер и мотивацию. Если NPC не указаны — создавай новых персонажей по ходу сюжета.

Повествование: {pov_instruction}

СТИЛЬ ПОВЕСТВОВАНИЯ:
• Пиши как современный автор: живо, с характером, с иронией
• Используй разговорный язык, сленг, местами мат (по контексту)
• Диалоги НПС должны быть УНИКАЛЬНЫМИ: у каждого свой голос, манеры, речевые привычки
• Описывай детали: запахи, звуки, тактильные ощущения, мимику, жесты
• Добавляй юмор даже в серьёзные моменты (как Witcher, Guardians of Galaxy)
• Эмоции персонажей показывай через действия, не называй прямо
• Избегай штампов типа "сердце бешено билось", "глаза загорелись" — будь креативнее

ЛИТЕРАТУРНЫЕ ПРИЁМЫ (используй активно):
• Метафоры и сравнения (свежие, не избитые)
• Сарказм и ирония в диалогах НПС
• Контраст (серьёзное с абсурдным)
• Недосказанность и подтекст
• Показывай, не рассказывай (show, don't tell)

ПЕРСОНАЖИ:
• НПС — ЖИВЫЕ ЛЮДИ с желаниями, страхами, противоречиями
• Они НЕ картонки: спорят, ошибаются, меняют мнение
• Помнят прошлые взаимодействия с {mc_name}
• Имеют свои мотивы, не всегда очевидные игроку

СЮЖЕТ И СВОБОДА:
• НЕ навязывай единственный путь — дай игроку выбор
• Мир РЕАГИРУЕТ на действия {mc_name} логично и непредсказуемо
• Последствия могут быть отсроченными
• Неожиданные повороты > предсказуемость

РЕЙТИНГ {rating}:
• БЕЗ ЦЕНЗУРЫ: насилие, секс, наркотики — всё подробно, если уместно
• Интимные сцены: детально, эмоционально, не порнографично
• Мат использовать естественно, не через слово

ДЛИНА И ТЕМП:
• 600-1200 слов на ход (подробно, но динамично)
• Меняй темп: быстро в экшене, медленно в драме
• Заканчивай на крючке или вопросе к игроку

ФОРМАТ ОТВЕТА:
**[МЕТА]**
⏰ Время/место: [конкретно: "23:47, подвал заброшенной фабрики"]
🎬 События: [2-3 ключевых события хода, кратко]
💕 Отношения: {mc_name} с НПС (число от -100 до +100, изменение +/-)
🧠 Эмоции: [состояние НПС, НЕ {mc_name}]
🔍 Новые факты: [что узнали]
⚔️ Ситуация: [враги, союзники, ресурсы если актуально]
❓ Открытые вопросы: [что непонятно]
🎯 Возможные действия: [подсказки игроку, 2-3 варианта]

---

[ИСТОРИЯ: Ярко, подробно, живо. 3-7 абзацев. Диалоги + описания + атмосфера. НЕ ПИШИ ЗА {mc_name}!]

В конце ОБЯЗАТЕЛЬНО подведи к моменту выбора или реакции {mc_name}."""
        
        messages = [{'role': 'system', 'content': system_prompt}]
        
        for entry in history[-8:]:
            messages.append({'role': 'user', 'content': entry.get('user', '')})
            messages.append({'role': 'assistant', 'content': entry.get('ai', '')})
        
        if user_action:
            if '@[МЕТА-КОМАНДА]:' in user_action:
                meta_cmd, player_action = user_action.split('\n\n', 1)
                meta_text = meta_cmd.replace('@[МЕТА-КОМАНДА]:', '').strip()
                messages.append({'role': 'user', 'content': f"🎨 СТИЛИСТИЧЕСКАЯ ИНСТРУКЦИЯ: {meta_text}\n\n{mc_name}: {player_action}"})
            else:
                messages.append({'role': 'user', 'content': f"{mc_name}: {user_action}"})
        else:
            messages.append({'role': 'user', 'content': "Начни игру. Первая сцена должна ЗАЦЕПИТЬ: атмосфера, загадка, конфликт или яркий персонаж."})
        
        # Проверяем кеш
        cache_key = get_cache_key(json.dumps(messages, ensure_ascii=False))
        cached = get_from_cache(cache_key)
        if cached:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'X-Cache': 'HIT'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'story': cached})
            }
        
        api_key = os.environ.get('DEEPSEEK_API_KEY')
        
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DeepSeek API key not configured'})
            }
        
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': messages,
                'temperature': 0.9,
                'max_tokens': 2000,
                'top_p': 0.95,
                'frequency_penalty': 0.3,
                'presence_penalty': 0.3
            },
            timeout=30
        )
        
        if not response.ok:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'DeepSeek API error: {response.text}'})
            }
        
        result = response.json()
        story_text = result['choices'][0]['message']['content']
        
        # Сохраняем в кеш
        save_to_cache(cache_key, story_text)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Cache': 'MISS'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'story': story_text})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Error: {str(e)}'})
        }