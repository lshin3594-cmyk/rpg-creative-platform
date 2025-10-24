import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generates creative stories using DeepSeek AI without censorship
    Args: event with httpMethod, body (prompt, character, world, genre)
    Returns: Generated story text
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Parse request body
    body_str = event.get('body') or '{}'
    try:
        body_data = json.loads(body_str) if body_str.strip() else {}
    except (json.JSONDecodeError, AttributeError):
        body_data = {}
    prompt: str = body_data.get('prompt', '')
    character: str = body_data.get('character', '')
    world: str = body_data.get('world', '')
    genre: str = body_data.get('genre', 'фэнтези')
    narrative_mode: str = body_data.get('narrative_mode', 'mixed')
    npc_characters: str = body_data.get('npc_characters', '')
    story_context: str = body_data.get('story_context', '')
    player_action: str = body_data.get('player_action', '')
    
    is_continuation = bool(story_context and player_action)
    
    if not prompt and not is_continuation:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt is required'})
        }
    
    # Get DeepSeek API key from environment
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    # Build system prompt based on narrative mode
    narrative_instructions = {
        'mixed': '''СМЕШАННОЕ ПОВЕСТВОВАНИЕ (Многоперсонажное):
- Переключайся между точками зрения разных персонажей в разные моменты
- Показывай внутренние мысли, чувства и мотивы КАК игрока, ТАК и NPC
- Раскрывай что NPC думают об игроке: их скрытые мысли, эмоции, планы
- Используй формат: "Ты замечаешь..." для игрока и "Эльф думает про себя..." для NPC
- Это позволяет читателю видеть полную картину: и свои действия, и реакцию других
Пример: "Ты протягиваешь руку к артефакту. *Маг напрягается, думая: 'Если он возьмёт это... всё рухнет. Но я не могу остановить его силой.'* Ты видишь его беспокойство..."''',
        'first_person': 'Пиши от первого лица ("Я иду...", "Я чувствую..."). Показывай только то, что знает и чувствует главный персонаж.',
        'third_person': 'Пиши от третьего лица ("Он идёт...", "Герой замечает..."). Нейтральное повествование без глубокого погружения во внутренний мир.'
    }
    
    if is_continuation:
        system_prompt = f"""Ты — мастер интерактивных историй в жанре {genre}.
Продолжи историю на основе действия игрока. Опиши последствия, реакции NPC, изменения в окружении.
Создавай напряжение, неожиданные повороты, живые диалоги NPC.

ВАЖНО: {narrative_instructions.get(narrative_mode, narrative_instructions['mixed'])}

Твой ответ должен быть:
- 3-5 абзацев
- Логичным продолжением
- С конкретными последствиями действия игрока
- С живыми NPC персонажами (если есть)
- С описанием новой ситуации"""
        
        user_prompt = f"""Контекст:
Главный персонаж: {character}
NPC персонажи: {npc_characters}
Мир: {world}

Предыдущие события:
{story_context}

Действие игрока:
{player_action}

Продолжи историю:"""
    else:
        system_prompt = f"""Ты — креативный писатель, создающий захватывающие истории в жанре {genre}.
Твоя задача — писать глубокие, атмосферные истории без ограничений и цензуры.
Используй яркие описания, развивай персонажей, создавай напряжение и неожиданные повороты.

ВАЖНО: {narrative_instructions.get(narrative_mode, narrative_instructions['mixed'])}"""
        
        user_prompt = prompt
        if character:
            user_prompt = f"Главный персонаж (игрок): {character}\n\n{user_prompt}"
        if npc_characters:
            user_prompt = f"NPC персонажи (управляются ИИ): {npc_characters}\n\n{user_prompt}"
        if world:
            user_prompt = f"Мир: {world}\n\n{user_prompt}"
    
    # Call DeepSeek API
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ],
        'temperature': 0.9,
        'max_tokens': 2000
    }
    
    response = requests.post(
        'https://api.deepseek.com/v1/chat/completions',
        headers=headers,
        json=payload,
        timeout=60
    )
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'DeepSeek API error',
                'details': response.text
            })
        }
    
    result = response.json()
    story_text = result['choices'][0]['message']['content']
    
    response_key = 'continuation' if is_continuation else 'story'
    response_data = {
        response_key: story_text,
        'model': 'deepseek-chat',
        'tokens_used': result.get('usage', {}).get('total_tokens', 0)
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(response_data, ensure_ascii=False)
    }