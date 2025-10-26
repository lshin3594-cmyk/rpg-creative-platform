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
                npc_scenes = npc.get('scenes', '')
                npc_quotes = npc.get('quotes', '')
                npc_ideas = npc.get('ideas', '')
                
                npc_info = f"{npc_name} ({npc_role})"
                if npc_desc:
                    npc_info += f"\n  Описание: {npc_desc}"
                if npc_scenes:
                    npc_info += f"\n  Сцены: {npc_scenes}"
                if npc_quotes:
                    npc_info += f"\n  Фразы: {npc_quotes}"
                if npc_ideas:
                    npc_info += f"\n  Идеи: {npc_ideas}"
                
                npc_descriptions.append(npc_info)
            npc_str = '\n\n'.join(npc_descriptions)
        else:
            npc_str = 'Создай интересных NPC по ходу истории'
        
        pov_instruction = {
            'first': f'От первого лица ({mc_name}). ИГРОК ИГРАЕТ ЗА {mc_name.upper()}.',
            'third': f'От третьего лица. ИГРОК КОНТРОЛИРУЕТ {mc_name.upper()}.',
            'love-interest': f'Романтический интерес. Игрок влюбляется в {mc_name}.'
        }.get(narrative_mode, f'Игрок управляет {mc_name}')
        
        system_prompt = f"""ТЫ — ведущий интерактивной игры. Жанр: {genre}. Рейтинг: {rating}. Мир: {world_setting or 'фэнтези'}

ПЕРСОНАЖИ:
• {mc_name} ({mc_role}) — ИГРОК. ⚠️ НИКОГДА не пиши за него!
{f'  Описание: {mc_desc}' if mc_desc else ''}
• NPC (ты за них играешь):
{npc_str}

NPC — ЖИВЫЕ:
• Игрок может описать NPC в сеттинге: сцены 📽️, цитаты 💬, идеи ✨, отношение к ГГ 💖
• Отношение к ГГ — мнение, чувства, реакции NPC (публичные/тайные, меняющиеся)
• ВАЖНО: если указано отношение — используй его! NPC ведёт себя согласно описанию
• NPC реагируют на действия {mc_name}: помнят, злятся, влюбляются, мстят
• У NPC свои цели, секреты, мотивы — не все любят героя
• Решения игрока меняют отношения: помог → +доверие, предал → -доверие/месть

СТИЛЬ:
• Живо, с иронией, разговорный язык, иногда мат
• Диалоги уникальны для каждого NPC (свой голос, манеры)
• Показывай эмоции через действия: краснеет, сжимает кулаки, отворачивается
• Детали: запахи, звуки, мимика
• Избегай штампов ("сердце билось", "глаза загорелись")

СЮЖЕТ:
• Дай игроку выбор — не навязывай путь
• Мир реагирует логично и непредсказуемо
• Последствия могут быть отсроченными

РЕЙТИНГ {rating}: без цензуры, если уместно. Мат естественно.

ФОРМАТ:
**[МЕТА]**
⏰ Время/место: [конкретно]
🎬 События: [2-3 ключевых]
💕 Отношения: {mc_name} с NPC (-100 до +100, изменение)
🧠 Эмоции NPC: [состояние]
🔍 Факты: [что узнали]
⚔️ Ситуация: [враги/союзники/ресурсы]
🎯 Варианты: [2-3 подсказки игроку]

---

[ИСТОРИЯ: 3-7 абзацев. Диалоги + описания + атмосфера. 600-1200 слов. НЕ ПИШИ ЗА {mc_name}!]

Заканчивай на моменте выбора или вопросе к игроку."""
        
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