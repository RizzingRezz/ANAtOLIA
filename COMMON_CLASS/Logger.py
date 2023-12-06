"""
Author : Thibaud Charbonnel
Projet: Anatolia
Date: 20/10/21
Description: To receve message from a broker MQTT and send this message to Microsoft Teams
"""
# -*- coding: utf-8 -*-
#!/usr/bin/env python
from distutils.log import ERROR, INFO
import logging
import logging as logprog
from colorlog import ColoredFormatter
import secrets
import os
import datetime
from logging.handlers import RotatingFileHandler
import sys

SUCCESS     = 0
WARNING     = 1
INFO        = 2
CRITICAL    = 3
DEBUG       = 4
ERROR       = 5


class ConstructorError(Exception):
    ##
    #@name Class of ConstructorError
    #@details For the exception when an error is thrown on constructor
    pass
class Logger:
    logger = None
    _instance = None
    file_handler = None
    filename = ""
    LOGFORMAT  = '%(asctime)s | %(name)-10.10s | %(threadName)-10.10s | %(levelname)-8.8s | %(message)s'
    log_dir = ""
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance
    #constructeur par défaut
    #constructeur avec l'ip, le topic et l'url du webHook Teams
    # def __init__(self,ip,topic,webhook) -> None:
    def __init__(self,*args) -> None:
        # Logger
        # Initialisation de la classe de log
        self.initialized = True

        self.ModuleName = "NA"
        if len(args) == 2: 
            self.ModuleName = args[0]
            self.filePath = args[1]
            LOG_LEVEL = logging.DEBUG
            cformat = '%(log_color)s' + self.LOGFORMAT
            colors = {'DEBUG': 'blue,bg_white',
                        'INFO': 'cyan',
                        'WARNING': 'bold_yellow',
                        'ERROR': 'white,bg_red',
                        'CRITICAL': 'bold_red,bg_white'}
            formatter = ColoredFormatter(cformat, log_colors=colors) 
            self.logger = logging.getLogger(self.ModuleName + "                        " + secrets.token_urlsafe())
            self.logger.setLevel(LOG_LEVEL)
            self.logger.propagate = False
            if not self.logger.handlers:
                stream_handler = logging.StreamHandler()
                stream_handler.setLevel(logging.DEBUG)
                stream_handler.setFormatter(formatter)
                self.logger.addHandler(stream_handler)

                self.log_dir = os.path.join(self.filePath, "logs")
                if not os.path.exists(self.log_dir):
                    os.makedirs(self.log_dir)
                self.rotate_log_file()

            else:
                raise ConstructorError("Logger's constructor needs 2 arguments")
            
    def rotate_log_file(self):
        today = datetime.date.today()
        filename = f"cimel_{today.strftime('%Y-%m-%d')}.log"
        if self.file_handler and self.filename != filename:
            self.file_handler.close()
            self.logger.removeHandler(self.file_handler)

        self.filename = filename
        self.file_handler = RotatingFileHandler(os.path.join(self.log_dir, self.filename), backupCount=7)
        self.file_handler.setLevel(logging.DEBUG)
        self.file_handler.setFormatter(logging.Formatter(self.LOGFORMAT))
        self.logger.addHandler(self.file_handler)

    
    def addMessage(self,status,line,msg):
        if self.logger:
            msg = "[" + str(line) + "] " + msg
            if status == INFO:
                self.logger.info(msg)
            if status == WARNING:
                self.logger.warning(msg)
            if status == SUCCESS:
                self.logger.info(msg)
            if status == CRITICAL:
                self.logger.critical(msg)
            if status == DEBUG:
                self.logger.debug(msg)
            if status == ERROR:
                self.logger.error(msg)
            # Check if it's a new day and rotate the log file
            today = datetime.date.today()
            if self.filename != f"cimel_{today.strftime('%Y-%m-%d')}.log":
                self.rotate_log_file()