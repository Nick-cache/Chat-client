FROM python:3.10

WORKDIR /app

COPY ./backend/requirements.txt /app/requirements.txt

RUN	apt-get update
RUN	apt-get -y install python3-dev gcc libc-dev git
RUN	apt-get clean
RUN	pip install pip --upgrade

RUN pip install -r requirements.txt
RUN mkdir libs && cd libs && git clone https://github.com/eradman/entr
RUN cd libs/entr && ./configure && make install
