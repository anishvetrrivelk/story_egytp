# connection.py
import psycopg2

def get_connection():
    return psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="ak8485",
        host="localhost",
        port="5432"
    )
