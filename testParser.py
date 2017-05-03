__author__ = 'arpitgarg'
import csv
import json
def parse(file):
    with open(file, 'rb') as tsvin:
        tsvin = csv.reader(tsvin, delimiter='\t')
        rows = []
        main={}
        count=0
        temp={}
        for row in tsvin:
            if len(row) != 0:
                rows.append(row)
            else:
                temp={}
                count+=1

                for i in range(len(rows)):
                    if rows[i][2]!='O':
                        if rows[i][2] not in temp:
                            temp[rows[i][2]] = rows[i][0]
                        else:
                            temp[rows[i][2]] += ',' + rows[i][0]
                        #print temp
                main[count] = temp
                rows=[]
        arr = json.dumps(main)
        return arr