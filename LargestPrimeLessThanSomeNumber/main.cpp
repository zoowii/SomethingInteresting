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
		if(!inPrimes(primes, *primes_count, i)) { // û���Ѿ��������������
			if(isPrime(primes, primes_count, i)) { // �ݹ��ж��Ƿ�����
				if(num  % i == 0) { // �Ǻ���
					return false;
				} else { // ������
					i+=2L;
					continue;
				}
			} else { // �Ǻ���
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
	printf("������һ����������");
	scanf("%lld", &n);
	long long middle = static_cast<long long>(sqrt(n)) + 1L;
	long long primes_max_size = middle/32 + 1;

	int * primes = new int[primes_max_size]; // ����Ѿ����������������i(0��ʼ)��int�Ĵ�������j(0��ʼ)λ�Ƿ�Ϊ1��ʾ����32*i + j�Ƿ�Ϊ����
	memset(primes, 0, sizeof(primes));
	primes[0] = 12; // b0000 0000 0000 0000 1100
	long long primes_count = 3; // largest prime in primes

	if(n < 2) {
		printf("%lldû��������", n);
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