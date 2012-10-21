#/usr/bin/python2.7
import math

def isPrime(num):
	if num < 2: return False
	if num == 2: return True
	if num % 2 == 0: return False
	half = int(math.sqrt(num)) + 1
	for i in range(3, half + 1, 2):
		if num % i == 0: return False
	return True

num = int(raw_input("Input a number to check if it's a prime:"))
if isPrime(num):
	print "%d is a prime" % num
else:
	print "%d isn't a prime" % num
