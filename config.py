import mysql.connector

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="rootpassword",
        database="nasa_db"
    )
    return connection