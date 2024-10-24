FROM python:3.10

WORKDIR	/app/src

COPY ./backend/requirements.txt /app/src/requirements.txt

RUN	apt-get update
RUN	apt-get -y install python3-dev gcc libc-dev git
RUN	apt-get clean
RUN	pip install pip --upgrade

RUN pip install -r requirements.txt \
    && rm -rf /root/.cache/pip

RUN pip install pytest httpx
RUN mkdir libs && cd libs && git clone https://github.com/eradman/entr
RUN cd libs/entr && ./configure && make install

