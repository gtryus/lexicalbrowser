#!/usr/bin/env python
#Boa:PyApp:main

modules ={}

def main():
    print '<?xml version="1.0" encoding="UTF-8"?>\n<keyList>\n'
    for line in open('Extended Chars.txt').readlines():
        parts = line.split('\t')
        print '<key><composite>%s</composite><compUtf8>%s</compUtf8></key>\n' % tuple(parts[:2])
    print '</keyList>\n'

if __name__ == '__main__':
    main()
