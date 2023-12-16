# 584 Project 3

## Usage

### Preqrequisite

First, follow the setup for: https://github.com/marvinh-csun/assignment_3_alt

### Backend

To run locally:

- cd into the backend directory

- create a local mysql database named `project2CS485`

- set an environment variable named `DB_PASS` to your mysql password

- install poetry: `pip install poetry`

- install dependencies using poetry: `poetry install --no-root`

- Start the backend app: `python backend.py`

### Frontend

To run locally:

- run with the [index.html file in the frontend directory](/frontend/index.html)

### Notes

- You can filter by columns and categories

- If you do not enter any categories, all businesses will be returned

- You may enter a specific page and hit "submit" to skip to it

- The backend dictates the amount of results shown on each page. See the `ENTRIES_PER_PAGE` in the [backend program](backend/backend.py)
