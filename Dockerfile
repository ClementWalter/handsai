FROM python:3.6-slim-buster

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry config virtualenvs.create false
COPY poetry.lock .
COPY pyproject.toml .
RUN poetry install

COPY . .

CMD gunicorn app:app -b 0.0.0.0:${PORT} --reload --log-level debug --capture-output
