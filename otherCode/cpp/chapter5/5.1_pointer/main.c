#include<stdio.h>
#include "calc.h"
#define SIZE 100

int main(int argc, char const *argv[])
{
    int n, array[SIZE];
    for ( n = 0; n < SIZE && getint(&array[n])!=EOF;n++)
    {
        printf("%d \n",array[n]);
    }
    return 0;
}
