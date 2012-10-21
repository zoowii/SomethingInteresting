#include <iostream>
#include <cstdio>
using namespace std;

bool inPrimes(int *primes, long long primes_count, long long num) {
	if(num > primes_count) {
		return false;
	}
	if((primes[num - 1] >> (num % 32)) % 2 != 0) {
		return true;
	}else {
		return false;
	}
}

bool isPrime(int *primes, long long *primes_count, long long num) {
	if(num < 2L) {
		return false;
	} else if(num == 2L) {
		return true;
	}
	long long i = 3L;
	while(i < (static_cast<long long>(sqrt(num)) + 1L)) {
		if(!inPrimes(primes, *primes_count, i)) { // 没在已经计算过的质数中
			if(isPrime(primes, primes_count, i)) { // 递归判断是否质数
				if(num  % i == 0) { // 是合数
					return false;
				} else { // 是质数
					i+=2L;
					continue;
				}
			} else { // 是合数
				i += 2L;
				continue;
			}
		}
		if(num % i == 0) {
			return false;
		}
		i += 2L;
	}
	primes[static_cast<long long>((*primes_count)/32)] |= (1<<static_cast<long long>((*primes_count)%32));
	*primes_count = num;
	return true;
}

int main()
{
	long long n;
	printf("请输入一个正整数：");
	scanf("%lld", &n);
	long long middle = static_cast<long long>(sqrt(n)) + 1L;
	long long primes_max_size = middle/32 + 1;

	int * primes = new int[primes_max_size]; // 存放已经计算过的质数，第i(0开始)个int的从右数第j(0开始)位是否为1表示整数32*i + j是否为质数
	memset(primes, 0, sizeof(primes));
	primes[0] = 12; // b0000 0000 0000 0000 1100
	long long primes_count = 3; // largest prime in primes

	if(n < 2) {
		printf("%lld没有质因数", n);
	} else if(n == 2) {
		printf("2\n");
	} else {
		long long start = n % 2 == 0 ? (n-1) : n;
		for(long long i=start;i>2;i-=2) {
			if(isPrime(primes, &primes_count, i)) {
				printf("%lld\n", i);
				break;
			}
		}
		printf("End\n");
	}
	printf("largest prime: %lld\n", primes_count);
	free(primes);
	return 0;
}