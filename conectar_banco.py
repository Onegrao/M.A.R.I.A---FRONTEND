import sqlite3
import pandas as pd

def analisar_dados(db_path='data_to_analyse/machine1.db', n_registros=100):

    # Conectar ao banco de dados
    conexao = sqlite3.connect(db_path)

    #Busca dos ultimos N registros
    query = f"""
    SELECT * FROM sensores ORDER BY id DESC LIMIT {n_registros}
    """
    df = pd.read_sql_query(query, conexao)
    conexao.close()

    if df.empty:
        return "Nenhum dado encontrado."

    #Análise dos dados
    temperatura_media = df['temperatura'].mean()
    umidade_media = df['umidade'].mean()
    alerta_temperatura = (temperatura_media > 30).sum()  
    alerta_umidade = (umidade_media > 70).sum()

    #Resultados
    resultados = {
        'Temperatura Média': temperatura_media,
        'Umidade Média': umidade_media,
        'Alertas de Temperatura': alerta_temperatura,
        'Alertas de Umidade': alerta_umidade
    }

    return resultados
