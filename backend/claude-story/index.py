import json
import os
import hashlib
import time
from typing import Dict, Any

# Простой in-memory кеш (живёт между запросами в одном контейнере)
CACHE: Dict[str, tuple] = {}
CACHE_TTL = 3600  # 1 час
CACHE_STATS = {'hits': 0, 'misses': 0}  # Статистика

def get_cache_key(prompt: str) -> str:
    """Создаёт хеш-ключ для кеша"""
    return hashlib.md5(prompt.encode('utf-8')).hexdigest()

def get_from_cache(key: str) -> str | None:
    """Получает ответ из кеша если он свежий"""
    import sys
    if key in CACHE:
        cached_time, cached_value = CACHE[key]
        if time.time() - cached_time < CACHE_TTL:
            CACHE_STATS['hits'] += 1
            hit_rate = CACHE_STATS['hits']/(CACHE_STATS['hits']+CACHE_STATS['misses'])*100
            print(f"CACHE HIT! Stats: {CACHE_STATS['hits']} hits, {CACHE_STATS['misses']} misses, hit rate: {hit_rate:.1f}%", file=sys.stderr)
            return cached_value
        else:
            del CACHE[key]
    CACHE_STATS['misses'] += 1
    return None

def save_to_cache(key: str, value: str):
    """Сохраняет ответ в кеш"""
    CACHE[key] = (time.time(), value)
    # Чистим старые записи если кеш разросся
    if len(CACHE) > 100:
        current_time = time.time()
        expired_keys = [k for k, (t, _) in CACHE.items() if current_time - t >= CACHE_TTL]
        for k in expired_keys:
            del CACHE[k]

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация интерактивных историй через GPT-4o API
    Args: event с httpMethod, body (genre, setting, difficulty, userAction, history, gameId)
    Returns: HTTP response с новым сюжетом
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('CLAUDE_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'CLAUDE_API_KEY not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    genre = body_data.get('genre', 'фэнтези')
    setting = body_data.get('setting', 'средневековье')
    difficulty = body_data.get('difficulty', 'medium')
    user_action = body_data.get('userAction', '')
    history = body_data.get('history', [])
    characters_list = body_data.get('characters', [])
    setting_description = body_data.get('settingDescription', '')
    
    # Формируем список существующих NPC для контроля
    existing_npcs = [c.get('name', '') for c in characters_list if c.get('name')]
    npc_context = f"\n\n🔒 СУЩЕСТВУЮЩИЕ ПЕРСОНАЖИ: {', '.join(existing_npcs)}" if existing_npcs else ""
    
    # Усиленный промпт с жёсткими ограничениями
    base_rules = f"""🎭 ЖАНР: {genre}
🌍 СЕТТИНГ: {setting}
{f"📖 ОПИСАНИЕ МИРА: {setting_description}" if setting_description else ""}
⚙️ СЛОЖНОСТЬ: {difficulty}
{npc_context}

🚨 АБСОЛЮТНЫЕ ЗАПРЕТЫ (НАРУШЕНИЕ = ПРОВАЛ):
❌ НЕ СМЕЙ добавлять персонажей вне сеттинга "{setting}"
❌ НЕ СМЕЙ добавлять магию/технологии если их НЕТ в сеттинге
❌ НЕ СМЕЙ менять жанр или атмосферу
❌ НЕ СМЕЙ использовать клише из других вселенных
❌ НЕ СМЕЙ игнорировать описание мира игрока
❌ НЕ СМЕЙ вводить новых NPC без крайней необходимости

✅ ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА:
✅ Следуй ТОЛЬКО элементам из сеттинга "{setting}"
✅ Новые NPC должны ОРГАНИЧНО вписываться в мир
✅ Если сеттинг реалистичный - никакой магии/фантастики
✅ Если сеттинг фантастический - используй ЕГО правила, не выдумывай новые
✅ Действия NPC должны иметь логичную мотивацию
✅ Мир реагирует на действия игрока последовательно
✅ NPC помнят прошлые взаимодействия с игроком"""
    
    if not history:
        system_prompt = f"""{base_rules}

📝 ЗАДАЧА: Создай захватывающее начало истории (200-250 слов):
- Опиши яркую сцену из мира "{setting}"
- Представь атмосферу через детали
- Введи 1-2 NPC если нужно (ТОЛЬКО из этого сеттинга!)
- Создай интригу или напряжение
- Дай игроку понятный выбор действий

🎯 СТИЛЬ: Живой язык, эмоции, погружение. БЕЗ клише."""
        
        user_prompt = f"Начни интерактивную историю в жанре {genre}, сеттинг: {setting}. Строго следуй правилам!"
    else:
        # Берём последние 2 хода для контекста
        recent_history = history[-2:] if len(history) >= 2 else history
        context_parts = []
        for turn in recent_history:
            if isinstance(turn, dict):
                ai_text = turn.get('ai', '')[:150]
                player_text = turn.get('player', '')[:100]
                if ai_text:
                    context_parts.append(f"ИИ: {ai_text}")
                if player_text:
                    context_parts.append(f"Игрок: {player_text}")
        
        context = "\n".join(context_parts) if context_parts else "Нет истории"
        
        system_prompt = f"""{base_rules}

📜 КОНТЕКСТ ИСТОРИИ:
{context}

🎮 ДЕЙСТВИЕ ИГРОКА: {user_action}

📝 ЗАДАЧА: Опиши результат действия (200-250 слов):
- Последствия должны ЛОГИЧНО вытекать из действия
- NPC реагируют согласно их характерам и мотивации
- Учитывай ВСЮ предыдущую историю
- Создавай развитие сюжета, не топчись на месте
- Добавляй новых NPC ТОЛЬКО если это критически важно
- Новые NPC должны быть ИЗ СЕТТИНГА "{setting}"

🎯 СТИЛЬ: Динамично, эмоционально, без воды. Покажи мир через действия."""
        
        user_prompt = f"Продолжи историю на основе действия игрока. СТРОГО следуй сеттингу {setting}!"
    
    # Проверяем кеш
    full_prompt = f"{system_prompt}\n\n{user_prompt}"
    cache_key = get_cache_key(full_prompt)
    cached_response = get_from_cache(cache_key)
    
    if cached_response:
        import sys
        print(f"Returning cached response, cache size: {len(CACHE)}", file=sys.stderr)
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Cache': 'HIT',
                'X-Cache-Size': str(len(CACHE))
            },
            'body': json.dumps({'story': cached_response}),
            'isBase64Encoded': False
        }
    
    # Запрос к GPT-4o через air.fail
    import urllib.request
    import urllib.error
    import urllib.parse
    
    api_url = "https://api.air.fail/public/text/chatgpt"
    
    form_data = {
        "content": f"{system_prompt}\n\n{user_prompt}",
        "info": json.dumps({
            "version": "gpt-4o",
            "temperature": 0.7,
            "max_tokens": 500
        })
    }
    
    data = urllib.parse.urlencode(form_data).encode('utf-8')
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': api_key
    }
    
    req = urllib.request.Request(
        api_url,
        data=data,
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            # Логируем что получили
            import sys
            print(f"air.fail response type: {type(result)}", file=sys.stderr)
            print(f"air.fail response: {json.dumps(result) if not isinstance(result, str) else result[:200]}", file=sys.stderr)
            
            # air.fail возвращает список сообщений
            if isinstance(result, list) and result:
                story_text = result[-1].get('content', '') if isinstance(result[-1], dict) else str(result[-1])
            elif isinstance(result, dict):
                story_text = result.get('content') or result.get('response') or result.get('text', '')
            else:
                story_text = str(result)
            
            # Финальная проверка
            if not story_text or len(story_text.strip()) < 10:
                story_text = f"Ошибка: некорректный ответ API. Тип: {type(result)}, данные: {str(result)[:200]}"
            
            # Сохраняем в кеш
            save_to_cache(cache_key, story_text)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'X-Cache': 'MISS'
                },
                'body': json.dumps({'story': story_text}),
                'isBase64Encoded': False
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'GPT API error: {error_body}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'}),
            'isBase64Encoded': False
        }