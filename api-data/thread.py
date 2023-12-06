from flask import Flask, request
import zipfile
import os
import shutil
import threading
import smtplib
import configparser
from email.mime.text import MIMEText

app = Flask(__name__)


_script_path = os.path.abspath(__file__)
_script_directory = os.path.dirname(_script_path)
os.chdir(_script_directory)

_folder_path = os.getcwd()

def readInitFile():
    try:
        global _smtpServer
        global _smtpPort
        global _smtpLogin
        global _smtpPwd
        # Create an instance of ConfigParser
        config = configparser.ConfigParser()
        config.read(f'{_folder_path}/config.ini')
        _smtpServer = config.get("SMTP", "smtp_server")
        _smtpPort = config.get("SMTP", "smtp_port")
        _smtpLogin = config.get("SMTP", "smtp_username")
        _smtpPwd = config.get("SMTP", "smtp_password")
    except Exception as err:
        print(err)

def sendEmail(link,recipient):
    msg = MIMEText(f"Here is your link to the data you selected : https://anatolia-data.oca.eu/downloads/folder_website/{link}\n\nThis link is avaible for 7 days.")
    msg['Subject'] = f"Your download from anatolia-data.oca.eu"
    msg['From'] = "anatolia@oca.eu"
    msg['To'] = recipient
    server = smtplib.SMTP(_smtpServer, _smtpPort)
    server.starttls()
    server.login(_smtpLogin, _smtpPwd)
    text = msg.as_string()
    server.sendmail(_smtpLogin, recipient, text)

def zip_paths(file_paths, output_path):
    thread_id = threading.current_thread().ident
    temp_dir = f"/tmp/temp_zip_dir_{thread_id}"
    os.makedirs(temp_dir, exist_ok=True)
    
    for file_path in file_paths:
        dest_path = os.path.join(temp_dir, os.path.relpath(file_path, '/'))  # Keep the original structure
        if os.path.isfile(file_path):
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy(file_path, dest_path)
        elif os.path.isdir(file_path):
            shutil.copytree(file_path, dest_path)

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(temp_dir):
            for file in files:
                full_file_path = os.path.join(root, file)
                arcname = os.path.relpath(full_file_path, temp_dir)
                zipf.write(full_file_path, arcname=arcname)

    shutil.rmtree(temp_dir)
    print(f"Thread {thread_id} finished processing files")



def process_zip(file_paths, zip_name, recipient):
    if file_paths:
        zip_paths(file_paths, zip_name)
        sendEmail(zip_name.split('/')[-1], recipient)
    else:
        print("No files to zip")

@app.route('/thread', methods=['POST'])
def start_thread():
    data = request.json  # Get JSON data from request body
    if 'fileFound' in data:
        needThread=False
        files = data['fileFound']
        zip_path = data['zip_path']
        recipient = data['recipient']
        for file in files:
            if "COD_16bit" in file or "cloudview" in file or "cloud_cover_8bit" in file:
                needThread = True
                break
        
        if (needThread):
            print(f"in thread: {files}")
            thread = threading.Thread(target=process_zip, args=(files,zip_path,recipient))
            thread.start()
            return files
        else:
            print(f"not thread: {files}")
            zip_paths(files,zip_path)
            return files
    else:
        return "No 'fileFound' data provided", 400
    
@app.route('/test', methods=['GET'])
def test():
    return "ok"

if __name__ == '__main__':
    readInitFile()
    app.run(host='192.54.174.120',port=3000)
    
