import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление товарами (получение списка, добавление, обновление, удаление)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT id, photo, hint, sku, selling_price, purchase_price, quantity, 
                       created_at::text
                FROM products 
                ORDER BY created_at DESC
            ''')
            rows = cur.fetchall()
            products = []
            for row in rows:
                products.append({
                    'id': str(row[0]),
                    'photo': row[1],
                    'hint': row[2] or '',
                    'sku': row[3] or '',
                    'sellingPrice': float(row[4]) if row[4] else None,
                    'purchasePrice': float(row[5]) if row[5] else None,
                    'quantity': row[6] or 1,
                    'createdAt': row[7]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(products)
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO products (photo, hint, sku, selling_price, purchase_price, quantity)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, created_at::text
            ''', (
                body_data.get('photo'),
                body_data.get('hint', ''),
                body_data.get('sku', ''),
                body_data.get('sellingPrice'),
                body_data.get('purchasePrice'),
                body_data.get('quantity', 1)
            ))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': str(result[0]),
                    'createdAt': result[1]
                })
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            product_id = body_data.get('id')
            
            cur.execute('''
                UPDATE products 
                SET photo = %s, hint = %s, sku = %s, 
                    selling_price = %s, purchase_price = %s, quantity = %s
                WHERE id = %s
            ''', (
                body_data.get('photo'),
                body_data.get('hint', ''),
                body_data.get('sku', ''),
                body_data.get('sellingPrice'),
                body_data.get('purchasePrice'),
                body_data.get('quantity', 1),
                int(product_id)
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            product_id = params.get('id')
            
            cur.execute('DELETE FROM products WHERE id = %s', (int(product_id),))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
