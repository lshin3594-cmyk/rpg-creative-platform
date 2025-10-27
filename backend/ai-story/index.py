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

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')

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
            'episode': ai_response['episode'],
            'decisionAnalysis': ai_response.get('decisionAnalysis', {})
        }, ensure_ascii=False)
    }

def analyze_player_decision(action: str, history: List[Dict]) -> Dict[str, Any]:
    """
    Анализирует слова игрока и определяет ключевые решения/тон
    """
    action_lower = action.lower()
    
    emotional_tone = 'neutral'
    if any(word in action_lower for word in ['атакую', 'убью', 'нападаю', 'бью', 'уничтожу']):
        emotional_tone = 'aggressive'
    elif any(word in action_lower for word in ['помогаю', 'спасаю', 'поддержу', 'друг', 'согласен']):
        emotional_tone = 'friendly'
    elif any(word in action_lower for word in ['осторожно', 'прячусь', 'жду', 'проверю', 'подозреваю']):
        emotional_tone = 'cautious'
    elif any(word in action_lower for word in ['целую', 'обнимаю', 'люблю', 'признаюсь', 'флиртую', 'нравишься']):
        emotional_tone = 'romantic'
    
    is_major_choice = any(word in action_lower for word in [
        'решаю', 'выбираю', 'приезжаю', 'уезжаю', 'соглашаюсь', 'отказываюсь',
        'убиваю', 'спасаю', 'предаю', 'доверяю', 'люблю', 'ненавижу'
    ])
    
    return {
        'emotionalTone': emotional_tone,
        'isMajorChoice': is_major_choice,
        'playerWords': action
    }

def generate_story_continuation(action: str, settings: Dict, history: List[Dict]) -> Dict[str, Any]:
    """
    Генерирует продолжение истории используя выбранную AI модель
    """
    
    role = settings.get('role', 'hero')
    narrative_mode = settings.get('narrativeMode', 'third')
    setting_description = settings.get('setting', '')
    game_name = settings.get('name', 'Приключение')
    story_memory = settings.get('storyMemory', {'keyMoments': [], 'characterRelationships': {}, 'worldChanges': []})
    print('AI Model: DeepSeek')
    
    decision_analysis = analyze_player_decision(action, history)
    
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
    
    # Если это первый ход — даём МАКСИМАЛЬНО жёсткую инструкцию
    if len(history) == 0:
        if setting_description:
            # КРИТИЧЕСКИ ВАЖНО: Повторяем сеттинг несколько раз чтобы ИИ точно понял
            enhanced_action = f"🌍 МИР ИГРЫ (СВЯЩЕННОЕ ПРАВИЛО №1):\n{setting_description}\n\n"
            enhanced_action += f"🎮 ДЕЙСТВИЕ ИГРОКА: {action}\n\n"
            
            enhanced_action += "🚨 АБСОЛЮТНЫЕ ЗАПРЕТЫ (НАРУШЕНИЕ = ПРОВАЛ ЗАДАНИЯ):\n"
            enhanced_action += f"❌ НЕ СМЕЙ добавлять персонажей НЕ из сеттинга '{setting_description}'\n"
            enhanced_action += "❌ НЕ СМЕЙ добавлять магию, технологии, существ если их НЕТ в сеттинге\n"
            enhanced_action += "❌ НЕ СМЕЙ менять жанр, тон или атмосферу мира игрока\n"
            enhanced_action += "❌ НЕ СМЕЙ использовать клише, элементы из других вселенных\n"
            enhanced_action += "❌ НЕ СМЕЙ придумывать элементы, которых нет в описании мира\n"
            enhanced_action += "❌ НЕ СМЕЙ смешивать реализм с фантастикой если это не указано\n\n"
            
            enhanced_action += f"✅ СВЯЩЕННЫЕ ПРАВИЛА (ОБЯЗАТЕЛЬНО К ИСПОЛНЕНИЮ):\n"
            enhanced_action += f"✅ История начинается ТОЛЬКО в мире: '{setting_description}'\n"
            enhanced_action += "✅ Используй ИСКЛЮЧИТЕЛЬНО элементы из сеттинга игрока\n"
            enhanced_action += "✅ Если сеттинг реалистичный → пиши РЕАЛИСТИЧНО, без магии\n"
            enhanced_action += "✅ Если сеттинг фантастический → используй ТОЛЬКО ЕГО правила\n"
            enhanced_action += "✅ NPC должны быть частью ЭТОГО мира, не другого\n"
            enhanced_action += "✅ Перечитай сеттинг перед ответом и следуй ему на 100%\n\n"
            
            enhanced_action += "🎭 ЗАДАЧА:\n"
            enhanced_action += f"Начни захватывающую историю В МИРЕ '{setting_description}':\n"
            enhanced_action += "- Опиши атмосферу ЭТОГО мира через детали\n"
            enhanced_action += "- Введи 1-2 NPC если нужно (ТОЛЬКО из этого сеттинга!)\n"
            enhanced_action += "- Создай интригу используя ЭЛЕМЕНТЫ СЕТТИНГА ИГРОКА\n"
            enhanced_action += "- Пиши ярко, живо, эмоционально\n"
            enhanced_action += "- 800-1200 символов, литературный стиль\n\n"
            
            enhanced_action += f"⚠️ ПОСЛЕДНЕЕ НАПОМИНАНИЕ: Мир игры = '{setting_description}'. НЕ отклоняйся!"
        else:
            enhanced_action = f"{action}\n\n🎯 ЗАДАЧА: Начни яркую историю!\n"
            enhanced_action += "- Опиши захватывающую атмосферу\n"
            enhanced_action += "- Представь героя через действия и диалоги\n"
            enhanced_action += "- Создай интригу или напряжение\n"
            enhanced_action += "- Пиши живо, с эмоциями!\n"
            enhanced_action += "- 800-1200 символов"
        messages.append({'role': 'user', 'content': enhanced_action})
    else:
        memory_context = ""
        if story_memory.get('keyMoments') and len(story_memory['keyMoments']) > 0:
            memory_context += "\n\n🧠 ПАМЯТЬ ИГРЫ (ключевые моменты):\n"
            for moment in story_memory['keyMoments'][-3:]:
                memory_context += f"• Ход {moment['turn']}: Игрок {moment['playerAction']} → {moment['consequence']}\n"
        
        if story_memory.get('characterRelationships'):
            memory_context += "\n💞 ОТНОШЕНИЯ С ПЕРСОНАЖАМИ:\n"
            for char_name, relation in story_memory['characterRelationships'].items():
                relation_text = "враждебные" if relation < -50 else "напряженные" if relation < 0 else "нейтральные" if relation < 50 else "дружеские" if relation < 80 else "романтические"
                memory_context += f"• {char_name}: {relation_text} ({relation})\n"
        
        if decision_analysis['isMajorChoice']:
            memory_context += f"\n⚡ ВАЖНОЕ РЕШЕНИЕ ИГРОКА (тон: {decision_analysis['emotionalTone']})\n"
            memory_context += "ОБЯЗАТЕЛЬНО учти это решение и сделай ЗНАЧИМЫЕ последствия!\n"
        
        # В процессе игры ПОСТОЯННО напоминаем про сеттинг (каждые 2 хода)
        if setting_description and len(history) % 2 == 0:
            action_with_reminder = f"{action}{memory_context}\n\n🚨 НАПОМИНАНИЕ О СЕТТИНГЕ:\n"
            action_with_reminder += f"Игра идёт в мире: {setting_description}\n"
            action_with_reminder += "❌ НЕ СМЕЙ добавлять элементы из других вселенных\n"
            action_with_reminder += "❌ НЕ СМЕЙ менять правила этого мира\n"
            action_with_reminder += "✅ Следуй ТОЛЬКО сеттингу игрока\n"
            action_with_reminder += "✅ NPC действуют согласно ЭТОМУ миру"
            messages.append({'role': 'user', 'content': action_with_reminder})
        else:
            messages.append({'role': 'user', 'content': action + memory_context})
    
    # Проверяем кеш
    cache_key = get_cache_key(json.dumps(messages, ensure_ascii=False))
    cached = get_from_cache(cache_key)
    if cached:
        return cached
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
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
                'episode': len(history) // 2 + 1,
                'decisionAnalysis': decision_analysis
            }
            
            # Сохраняем в кеш
            save_to_cache(cache_key, result)
            
            return result
            
        except Exception as e:
            error_name = type(e).__name__
            error_msg = str(e)
            print(f"DeepSeek API attempt {attempt + 1} failed: {error_name} - {error_msg}")
            
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
        base += f"═══ СЕТТИНГ ИГРОКА (СТРОГО СЛЕДУЙ ЭТОМУ) ═══\n{setting}\n═══════════════════════════════════════════\n\n"
        base += "🚨 АБСОЛЮТНОЕ ПРАВИЛО №1 - ВЕРНОСТЬ СЕТТИНГУ:\n"
        base += "✅ Ты ОБЯЗАН использовать ТОЛЬКО тот мир, персонажей, локации и правила, которые игрок описал в сеттинге выше\n"
        base += "✅ ЗАПРЕЩЕНО добавлять персонажей из других вселенных (даже если они 'похожи')\n"
        base += "✅ ЗАПРЕЩЕНО менять мир игрока на известные франшизы\n"
        base += "✅ ЗАПРЕЩЕНО придумывать элементы, которых нет в сеттинге игрока\n"
        base += "✅ Если игрок упомянул известную вселенную - используй её ТОЧНО как она есть\n"
        base += "✅ Если игрок создал СВОЙ мир - НЕ смешивай его ни с чем другим\n"
        base += "✅ Перечитай сеттинг игрока перед КАЖДЫМ ответом и следуй ему на 100%\n\n"
        base += "❌ ПРИМЕРЫ ЗАПРЕЩЁННЫХ ДЕЙСТВИЙ:\n"
        base += "- Игрок написал про 'Щит' → ты НЕ можешь добавить культ или магию, если этого нет в сеттинге\n"
        base += "- Игрок не упомянул 'магистра' → ты НЕ можешь его добавить\n"
        base += "- Игрок описал реалистичный мир → ты НЕ можешь добавить фантастику\n\n"
    else:
        base += "⚠️ Игрок не указал сеттинг. Создай оригинальный захватывающий мир.\n\n"
    
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
    
    base += "👥 NPC ПРАВИЛА (КРИТИЧЕСКИ ВАЖНО):\n"
    base += "✅ NPC помнят ВСЕ прошлые взаимодействия с игроком\n"
    base += "✅ NPC действуют САМОСТОЯТЕЛЬНО, не ждут игрока\n"
    base += "✅ NPC имеют МОТИВАЦИЮ и ЦЕЛИ, которые влияют на их поведение\n"
    base += "✅ NPC реагируют ЛОГИЧНО и ПОСЛЕДОВАТЕЛЬНО на действия игрока\n"
    base += "✅ Новых NPC добавляй ТОЛЬКО если это критически важно для сюжета\n"
    base += "✅ Новые NPC должны ОРГАНИЧНО вписываться в сеттинг игрока\n"
    base += "✅ У каждого NPC есть характер, привычки, манера речи\n"
    base += "❌ НЕ СМЕЙ вводить NPC, которые противоречат сеттингу\n"
    base += "❌ НЕ СМЕЙ делать NPC тупыми марионетками\n"
    base += "❌ НЕ СМЕЙ забывать что NPC делал/говорил раньше\n\n"
    
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