__author__ = 'arpitgarg'

def tokenizer(file):
    with open(file, "r") as test, open("test.tok", "w") as tok:
        for line in test:
            if len(line) == 1:
                tok.write("\n")
            else:
                for i in line.split():
                    tok.write(i + "\tO"+"\n")
                    #tok.write(i + "\n")