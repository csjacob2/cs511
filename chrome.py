from flask import Flask, request
from flask_cors import CORS, cross_origin
from tokenizer import tokenizer
from testParser import parse
import subprocess
import sys

app = Flask(__name__)


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

data=[]
@app.route("/hello", methods=['GET','POST'])
def hello():
    print "In Server"
    data = request.stream.read()
    with open("test.txt", "w") as test:
        test.write(data)
    test.close()
    tokenizer("test.txt")
    # subprocess.call("perl -ne 'chomp; print \"$_\tO\n\"' test.tok > test.tsv", shell=True)
    # subprocess.call("java -cp stanford-ner/-ner.jar stanford-ner/edu.stanford.nlp.ie.crf.CRFClassifier -prop hardDrive.prop", shell=True)
    subprocess.call(
        "java -cp stanford-ner/stanford-ner.jar edu.stanford.nlp.ie.crf.CRFClassifier -loadClassifier ner-model.ser.gz -testFile test.tok > test.tok.txt",
        shell=True)
    data = parse("test.tok.txt")
    print data
    return data


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=sys.argv[1])
