from flask import Flask, request
from tokenizer import tokenizer
from testParser import parse
import subprocess

app = Flask(__name__)


@app.route("/hello", methods=['POST'])
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
    return data


if __name__ == "__main__":
    app.run()
