"""
Author : Thibaud Charbonnel
Projet: Anatolia
Date: 22/10/21
Description: To connect the bdd and select values
"""
# -*- coding: utf-8 -*-
#!/usr/bin/env python
from pickle import FALSE
import mysql.connector
from mysql.connector import errorcode
from COMMON_CLASS.Logger import *
import sys

class bddClass:
    ##
    #@name Class of bddCATS
    pLog = None
    mydb = None
    execSql = None
    _bIsConnected = False
    def __init__(self,ipBdd,login,pwd,database, port, pLog) -> None:
        ##
        #Constructor of the class 
        #@param ipBdd: The Ip of the bdd
        #@param login: The login for the bdd
        #@param pwd: The pwd for the bdd
        #@param database: The name of the data base 
        try:
            self.pLog = pLog
            self.ipBdd = ipBdd
            self.login = login
            self.pwd = pwd
            self.database = database
            self.port = port
            self.errorMsg = []
        except Exception as err:
            print(err)
        pass
    def __del__(self):
        ##
        #Destructor of the class
        #@details: Put the mydb and execSql param to None
        self.mydb.close()
        self.mydb = None
        self.execSql = None
        self.pLog.addMessage(DEBUG,sys._getframe().f_lineno,"Destructeur de la classe bddCATS ")
    def get_errorMsg(self):
        ##
        #@brief bddCATS:get_errorMsg
        #@return: The error message
        return self.errorMsg
    def rm_errorMsg(self):
        ##
        #@brief bddCATS:rm_errorMsg
        #@details msg: Clear Error message
        self.errorMsg.clear()
    #connexion à la bdd
    def connect(self):
        ##
        #@brief bddCATS:connect
        #@details: To connect to the bdd with the port 3306
        #@return: The status of the method
        status = 0
        try:
            self.mydb = mysql.connector.connect(
                user = self.login,
                password = self.pwd,
                host = self.ipBdd,
                database = self.database,
                # port = 3306
                port = self.port,
                autocommit = True
            )
            self.execSql = self.mydb.cursor()
            self._bIsConnected = True
            self.errorMsg.append("")
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                self.pLog.addMessage(ERROR,sys._getframe().f_lineno,"Something is wrong with your user name or password")
                self.errorMsg.append("Something is wrong with your user name or password")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                self.pLog.addMessage(ERROR,sys._getframe().f_lineno,"Database "  + self.ipBdd + " does not exist")
                self.errorMsg.append("DataBase doesn't exist")
            else:
                self.pLog.addMessage(ERROR,sys._getframe().f_lineno, err.msg)
                self.errorMsg.append(err.msg)
            self._bIsConnected = False
            status = 1
        return status
    def sqlRequest(self,selectData):
        ##
        #@brief bddCATS:sqlRequest
        #param selectdata: The SQL request 
        #@details: Return the result of the SQL request 
        #@return: values of bdd
        res = []
        try:
            self.execSql.execute(selectData)
            res = self.execSql.fetchall()
        except mysql.connector.Error as err:
            self.pLog.addMessage(ERROR,sys._getframe().f_lineno, err)
            self._bIsConnected = False
            #self.set_errorMsg("Can't read database.")
        return res

