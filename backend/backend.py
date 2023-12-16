from flask import Flask, request, jsonify
import mysql.connector
import os
import uuid
import traceback
from flask_cors import CORS
from datetime import date
import requests

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="example",
  database="assign",
  port="13313"
)

ENTRIES_PER_PAGE = 25

@app.route('/api/businesses/<int:page>', methods=['POST'])
def get_data(page: int):
  cursor = db.cursor()
  db.commit()

  categories = request.json["categories"]
  columns = request.json["columns"]

  try:
    # Filter data with 3 columns of interest
    sql = "SELECT business_id, name, address,\
      city, state, postal_code, stars, review_count,\
      is_open, categories FROM business"
    cursor.execute(sql)
    data = cursor.fetchall()
    db.commit()

    filtered = []
    categories_empty = True

    for category in categories:
      if category == '':
        continue
      categories_empty = False

    if not categories_empty:
      for element in data:
        for category in categories:
          if category == '':
            continue
          if category not in element[9]:
            continue
          filtered.append(element)
          break
    else:
      filtered = data

    formatted_data = [{
      "business_id": business[0],
      "name": business[1],
      "address": business[2],
      "city": business[3],
      "state": business[4],
      "postal_code": business[5],
      "stars": business[6],
      "review_count": business[7],
      "is_open": business[8],
      "categories": business[9],
    } for business in filtered]

    filtered_by_column = []
    for business in formatted_data:
      business_filtered = {}
      for column in business.keys():
        if column not in columns:
          continue
        business_filtered[column] = business[column]
      filtered_by_column.append(business_filtered)
    # Paginate your results
    # not display more than ENTRIES_PER_PAGE entries at once
    print(f"Getting page {page}")
    page_start = page * ENTRIES_PER_PAGE
    page_end = page_start + ENTRIES_PER_PAGE
    n = len(filtered_by_column)
    response = []
    for i in range(page_start, page_end):
      if i >= n:
        break
      response.append(filtered_by_column[i])
    return jsonify(response), 200
  except Exception as e:
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

@app.route('/api/categories', methods=['GET'])
def get_all_categories():
  cursor = db.cursor()
  db.commit()

  try:
    # Filter data with 3 columns of interest
    sql = "SELECT categories FROM business"
    cursor.execute(sql)
    data = cursor.fetchall()
    categories = [x[0] for x in data]
    db.commit()

    formatted_categories = set()
    for category_str in categories:
      category_list = category_str.split(", ")
      for category in category_list:
        if category in formatted_categories or category == '':
          continue
        formatted_categories.add(category)

    return jsonify([category for category in formatted_categories]), 200
  except Exception as e:
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

if __name__ == "__main__":
  app.run(port=5000, debug=True)